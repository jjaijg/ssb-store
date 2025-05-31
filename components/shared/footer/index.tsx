import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Mail,
  LocationOn,
} from "@mui/icons-material";
import NextLink from "next/link";

const menuItems = {
  shop: [
    { title: "All Products", href: "/products" },
    { title: "Featured", href: "/products/featured" },
    { title: "New Arrivals", href: "/products/new" },
    { title: "Special Offers", href: "/products/offers" },
  ],
  categories: [
    { title: "Electronics", href: "/category/electronics" },
    { title: "Fashion", href: "/category/fashion" },
    { title: "Home & Living", href: "/category/home-living" },
    { title: "Beauty", href: "/category/beauty" },
  ],
  support: [
    { title: "Contact Us", href: "/contact" },
    { title: "FAQs", href: "/faqs" },
    { title: "Shipping Info", href: "/shipping" },
    { title: "Returns", href: "/returns" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Blog", href: "/blog" },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        pt: 8,
        pb: 3,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Shop Section */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Shop
            </Typography>
            <Stack spacing={1}>
              {menuItems.shop.map((item) => (
                <Link
                  key={item.title}
                  component={NextLink}
                  href={item.href}
                  color="text.secondary"
                  underline="hover"
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories Section */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Stack spacing={1}>
              {menuItems.categories.map((item) => (
                <Link
                  key={item.title}
                  component={NextLink}
                  href={item.href}
                  color="text.secondary"
                  underline="hover"
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support Section */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Stack spacing={1}>
              {menuItems.support.map((item) => (
                <Link
                  key={item.title}
                  component={NextLink}
                  href={item.href}
                  color="text.secondary"
                  underline="hover"
                >
                  {item.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2">+1 234 567 890</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Mail fontSize="small" color="primary" />
                <Typography variant="body2">support@ssbstore.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn fontSize="small" color="primary" />
                <Typography variant="body2">
                  123 Store Street, City, Country
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Social Links */}
        <Box sx={{ mt: 6, mb: 3 }}>
          <Divider />
          <Box
            sx={{ pt: 3, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <IconButton color="primary" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="primary" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="primary" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton color="primary" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          © {new Date().getFullYear()} SSB Store. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
