"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) => (
  <Card sx={{ p: 2 }}>
    <Typography color="text.secondary" variant="subtitle2">
      {title}
    </Typography>
    <Typography variant="h4" sx={{ my: 1 }}>
      {value}
    </Typography>
    <Typography color="text.secondary" variant="body2">
      {subtitle}
    </Typography>
  </Card>
);

const DashboardDetails = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    salesGrowth: 0,
    totalOrders: 0,
    orderGrowth: 0,
    activeProducts: 0,
    newProductsCount: 0,
    newCustomers: 0,
    customerGrowth: 0,
    salesData: [],
    categoryData: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Sales"
            value={`₹${dashboardData.totalSales}`}
            subtitle={`${Math.sign(dashboardData.salesGrowth) >= 0 ? "+" : ""}${
              dashboardData.salesGrowth
            }% from last month`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            subtitle={`${Math.sign(dashboardData.orderGrowth) >= 0 ? "+" : ""}${
              dashboardData.orderGrowth
            }% from last month`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Products"
            value={dashboardData.activeProducts}
            subtitle={`${
              Math.sign(dashboardData.newProductsCount) >= 0 ? "+" : ""
            }${dashboardData.newProductsCount} new products`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Customer Growth"
            value={`${dashboardData.newCustomers}`}
            subtitle={`${
              Math.sign(dashboardData.customerGrowth) >= 0 ? "+" : ""
            }${dashboardData.customerGrowth} from last month`}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={dashboardData.salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  nameKey="categoryName"
                  dataKey="total"
                  label={({ categoryName, percent }) =>
                    `${categoryName} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Sales",
                  ]}
                  labelFormatter={(categoryName) => `Category: ${categoryName}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardDetails;
