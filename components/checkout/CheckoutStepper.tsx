"use client";

import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/validationSchema/checkout.schema";
import { AddressStep } from "./steps/Addressstep";
import PaymentStep from "./steps/PaymentStep";
import ReviewStep from "./steps/ReviewStep";
import { SerializedCart } from "@/types";
import { Address } from "@prisma/client";

const steps = ["Shipping", "Payment", "Review"];

type Props = {
  cart: SerializedCart;
  savedAddresses: { shippingAddresses: Address[]; billingAddresses: Address[] };
};

export default function CheckoutStepper({ cart, savedAddresses }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      sameAsShipping: false,
      paymentMethod: "RAZORPAY",
      shippingAddress: {
        type: "SHIPPING",
        state: "Tamil Nadu",
        country: "India",
        isDefault: false,
      },
      billingAddress: {
        type: "BILLING",
        state: "Tamil Nadu",
        country: "India",
        isDefault: false,
      },
    },
  });

  const handleNext = async () => {
    // const isSameAsShipping = methods.getValues("sameAsShipping");
    // if (isSameAsShipping) {
    //   methods.setValue("billingAddress", {
    //     ...methods.getValues("shippingAddress"),
    //   });
    // }
    const isValid = await methods.trigger();
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    // Handle form submission
    // console.log(data);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddressStep savedAddresses={savedAddresses} />;
      case 1:
        return <PaymentStep />;
      case 2:
        return <ReviewStep cart={cart} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={methods.formState.isSubmitting}
              >
                Place Order
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={methods.formState.isSubmitting}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </FormProvider>
  );
}
