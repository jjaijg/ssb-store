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
import { DEFAULT_CHECKOUT_DATA } from "@/lib/constants";

interface Props {
  savedAddresses: { shippingAddresses: Address[]; billingAddresses: Address[] };
}

export const AddressStep = ({ savedAddresses }: Props) => {
  const [showNewShipAddressForm, setShowNewShipAddressForm] = useState(false);
  const [showNewBillAddressForm, setShowBillNewAddressForm] = useState(false);
  const { watch, setValue } = useFormContext<CheckoutFormData>();

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
    if (!showBillingAddress) {
      setValue("billingAddress", undefined);
    }
  }, [showBillingAddress, setValue]);

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
              setShowNewShipAddressForm(true);
              setValue("shippingAddress", {
                ...DEFAULT_CHECKOUT_DATA.shippingAddress,
              });
            }}
            sx={{ my: 2 }}
          >
            Add New Address
          </Button>
        </>
      )}

      {((showNewShipAddressForm && !shippingAddress.id) ||
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
            <>
              <SavedAddressSelection
                prefix="billingAddress"
                savedAddresses={savedAddresses.billingAddresses}
              />
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  setShowBillNewAddressForm(true);
                  setValue(
                    "billingAddress",
                    DEFAULT_CHECKOUT_DATA.billingAddress
                      ? DEFAULT_CHECKOUT_DATA.billingAddress
                      : undefined
                  );
                }}
                sx={{ my: 2 }}
              >
                Add New Address
              </Button>
            </>
          )}
          {((showNewBillAddressForm && !billingAddress?.id) ||
            savedAddresses.billingAddresses.length === 0) && (
            <AddressFields prefix="billingAddress" />
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddressStep;
