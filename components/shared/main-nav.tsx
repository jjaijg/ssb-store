"use client";
import { Box, Button, Link } from "@mui/material";
import { usePathname } from "next/navigation";

type Props = {
  links: {
    label: string;
    href: string;
  }[];
};

const MainNav = ({ links }: Props) => {
  const pathname = usePathname();
  return (
    <Box sx={{ display: "flex" }}>
      {links.map((link) => (
        <Button
          variant="text"
          key={link.label}
          component={Link}
          href={link.href}
          sx={{
            my: 2,
            display: "block",
            fontWeight: pathname.includes(link.href) ? "bold" : "normal",
          }}
        >
          {link.label}
        </Button>
      ))}
    </Box>
  );
};

export default MainNav;
