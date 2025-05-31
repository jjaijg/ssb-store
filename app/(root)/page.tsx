import {
  BenefitsSection,
  BrandShowcase,
  FeaturedCategories,
  FeaturedProducts,
  HeroSection,
  SpecialOffers,
} from "@/components/shared/home";
import { FeaturedSkeleton } from "@/components/shared/skeletons/FeaturedSkeleton";
import { getFeaturedBrands } from "@/lib/actions/brand.actions";
import { getUserCart } from "@/lib/actions/cart.actions";
import { getFeaturedCategories } from "@/lib/actions/category.actions";
import {
  getFeaturedProducts,
  getProductsWithBanner,
} from "@/lib/actions/product.actions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SSB Store - Your One Stop Shop",
  description: "Discover amazing products at great prices",
};

export default async function Home() {
  const [
    bannerProducts,
    featuredProducts,
    featuredCategories,
    featuredBrands,
    cart,
  ] = await Promise.all([
    getProductsWithBanner({ limit: 5 }),
    getFeaturedProducts({ limit: 8 }),
    getFeaturedCategories({ limit: 8 }),
    getFeaturedBrands({ limit: 8 }),
    getUserCart(),
  ]);
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection products={bannerProducts} />
      <Suspense fallback={<FeaturedSkeleton height={200} />}>
        <FeaturedCategories categories={featuredCategories} />
      </Suspense>
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts products={featuredProducts} cart={cart} />
      </Suspense>
      <SpecialOffers />
      <Suspense fallback={<FeaturedSkeleton height={120} />}>
        <BrandShowcase brands={featuredBrands} />
      </Suspense>
      <BenefitsSection />
    </main>
  );
}
