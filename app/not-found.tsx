import { Box, Container, Typography, Button } from "@mui/material";
import { SearchOff } from "@mui/icons-material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <SearchOff
          sx={{
            fontSize: 64,
            color: "text.secondary",
            mb: 4,
          }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>

        <Typography color="text.secondary" paragraph>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Back to Homepage
        </Button>
      </Box>
    </Container>
  );
}
