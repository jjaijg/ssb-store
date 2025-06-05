"use client";

import { Box, Container, Typography, Stack, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Brand } from "@prisma/client";

type FeaturedBrand = Pick<Brand, "id" | "name" | "slug" | "logoUrl">;

type Props = {
  brands: FeaturedBrand[];
};

export default function BrandShowcase({ brands }: Props) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (scrollContainer.current) {
      const { scrollWidth, clientWidth } = scrollContainer.current;
      if (scrollWidth > clientWidth) setShowRightArrow(true);
    }
  }, []);

  const handleScroll = () => {
    if (!scrollContainer.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;
    const scrollAmount = 300;
    scrollContainer.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (brands.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: "background.default",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Our Brands
        </Typography>

        <Box sx={{ position: "relative" }}>
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

          <Stack
            ref={scrollContainer}
            direction="row"
            spacing={4}
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              py: 2,
            }}
            onScroll={handleScroll}
          >
            {brands.map((brand) => (
              <Box
                key={brand.id}
                component={Link}
                href={`/brand/${brand.slug}`}
                sx={{
                  flexShrink: 0,
                  width: { xs: 150, sm: 180 },
                  height: { xs: 100, sm: 120 },
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 1,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Image
                  src={brand.logoUrl || "/images/placeholder_200_200.webp"}
                  alt={brand.name}
                  fill
                  style={{
                    objectFit: "contain",
                    padding: "12px",
                  }}
                />
              </Box>
            ))}
          </Stack>

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
