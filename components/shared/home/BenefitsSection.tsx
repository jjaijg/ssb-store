"use client";

import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import {
  LocalShipping,
  Security,
  SupportAgent,
  Payment,
} from "@mui/icons-material";

type Benefit = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: <LocalShipping sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Fast Delivery",
    description: "Free delivery for orders above ₹999",
  },
  {
    icon: <Security sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Secure Shopping",
    description: "100% secure payment",
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "24/7 Support",
    description: "Dedicated customer support",
  },
  {
    icon: <Payment sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

export default function BenefitsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        backgroundColor: "background.default",
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    "& > svg": {
                      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
                    },
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
