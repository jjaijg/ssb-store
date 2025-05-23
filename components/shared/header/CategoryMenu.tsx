"use client";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

type Props = {};

const categories = ["All", "Pulses", "Grains", "Soaps"];

const CategoryMenu = (props: Props) => {
  // State to control the drawer open/close
  const [open, setOpen] = useState(false);

  // Function to toggle the drawer
  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ padding: "16px" }}>
            Select Category
          </Typography>
          {/* List of categories */}
          <List>
            {categories.map((category) => (
              <ListItem key={category} disablePadding>
                <ListItemButton>
                  <ListItemText primary={category} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default CategoryMenu;
