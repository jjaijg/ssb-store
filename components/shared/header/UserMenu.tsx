import React from "react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { signOut } from "next-auth/react";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: session } = useSession();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!session) {
    return (
      <Button
        LinkComponent={Link}
        href="/signin"
        color="inherit"
        variant="text"
        disableRipple
      >
        Signin
      </Button>
    );
  }

  return (
    <>
      <Tooltip title="User Menu">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            alt={session.user?.name || "User"}
            src={session.user?.image || ""}
            sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
          >
            {session.user.name?.[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <Typography variant="h6" sx={{ fontSize: "1.1rem" }} m={1} ml={2}>
          {session.user?.name}
        </Typography>
        <Divider />
        <MenuItem>
          <Link href="/user/profile">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <Link href="/user/orders">Order history</Link>
        </MenuItem>
        {session.user.role === "ADMIN" && (
          <MenuItem>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <Link href="/admin/dashboard">Admin</Link>
          </MenuItem>
        )}
        <Divider />
        <Button
          color="inherit"
          variant="text"
          type="submit"
          disableRipple
          startIcon={<LogoutIcon />}
          // sx={{ ml: 2 }}
          fullWidth
          onClick={() => signOut()}
        >
          SignOut
        </Button>
      </Menu>
    </>
  );
};

export default UserMenu;
