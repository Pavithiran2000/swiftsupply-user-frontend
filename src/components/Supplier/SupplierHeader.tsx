import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Chat as MessagesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/png/logo.png';

const SupplierHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileAction = (action: string) => {
    handleProfileMenuClose();
    switch (action) {
      case "logout":
        logout();
        break;
      case "profile":
        navigate("/profile");
        break;
      case "dashboard":
        navigate("/supplier/dashboard");
        break;
      case "home":
        navigate("/");
        break;
      default:
        break;
    }
  };

  const supplierNavItems = [
    { label: "Dashboard", icon: <DashboardIcon />, action: "dashboard" },
    { label: "Inventory", icon: <InventoryIcon />, action: "inventory" },
    { label: "Orders", icon: <OrdersIcon />, action: "orders" },
    { label: "Messages", icon: <MessagesIcon />, action: "messages" },
  ];

  const profileMenuItems = [
    { label: "Profile Settings", icon: <SettingsIcon fontSize="small" />, action: "profile" },
    { label: "Back to Home", icon: <ArrowBackIcon fontSize="small" />, action: "home" },
    { label: "Sign Out", icon: <LogoutIcon fontSize="small" />, action: "logout" },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Title */}
        <Box display="flex" alignItems="center" gap={2}>

          {!isMobile && (
            <Box sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'maroon' }}>
                Supplier Portal
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Manage your business
              </Typography>
            </Box>
          )}
        </Box>

        {/* User Profile */}
        <Box display="flex" alignItems="center" gap={1}>
          {!isMobile && user && (
            <Box textAlign="right" mr={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Supplier
              </Typography>
            </Box>
          )}
          
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{ 
              color: 'text.primary',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(128, 0, 0, 0.08)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'maroon',
                fontSize: '1rem',
              }}
            >
              {user?.first_name?.[0]?.toUpperCase() || "S"}
            </Avatar>
          </IconButton>

        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
              },
            },
          }}
        >
          {user && (
            <>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "600", color: "text.primary" }}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ color: "maroon", fontWeight: 600 }}>
                  Supplier Account
                </Typography>
              </Box>
              {profileMenuItems.map((item) => (
                <MenuItem
                  key={item.action}
                  onClick={() => handleProfileAction(item.action)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      color: item.action === "logout" ? "error.main" : "maroon",
                      backgroundColor: item.action === "logout" ? "rgba(211, 47, 47, 0.08)" : "rgba(128, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {item.icon}
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default SupplierHeader;
