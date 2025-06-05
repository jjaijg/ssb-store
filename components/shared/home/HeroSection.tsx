"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { BannerProduct } from "@/types";

type Props = {
  products: BannerProduct[];
};

export default function HeroSection({ products }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  // Don't render if no banner products
  if (products.length === 0) return null;

  return (
    <Box
      sx={{ position: "relative", width: "100%", height: { xs: 400, md: 600 } }}
    >
      {products.map((product, index) => (
        <Paper
          key={product.id}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={product.bannerImage}
              alt={product.name}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(0,0,0,0.3)",
              }}
            />
            <Container maxWidth="lg" sx={{ height: "100%", ml: "2rem" }}>
              <Stack
                spacing={3}
                justifyContent="center"
                sx={{
                  height: "100%",
                  position: "relative",
                  zIndex: 1,
                  color: "white",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {product.brand.name}
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    // Add responsive font sizes
                    fontSize: {
                      xs: "2rem", // for extra-small screens
                      sm: "2.5rem", // for small screens
                      md: "3rem", // for medium screens
                      lg: "3.5rem", // for large screens
                      xl: "4rem", // for extra-large screens
                    },
                    // Add line height adjustments
                    lineHeight: {
                      xs: 1.2,
                      sm: 1.3,
                      md: 1.4,
                    },
                    // Limit maximum width and add ellipsis for very long names
                    maxWidth: {
                      xs: "280px",
                      sm: "400px",
                      md: "600px",
                      lg: "800px",
                    },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: {
                      xs: 2, // Show 2 lines on mobile
                      sm: 3, // Show 3 lines on larger screens
                    },
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.name}
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href={`/product/${product.slug}`}
                    variant="contained"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                    endIcon={<ArrowForward />}
                  >
                    Shop Now
                  </Button>
                </Box>
              </Stack>
            </Container>
          </Box>
        </Paper>
      ))}

      {/* Only show navigation if there are multiple products */}
      {products.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevSlide}
            sx={{
              position: "absolute",
              left: 5,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNextSlide}
            sx={{
              position: "absolute",
              right: 5,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.8)",
              zIndex: 10,
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowForward />
          </IconButton>
        </>
      )}
    </Box>
  );
}
