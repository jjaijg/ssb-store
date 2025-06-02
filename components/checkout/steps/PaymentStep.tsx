import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";
import Image from "next/image";

const PaymentStep = () => {
  const { control, watch } = useFormContext<CheckoutFormData>();
  const paymentMethod = watch("paymentMethod");

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <FormControlLabel
                  value="RAZORPAY"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Image
                        src="/images/rpay.webp"
                        alt="Razorpay"
                        width={80}
                        height={24}
                        priority
                      />
                      <Typography>
                        Credit/Debit Card, UPI, Netbanking
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <FormControlLabel
                  value="COD"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Image
                        src="/images/cod.webp"
                        alt="Cash on Delivery"
                        width={80}
                        height={24}
                        priority
                      />
                      <Typography>Cash on Delivery</Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </RadioGroup>
        )}
      />

      <Box sx={{ mt: 3 }}>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={4}
              fullWidth
              label="Order Notes (Optional)"
              placeholder="Any special instructions for delivery"
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default PaymentStep;
