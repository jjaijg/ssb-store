import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { isAdminAuthenticated } from "@/lib/auth/adminAuth";

export interface DailySales {
  date: Date;
  total: number;
  count: number;
}

export interface CategorySales {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
}

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated(req);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const now = new Date();
    const currentMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    const [
      currentMonthSales,
      lastMonthSales,
      currentMonthOrders,
      lastMonthOrders,
      activeProducts,
      newProductsCount,
      customerGrowthData,
      categoryData,
      salesData,
    ] = await Promise.all([
      // Current month sales
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: currentMonth.start, lte: currentMonth.end },
          status: "DELIVERED",
        },
      }),
      // Last month sales
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: lastMonth.start, lte: lastMonth.end },
          status: "DELIVERED",
        },
      }),
      // Current month orders
      prisma.order.count({
        where: {
          createdAt: { gte: currentMonth.start, lte: currentMonth.end },
        },
      }),
      // Last month orders
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonth.start, lte: lastMonth.end },
        },
      }),
      // Active products
      prisma.product.count({
        where: { status: "ACTIVE" },
      }),
      // New products added this month
      prisma.product.count({
        where: {
          status: "ACTIVE",
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
        },
      }),
      // Customer growth - count unique customers
      prisma.user.count({
        where: {
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
          role: "CUSTOMER", // Assuming you have role-based users
        },
      }),
      // Sales by category
      prisma.$queryRaw<CategorySales[]>`
  SELECT 
    c.id as "categoryId",
    c.name as "categoryName",
    SUM(oi.price * oi.quantity) as total,
    COUNT(DISTINCT o.id) as count
  FROM "orders" o
  JOIN "order_items" oi ON o.id = oi."orderId"
  JOIN "ProductVariant" pv ON oi."variantId" = pv.id
  JOIN "Product" p ON pv."productId" = p.id
  JOIN "Category" c ON p."categoryId" = c.id
  WHERE o."createdAt" >= ${currentMonth.start}
    AND o."createdAt" <= ${currentMonth.end}
    AND o.status = 'DELIVERED'
  GROUP BY c.id, c.name
  ORDER BY total DESC
`,
      // Daily sales data
      prisma.$queryRaw<DailySales[]>`
        SELECT 
          DATE("createdAt") as date,
          SUM(total) as total,
          COUNT(*) as count
        FROM "orders"
        WHERE "createdAt" >= ${currentMonth.start}
          AND "createdAt" <= ${currentMonth.end}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

    const lastMonthCustomers = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth.start,
          lte: lastMonth.end,
        },
        role: "CUSTOMER",
      },
    });

    const customerGrowth =
      lastMonthCustomers === 0
        ? customerGrowthData > 0
          ? 100
          : 0
        : Number(
            ((customerGrowthData - lastMonthCustomers) / lastMonthCustomers) *
              100
          ).toFixed(1);

    const orderGrowth =
      lastMonthOrders === 0
        ? currentMonthOrders > 0
          ? 100
          : 0
        : Number(
            ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          ).toFixed(1);

    const curSales = Number(currentMonthSales._sum.total) || 0;
    const lastSales = Number(lastMonthSales._sum.total) || 0;
    const salesGrowth =
      lastSales === 0
        ? curSales > 0
          ? 100
          : 0
        : Number(((curSales - lastSales) / lastSales) * 100).toFixed(1);

    return NextResponse.json({
      totalSales: curSales,
      salesGrowth,
      totalOrders: currentMonthOrders,
      orderGrowth,
      activeProducts,
      newProductsCount,
      customerGrowth,
      newCustomers: customerGrowthData,
      salesData: salesData.map((item) => ({
        date: format(item.date, "MMM dd"),
        orders: Number(item.count),
        sales: Number(item.total) || 0,
      })),
      categoryData: categoryData.map((item) => ({
        categoryName: item.categoryName,
        orders: Number(item.count),
        total: Number(item.total) || 0,
      })),
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
