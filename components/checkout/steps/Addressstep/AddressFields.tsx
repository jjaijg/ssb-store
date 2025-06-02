import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";

interface AddressFieldsProps {
  prefix: "shippingAddress" | "billingAddress";
}

export const AddressFields = ({ prefix }: AddressFieldsProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          {...register(`${prefix}.name`)}
          fullWidth
          required
          label="Address Type (e.g., Home, Office)"
          error={!!errors[prefix]?.name}
          helperText={errors[prefix]?.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          {...register(`${prefix}.door`)}
          fullWidth
          required
          label="Door/Flat/Building No."
          error={!!errors[prefix]?.door}
          helperText={errors[prefix]?.door?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          {...register(`${prefix}.street`)}
          fullWidth
          required
          label="Street/Area"
          error={!!errors[prefix]?.street}
          helperText={errors[prefix]?.street?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          {...register(`${prefix}.landmark`)}
          fullWidth
          label="Landmark (Optional)"
          error={!!errors[prefix]?.landmark}
          helperText={errors[prefix]?.landmark?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          {...register(`${prefix}.city`)}
          fullWidth
          required
          label="City"
          error={!!errors[prefix]?.city}
          helperText={errors[prefix]?.city?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name={`${prefix}.state`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel>State</InputLabel>
              <Select {...field} label="State">
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                <MenuItem value="Kerala">Kerala</MenuItem>
                <MenuItem value="Karnataka">Karnataka</MenuItem>
                {/* Add more states as needed */}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          {...register(`${prefix}.postalCode`)}
          fullWidth
          required
          label="Postal Code"
          error={!!errors[prefix]?.postalCode}
          helperText={errors[prefix]?.postalCode?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          {...register(`${prefix}.country`)}
          fullWidth
          required
          label="Country"
          defaultValue="India"
          disabled
          error={!!errors[prefix]?.country}
          helperText={errors[prefix]?.country?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Controller
              name={`${prefix}.isDefault`}
              control={control}
              render={({ field: props }) => (
                <Checkbox
                  {...props}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                />
              )}
            />
          }
          label="Set as default address"
        />
      </Grid>
    </Grid>
  );
};
