import { getUserCart } from "@/lib/actions/cart.actions";
import { notFound } from "next/navigation";
import CartDetails from "./CartDetails";

export default async function CartPage() {
  const cart = await getUserCart();

  return <CartDetails cart={cart} />;
}
