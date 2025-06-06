import {
  Box,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";
import { SerializedCart } from "@/types";

type Props = {
  cart: SerializedCart;
};

const AddressSummary = ({
  title,
  address,
}: {
  title: string;
  address: CheckoutFormData["shippingAddress"];
}) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" gutterBottom>
      {address.name}
    </Typography>
    <Typography variant="body2" gutterBottom>
      {address.door}
    </Typography>
    <Typography variant="body2" gutterBottom>
      {address.street}
    </Typography>
    {address.landmark && (
      <Typography variant="body2" gutterBottom>
        {address.landmark}
      </Typography>
    )}
    <Typography variant="body2" gutterBottom>
      {address.city}, {address.state} {address.postalCode}
    </Typography>
    <Typography variant="body2">{address.country}</Typography>
  </Box>
);

const ReviewStep = ({ cart }: Props) => {
  const { watch } = useFormContext<CheckoutFormData>();

  const formData = watch();

  // Calculate totals
  const orderSummary = cart.items.reduce(
    (summary, item) => {
      const itemPrice = Number(item.variant.price);
      const itemTotal = itemPrice * item.quantity;
      let itemDiscount = 0;

      // Calculate discount based on discountType
      if (
        item.variant.discountType === "PERCENTAGE" &&
        item.variant.discountValue
      ) {
        itemDiscount = (itemTotal * Number(item.variant.discountValue)) / 100;
      } else if (
        item.variant.discountType === "FIXED" &&
        item.variant.discountValue
      ) {
        itemDiscount = Number(item.variant.discountValue) * item.quantity;
      }

      return {
        subtotal: summary.subtotal + itemTotal,
        totalDiscount: summary.totalDiscount + itemDiscount,
      };
    },
    { subtotal: 0, totalDiscount: 0 }
  );

  const finalTotal = orderSummary.subtotal - orderSummary.totalDiscount;

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Addresses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AddressSummary
            title="Shipping Address"
            address={formData.shippingAddress}
          />
        </Grid>
        {!formData.sameAsShipping && formData.billingAddress && (
          <Grid size={{ xs: 12, md: 6 }}>
            <AddressSummary
              title="Billing Address"
              address={formData.billingAddress}
            />
          </Grid>
        )}

        {/* Order Summary */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {cart?.items.map((item) => {
                const itemPrice = Number(item.variant.price);
                const itemTotal = itemPrice * item.quantity;
                let itemDiscount = 0;

                // Calculate item discount
                if (
                  item.variant.discountType === "PERCENTAGE" &&
                  item.variant.discountValue
                ) {
                  itemDiscount =
                    (itemTotal * Number(item.variant.discountValue)) / 100;
                } else if (
                  item.variant.discountType === "FIXED" &&
                  item.variant.discountValue
                ) {
                  itemDiscount =
                    Number(item.variant.discountValue) * item.quantity;
                }

                const itemFinalPrice = itemTotal - itemDiscount;

                return (
                  <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                    <ListItemText
                      primary={item.variant.product.name}
                      secondary={
                        <>
                          {`${item.variant.value}${item.variant.unit} × ${item.quantity}`}
                          {item.variant.discountType !== "NONE" && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="success.main"
                              sx={{ ml: 1 }}
                            >
                              (
                              {item.variant.discountType === "PERCENTAGE"
                                ? `${item.variant.discountValue}% off`
                                : `₹${item.variant.discountValue} off`}
                              )
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box sx={{ textAlign: "right" }}>
                      {itemDiscount > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ₹{itemTotal.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        ₹{itemFinalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="subtitle1">
                  ₹{orderSummary.subtotal.toFixed(2)}
                </Typography>
              </ListItem>
              {orderSummary.totalDiscount > 0 && (
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Total Discount" />
                  <Typography variant="subtitle1" color="success.main">
                    -₹{orderSummary.totalDiscount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{finalTotal.toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Payment Method" />
                <Typography variant="subtitle1">
                  {formData.paymentMethod === "RAZORPAY"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Grid>

        {/* Order Notes */}
        {formData.notes && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Notes
              </Typography>
              <Typography variant="body2">{formData.notes}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ReviewStep;
