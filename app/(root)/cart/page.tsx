import { getUserCart } from "@/lib/actions/cart.actions";
import CartDetails from "./CartDetails";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getUserCart();

  return <CartDetails cart={cart} />;
}
