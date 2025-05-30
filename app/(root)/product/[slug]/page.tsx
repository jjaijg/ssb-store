import { getProductBySlug } from "@/lib/actions/product.actions";
import { getUserCart } from "@/lib/actions/cart.actions";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/shared/ProductDetails";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const [product, cart] = await Promise.all([
    getProductBySlug(slug),
    getUserCart(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} cart={cart} />;
}
