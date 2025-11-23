import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAuthStore } from "../../stores/useAuthStore";

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileClose();
    await logout();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    handleProfileClose();
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "background.paper", borderBottom: "1px solid #444" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img src="/favicon.png" alt="Logo" style={{ height: "32px", marginRight: "10px" }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              BeaucheFoods
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" component={Link} to="/product-search" startIcon={<SearchIcon />}>
            Buscar Productos
          </Button>

          {user && (user.role === "seller" || user.role === "admin") && (
            <Button color="inherit" component={Link} to="/my-stores" startIcon={<StorefrontIcon />}>
              Mis Tiendas
            </Button>
          )}

          {user && user.role === "reviewer" && (
            <Button
              color="inherit"
              component={Link}
              to="/become-seller"
              startIcon={<BusinessIcon />}
            >
              Sé Vendedor
            </Button>
          )}

          {user ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleProfileOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "none",
                }}
              >
                <AccountCircleIcon sx={{ mr: 0.5 }} />
                <Typography variant="body2">{user.username}</Typography>
              </IconButton>

              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
              >
                {user.role === "admin" && (
                  <>
                    <MenuItem
                      onClick={() => handleNavigation("/users")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body2">Usuarios</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigation("/admin/requests")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <AssignmentIcon fontSize="small" />
                      <Typography variant="body2">Solicitudes</Typography>
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AdminPanelSettingsIcon fontSize="small" />
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
