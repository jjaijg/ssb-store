import { Metadata } from "next";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import { getUserCart } from "@/lib/actions/cart.actions";
import { getSavedAddresses } from "@/lib/actions/checkout.actions";

export const metadata: Metadata = {
  title: "Checkout - SSB Store",
  description: "Complete your purchase",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/checkout");
  }

  const [cart, addresses] = await Promise.all([
    getUserCart(),
    getSavedAddresses(),
  ]);

  if (!cart) return notFound();

  const savedAddresses = addresses || {
    shippingAddresses: [],
    billingAddresses: [],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutStepper cart={cart} savedAddresses={savedAddresses} />
    </Container>
  );
}
