"use client";

import { Box, Container, Grid, Skeleton } from "@mui/material";

type Props = {
  height?: number;
};

// Add loading skeleton for Suspense fallback
export function FeaturedSkeleton({ height = 350 }: Props) {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Skeleton
          variant="rectangular"
          width={200}
          height={40}
          sx={{ mx: "auto", mb: 4 }}
        />
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
            >
              <Skeleton variant="rectangular" height={height} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
