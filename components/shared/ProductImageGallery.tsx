"use client";

import { Box, Stack, IconButton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({ images, alt }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <Box sx={{ position: "relative", height: 500 }}>
        <Image
          src="https://placehold.co/600x400/png"
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Main Image */}
      <Box
        sx={{
          position: "relative",
          height: 500,
          backgroundColor: "grey.100",
          borderRadius: 1,
        }}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          style={{ objectFit: "contain" }}
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
              onClick={handlePrevious}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
              onClick={handleNext}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: "auto",
            py: 1,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.300",
              borderRadius: 3,
            },
          }}
        >
          {images.map((image, index) => (
            <Box
              key={image}
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                flexShrink: 0,
                cursor: "pointer",
                borderRadius: 1,
                outline: index === currentIndex ? 2 : 0,
                outlineColor: "primary.main",
                "&:hover": {
                  outline: 2,
                  outlineColor: "primary.light",
                },
              }}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
