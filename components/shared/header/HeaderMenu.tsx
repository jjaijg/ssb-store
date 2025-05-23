"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CartIcon from "@mui/icons-material/ShoppingCart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import UserMenu from "./UserMenu";

const HeaderMenu = () => {
  // State to control the drawer open/close
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();

  // Function to toggle the drawer
  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  return (
    <>
      {/* nav menu for smaller screens */}
      <Box
        component={"nav"}
        sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MoreVertIcon />
        </IconButton>
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 250,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6" sx={{ padding: "16px" }}>
              Menu
            </Typography>
            {/* List of categories */}
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <CartIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Cart"} />
                </ListItemButton>
              </ListItem>
              {!session?.user && (
                <ListItem disablePadding component={Link} href="/signin">
                  <ListItemButton>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Signin"} />
                  </ListItemButton>
                </ListItem>
              )}
              {session?.user && (
                <>
                  <ListItem
                    disablePadding
                    component={Link}
                    href="/user/profile"
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Profile"} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding component={Link} href="/user/orders">
                    <ListItemButton>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Order history"} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => signOut()}>
                    <ListItemButton>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Logout"} />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Box>
      {/* Nav menu for medium to large screens */}
      <Stack
        component={"nav"}
        direction={"row"}
        alignItems={"center"}
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          ml: "auto",
          gap: 2,
        }}
      >
        <Button color="inherit" startIcon={<CartIcon />}>
          Cart
        </Button>
        <UserMenu />
      </Stack>
    </>
  );
};

export default HeaderMenu;
