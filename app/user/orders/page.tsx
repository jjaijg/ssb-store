import { auth } from "@/auth";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Link from "next/link";
import { format } from "date-fns";
import { getUserOrders } from "@/lib/actions/order.actions";

export default async function UserOrdersPage() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  let orders = await getUserOrders();
  orders = !orders ? [] : orders;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>

        {orders.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders yet
              </Typography>
              <Button component={Link} href="/" variant="contained">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid size={{ xs: 12 }} key={order.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          ORDER #{order.orderNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Placed on {format(order.createdAt, "PPp")}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "CONFIRMED" ? "success" : "default"
                        }
                        size="small"
                      />
                    </Box>

                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ px: 0 }}
                      >
                        <Typography>
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0 }}>
                        {order.items.map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: "flex",
                              gap: 2,
                              py: 1,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Typography>
                              {item.quantity} × {item.name}
                            </Typography>
                            <Typography color="text.secondary">
                              {item.variant.value}
                              {item.variant.unit}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="subtitle1">
                        Total: ₹{Number(order.total).toFixed(2)}
                      </Typography>
                      <Button
                        component={Link}
                        href={`/user/orders/${order.id}`}
                        variant="outlined"
                        size="small"
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
