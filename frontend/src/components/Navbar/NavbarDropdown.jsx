import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { IoTicketOutline } from "react-icons/io5";
import { FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/auth";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    minWidth: 280,
    backgroundColor: "rgb(21, 27, 46)",
    // backdropFilter: "blur(10px)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
}));

const NavbarDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.authState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

  const handleLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleBookings = () => {
    handleClose();
    navigate("/bookings");
  }

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName} ${user?.lastName}`;
    }
    return "Guest";
  };

  const getAvatarContent = () => {
    if (user?.avatar) {
      return user.avatar;
    }
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
      >
        <Avatar
          sx={{ width: 40, height: 40 }}
          src={getAvatarContent()}
          alt={getFullName()}
        />
      </IconButton>

      <StyledMenu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user ? (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                mb: 2,
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{ width: 80, height: 80, mb: 1 }}
                alt={getFullName()}
              />
              <Typography variant="h6">{getFullName()}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={handleClose}>
              <FiUser style={{ marginRight: "10px" }} />
              Profile Settings
            </MenuItem>

            <MenuItem onClick={handleBookings}>
              <IoTicketOutline style={{ marginRight: "10px" }} />
              My Bookings
            </MenuItem>

            {(user.role === 'admin' || user.role === 'superadmin') && (
              <>
                <Divider />
                <MenuItem onClick={() => navigate("/admin")}>
                  <FiUser style={{ marginRight: "10px" }} />
                  Admin Dashboard
                </MenuItem>
              </>
            )}

            {/* <MenuItem>
              {isDarkMode ? (
                <BsMoon style={{ marginRight: "10px" }} />
              ) : (
                <BsSun style={{ marginRight: "10px" }} />
              )}
              <Switch
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
                size="small"
              />
            </MenuItem> */}

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <FiLogOut style={{ marginRight: "10px" }} />
              Logout
            </MenuItem>
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Avatar
              src=""
              sx={{ width: 80, height: 80, mb: 1, mx: "auto" }}
              alt="Profile"
            />
            <Typography variant="h6">Guest</Typography>
            <Typography
              variant="p"
              sx={{
                color: "grey",
                fontSize: 12,
                mb: 2,
              }}
            >
              You are not logged in
            </Typography>
            <br></br>
            <Button
              onClick={handleLogin}
              sx={{ color: "primary.main", mt: 1 }}
              variant="outlined"
            >
              <FiLogIn style={{ marginRight: "10px" }} />
              Login
            </Button>
          </Box>
        )}
      </StyledMenu>
    </Box>
  );
};

export default NavbarDropdown;