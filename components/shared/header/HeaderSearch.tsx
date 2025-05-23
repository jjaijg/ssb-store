"use client";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import React from "react";

type Props = {};

const categories = ["All", "Pulses", "Grains", "Soaps"];

const HeaderSearch = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        m: 1,
        mx: "auto",
        p: 1,
        px: 2,
        borderRadius: 1,
        display: { xs: "none", md: "flex" },
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <FormControl variant="standard" fullWidth sx={{ minWidth: 100, mr: 2 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select displayEmpty id="category" value={""} onChange={() => {}}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="search-text"
        label="Search"
        variant="standard"
        sx={{ minWidth: 200 }}
      />
      <IconButton size="large" edge="end" color="primary" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default HeaderSearch;
