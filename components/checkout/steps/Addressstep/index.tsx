import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";
import { type Address } from "@prisma/client";
import { AddressFields } from "./AddressFields";
import { SavedAddressSelection } from "./SavedAddressSelection";

interface Props {
  savedAddresses: { shippingAddresses: Address[]; billingAddresses: Address[] };
}

export const AddressStep = ({ savedAddresses }: Props) => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const { watch, setValue, reset } = useFormContext<CheckoutFormData>();

  const showBillingAddress = !watch("sameAsShipping");
  const shippingAddress = watch("shippingAddress");
  const billingAddress = watch("billingAddress");

  // Set default address if available
  useEffect(() => {
    const { shippingAddresses, billingAddresses } = savedAddresses;
    if (shippingAddresses.length > 0) {
      const defaultAddress = shippingAddresses.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        const address = {
          ...defaultAddress,
          landmark: defaultAddress.landmark ?? undefined,
        };
        setValue("shippingAddress", address);
      }
    }
    if (billingAddresses.length > 0) {
      const defaultAddress = billingAddresses.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        const address = {
          ...defaultAddress,
          landmark: defaultAddress.landmark ?? undefined,
        };
        setValue("billingAddress", address);
      }
    }
  }, [savedAddresses, setValue]);

  useEffect(() => {
    const isSameAsShipping = watch("sameAsShipping");
    if (isSameAsShipping && shippingAddress) {
      Object.keys(shippingAddress).forEach((key) => {
        setValue(
          `billingAddress.${key as keyof typeof shippingAddress}`,
          shippingAddress[key as keyof typeof shippingAddress]
        );
      });
    }
  }, [shippingAddress, setValue, watch]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>

      {savedAddresses.shippingAddresses.length > 0 && (
        <>
          <SavedAddressSelection
            prefix="shippingAddress"
            savedAddresses={savedAddresses.shippingAddresses}
          />
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setShowNewAddressForm(true);
              reset();
            }}
            sx={{ my: 2 }}
          >
            Add New Address
          </Button>
        </>
      )}

      {((showNewAddressForm && !shippingAddress.id) ||
        savedAddresses.shippingAddresses.length === 0) && (
        <AddressFields prefix="shippingAddress" />
      )}

      <Box sx={{ mt: 3 }}>
        <Controller
          name="sameAsShipping"
          control={useFormContext<CheckoutFormData>().control}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label="Billing address same as shipping address"
            />
          )}
        />
      </Box>

      {showBillingAddress && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Billing Address
          </Typography>
          {savedAddresses.billingAddresses.length > 0 && (
            <SavedAddressSelection
              prefix="billingAddress"
              savedAddresses={savedAddresses.billingAddresses}
            />
          )}
          {((showNewAddressForm && !billingAddress.id) ||
            savedAddresses.billingAddresses.length === 0) && (
            <AddressFields prefix="billingAddress" />
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddressStep;
