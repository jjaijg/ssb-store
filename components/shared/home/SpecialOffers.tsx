"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import {
  LocalOffer,
  LocalShipping,
  Discount,
  Timer,
} from "@mui/icons-material";

type OfferCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
};

const offers: OfferCard[] = [
  {
    title: "Daily Deals",
    description: "Save up to 50% on selected items",
    icon: <LocalOffer sx={{ fontSize: 40 }} />,
    bgColor: "#FFE1E6",
  },
  {
    title: "Free Shipping",
    description: "On orders above ₹999",
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    bgColor: "#E8F4FF",
  },
  {
    title: "Special Discounts",
    description: "Extra 10% off for members",
    icon: <Discount sx={{ fontSize: 40 }} />,
    bgColor: "#E6FFE1",
  },
  {
    title: "Flash Sales",
    description: "Limited time offers every day",
    icon: <Timer sx={{ fontSize: 40 }} />,
    bgColor: "#FFE8F4",
  },
];

export default function SpecialOffers() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        backgroundColor: "grey.50",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          Special Offers
        </Typography>

        <Grid container spacing={3}>
          {offers.map((offer, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: offer.bgColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {offer.icon}
                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold" }}
                  >
                    {offer.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {offer.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
