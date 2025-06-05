"use client";

import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Category } from "@prisma/client";

type FeaturedCategory = Pick<Category, "id" | "name" | "slug" | "image"> & {
  _count: {
    products: number;
  };
};

type Props = {
  categories: FeaturedCategory[];
};

export default function FeaturedCategories({ categories }: Props) {
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

  if (categories.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        backgroundColor: "background.paper",
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
          Shop by Category
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
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              py: 2,
            }}
            onScroll={handleScroll}
          >
            {categories.map((category) => (
              <Box
                key={category.id}
                component={Link}
                href={`/category/${category.slug}`}
                sx={{
                  flexShrink: 0,
                  width: { xs: 280, sm: 300 },
                  position: "relative",
                  height: 200,
                  borderRadius: 2,
                  overflow: "hidden",
                  textDecoration: "none",
                  "&:hover": {
                    "& .category-image": {
                      transform: "scale(1.05)",
                    },
                    "& .category-content": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  },
                }}
              >
                <Image
                  src={category.image || "/images/placeholder_300_300.webp"}
                  alt={category.name}
                  fill
                  className="category-image"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
                <Box
                  className="category-content"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    transition: "background-color 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", textAlign: "center" }}
                  >
                    {category._count.products} Products
                  </Typography>
                </Box>
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
