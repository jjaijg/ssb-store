import { Box, Typography } from "@mui/material";
import { type Address } from "@prisma/client";

interface AddressSummaryProps {
  address: Address;
  isDefault?: boolean;
}

export const AddressSummary = ({ address, isDefault }: AddressSummaryProps) => (
  <Box>
    <Typography variant="subtitle2">{address.name}</Typography>
    <Typography variant="body2">
      {address.door}, {address.street}
      {address.landmark && `, ${address.landmark}`}
    </Typography>
    <Typography variant="body2">
      {address.city}, {address.state} {address.postalCode}
    </Typography>
    {isDefault && (
      <Typography variant="caption" color="primary">
        Default Address
      </Typography>
    )}
  </Box>
);
