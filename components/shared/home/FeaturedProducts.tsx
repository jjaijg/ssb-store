"use client";

import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import ProductCard from "../ProductCard";
import { SerializedProductWithVariants, SerializedCart } from "@/types";
import { useEffect, useRef, useState } from "react";

type Props = {
  products: SerializedProductWithVariants[];
  cart: SerializedCart | null;
};

export default function FeaturedProducts({ products, cart }: Props) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (scrollContainer.current) {
      const { scrollWidth, clientWidth } = scrollContainer.current;
      if (scrollWidth > clientWidth) setShowRightArrow(true);
    }
  }, [scrollContainer]);

  const handleScroll = () => {
    if (!scrollContainer.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;

    const scrollAmount = 300; // Adjust this value to control scroll distance
    scrollContainer.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
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
          Featured Products
        </Typography>

        <Box sx={{ position: "relative" }}>
          {/* Left Arrow */}
          {showLeftArrow && (
            <IconButton
              onClick={() => scroll("left")}
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}

          {/* Scrollable Container */}
          <Stack
            ref={scrollContainer}
            direction="row"
            spacing={2}
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome
              msOverflowStyle: "none", // IE/Edge
              py: 2, // Add padding to show card shadows
            }}
            onScroll={handleScroll}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  flexShrink: 0,
                  //   width: { xs: 280, sm: 300 }, // Match your ProductCard width
                }}
              >
                <ProductCard product={product} cart={cart} />
              </Box>
            ))}
          </Stack>

          {/* Right Arrow */}
          {showRightArrow && (
            <IconButton
              onClick={() => scroll("right")}
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </Box>
      </Container>
    </Box>
  );
}
