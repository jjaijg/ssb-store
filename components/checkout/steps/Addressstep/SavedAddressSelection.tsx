import {
  Grid,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { type Address } from "@prisma/client";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";
import { AddressSummary } from "./AddressSummary";

interface SavedAddressSelectionProps {
  prefix: "shippingAddress" | "billingAddress";
  savedAddresses: Address[];
}

export const SavedAddressSelection = ({
  prefix,
  savedAddresses,
}: SavedAddressSelectionProps) => {
  const { watch, setValue } = useFormContext<CheckoutFormData>();

  const addressId = watch(`${prefix}.id`);

  return (
    <RadioGroup id={prefix} value={addressId || ""} sx={{ my: 2 }}>
      <Grid container spacing={2}>
        {savedAddresses.map((address) => (
          <Grid size={{ xs: 12, md: 6 }} key={address.id}>
            <Paper
              sx={{
                p: 2,
                border: "1px solid",
                borderColor:
                  addressId === address.id ? "primary.main" : "divider",
              }}
            >
              <FormControlLabel
                value={address.id}
                control={<Radio />}
                label={
                  <AddressSummary
                    address={address}
                    isDefault={address.isDefault}
                  />
                }
                onChange={() => {
                  setValue(`${prefix}`, {
                    ...address,
                    landmark: address.landmark ?? undefined,
                  });
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};
