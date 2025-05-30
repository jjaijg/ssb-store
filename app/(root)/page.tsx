import ProductCard from "@/components/shared/ProductCard";
import { getUserCart } from "@/lib/actions/cart.actions";
import { getProductswithVariants } from "@/lib/actions/product.actions";
import { Stack } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home`,
};

export default async function Home() {
  const cart = await getUserCart();
  const products = await getProductswithVariants({ limit: 10 });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        Welcome to SSB Store - Root page
        <section>
          <Stack direction={"row"} spacing={2}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} cart={cart} />
            ))}
          </Stack>
        </section>
      </main>
    </div>
  );
}
