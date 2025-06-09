import { useState, type MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Star as StarIcon,
  HelpOutline as HelpOutlineIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Storefront as StorefrontIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  LocalOffer as PromotionsIcon,
  AccountBalanceWallet as WalletIcon,
  History as OrdersIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Chat as CommunicationIcon,
  Business as SupplierIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/png/logo.png";

const allCategories = [
  "Apparel & Accessories",
  "Electronics",
  "Home & Garden",
  "Machinery",
  "Automotive",
  "Health & Medicine",
  "Food & Beverage",
  "Packaging & Printing",
  "Chemicals",
];

const featuredSelections = [
  { title: "Top Ranking" },
  { title: "New Arrivals" },
  { title: "Top Deals" },
];

const helpCenterTopics = [
  "Open a dispute",
  "Report IPR infringement",
  "Report abuse",
];

const navLinks = [
  "All Categories",
  // "Products",
  // "Suppliers",
  "Featured Selections",
  "Communication",
  "Become Supplier",
  "Help Center",
];

const iconMap = {
  "All Categories": <CategoryIcon fontSize="small" />,
  "Featured Selections": <StarIcon fontSize="small" />,
  "Help Center": <HelpOutlineIcon fontSize="small" />,
};

// Base menu items for all users
const baseProfileMenuItems = [
  { label: "Profile Settings", icon: <SettingsIcon fontSize="small" />, action: "profile" },
  { label: "Wallet", icon: <WalletIcon fontSize="small" />, action: "wallet" },
  { label: "Past Orders", icon: <OrdersIcon fontSize="small" />, action: "orders" },
];

// Supplier-specific menu items
const supplierMenuItems = [
  { label: "Supplier Dashboard", icon: <BusinessIcon fontSize="small" />, action: "supplier-dashboard" },
];

// Buyer-specific menu items
const buyerMenuItems = [
  { label: "Promotions", icon: <PromotionsIcon fontSize="small" />, action: "promotions" },
];

const logoutMenuItem = { label: "Sign Out", icon: <LogoutIcon fontSize="small" />, action: "logout" };

const mobileNavItems = [
  { label: "Home", icon: <HomeIcon />, path: "/home" },
  { label: "Products", icon: <CategoryIcon />, path: "/products" },
  { label: "Suppliers", icon: <SupplierIcon />, path: "/suppliers" },
  { label: "Cart", icon: <ShoppingCartIcon />, path: "/cart", badge: 3 },
  { label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

const Header = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileNavValue, setMobileNavValue] = useState(0);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, menuName: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menuName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

    const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };  const handleProfileAction = (action: string) => {
    handleProfileMenuClose();
    switch (action) {
      case "logout":
        logout();
        break;
      case "profile":
        navigate("/profile");
        break;
      case "promotions":
        navigate("/promotions");
        break;
      case "wallet":
        navigate("/wallet");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "supplier-dashboard":
        navigate("/supplier/dashboard");
        break;
      default:
        break;
    }
  };

  // Generate profile menu items based on user role
  const getProfileMenuItems = () => {
    const items = [...baseProfileMenuItems];
    
    if (user?.role === "seller") {
      items.splice(1, 0, ...supplierMenuItems); // Insert supplier items after profile settings
    } else if (user?.role === "buyer") {
      items.splice(1, 0, ...buyerMenuItems); // Insert buyer items after profile settings
    }
    
    items.push(logoutMenuItem); // Always add logout at the end
    return items;
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
  };

  const getMenuItems = (menuName: string) => {
    switch (menuName) {
      case "All Categories":
        return allCategories;
      case "Featured Selections":
        return featuredSelections.map(item => item.title);
      case "Help Center":
        return helpCenterTopics;
      default:
        return [];
    }
  };  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={2} 
        sx={{ 
          zIndex: 1300,
          backgroundColor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar
          sx={{
            // maxWidth: "1200px",
            // margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // px: { xs: 1, sm: 2 },
            py: 1,
            minHeight: "64px !important",
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}          {/* Logo - Top Left */}
          <Box 
            component="img" 
            src={logoImage}
            alt="SwiftSupply" 
            onClick={() => navigate("/")}
            sx={{ 
              height: { xs: 32, sm: 40 },
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }} 
          />

          {/* Desktop Navigation - Center */}
          {!isMobile && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1, 
              flexGrow: 1, 
              justifyContent: "center",
              // mx: 4,
            }}>
              {navLinks.map((link) => {
                const isDropdown = ["All Categories", "Featured Selections", "Help Center"].includes(link);

                if (isDropdown) {
                  return (
                    <Box key={link} sx={{ position: "relative" }}>
                      <Button
                        aria-haspopup="true"
                        aria-expanded={openMenu === link ? "true" : undefined}
                        onClick={(e) => handleMenuOpen(e, link)}
                        endIcon={iconMap[link as keyof typeof iconMap]}
                        startIcon={<ExpandMoreIcon 
                          sx={{ 
                            transform: openMenu === link ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease-in-out",
                            fontSize: "1rem",
                          }} 
                        />}
                        sx={{
                          color: openMenu === link ? "maroon" : "text.primary",
                          fontWeight: "600",
                          textTransform: "none",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          minWidth: "auto",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            bgcolor: "maroon",
                            color: "white",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(128, 0, 0, 0.2)",
                            "& .MuiSvgIcon-root": {
                              color: "white",
                            },
                          },
                        }}
                      >
                        {link}
                      </Button>

                      <Menu
                        anchorEl={anchorEl}
                        open={openMenu === link}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              mt: 1,
                              minWidth: 280,
                              maxHeight: 400,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                              "& .MuiMenuItem-root": {
                                borderRadius: 1,
                                mx: 1,
                                my: 0.5,
                              },
                            },
                          },
                        }}
                      >
                        {getMenuItems(link).map((item) => (
                          <MenuItem
                            key={item}
                            onClick={handleMenuClose}
                            sx={{
                              fontWeight: link === "Featured Selections" ? "600" : "normal",
                              py: 1.5,
                              px: 2,
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                color: "maroon",
                                backgroundColor: "rgba(128, 0, 0, 0.08)",
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {item}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  );
                }                // Normal links
                return (
                  <Button
                    key={link}
                    onClick={() => {
                      if (link === "Products") {
                        navigate("/products");
                      } else if (link === "Suppliers") {
                        navigate("/suppliers");
                      }
                    }}
                    startIcon={
                      link === "Communication" ? <CommunicationIcon fontSize="small" /> :
                      link === "Become Supplier" ? <SupplierIcon fontSize="small" /> :
                      link === "Products" ? <CategoryIcon fontSize="small" /> :
                      link === "Suppliers" ? <BusinessIcon fontSize="small" /> : null
                    }
                    sx={{
                      color: "text.primary",
                      fontWeight: "600",
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      minWidth: "auto",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "maroon",
                        color: "white",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(128, 0, 0, 0.2)",
                      },
                    }}
                  >
                    {link}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right Icons - Top Right */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.5, sm: 1 },
          }}>            {/* Shopping Cart */}
            <IconButton
              aria-label="Shopping Cart"
              size="large"
              onClick={() => navigate("/cart")}
              sx={{ 
                color: "text.primary", 
                transition: "all 0.2s ease-in-out",
                "&:hover": { 
                  color: "maroon",
                  backgroundColor: "rgba(128, 0, 0, 0.08)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error" 
                sx={{ 
                  "& .MuiBadge-badge": { 
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.1)",
                      },
                      "100%": {
                        transform: "scale(1)",
                      },
                    },
                  } 
                }}
              >
                <ShoppingCartIcon fontSize="large" />
              </Badge>
            </IconButton>

            {/* Profile/Sign In */}
            {user ? (
              <IconButton
                aria-label="User Profile"
                size="large"
                onClick={handleProfileMenuOpen}
                sx={{ 
                  color: "text.primary", 
                  transition: "all 0.2s ease-in-out",
                  "&:hover": { 
                    color: "maroon",
                    backgroundColor: "rgba(128, 0, 0, 0.08)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "maroon",
                    fontSize: "1rem",
                  }}
                >
                  {user.first_name?.[0]?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                href="/login"
                sx={{
                  color: "white",
                  bgcolor: "maroon",
                  fontWeight: "600",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "#63051c",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(128, 0, 0, 0.2)",
                  },
                }}
              >
                Sign In
              </Button>
            )}

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
                    </Typography>                  </Box>
                  {getProfileMenuItems().map((item) => (
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Navigation */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "white",
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 1 }}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Box component="img" src={logoImage} alt="SwiftSupply" sx={{ height: 40 }} />
          </Box>
          <Divider />
          <List>            {navLinks.map((link) => (
              <ListItem
                key={link}
                onClick={() => {
                  if (link === "Products") {
                    navigate("/products");
                    setMobileDrawerOpen(false);
                  } else if (link === "Suppliers") {
                    navigate("/suppliers");
                    setMobileDrawerOpen(false);
                  }
                }}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(128, 0, 0, 0.08)",
                  },
                }}
              >
                <ListItemIcon>
                  {link === "All Categories" && <CategoryIcon />}
                  {link === "Products" && <CategoryIcon />}
                  {link === "Suppliers" && <BusinessIcon />}
                  {link === "Featured Selections" && <StarIcon />}
                  {link === "Communication" && <CommunicationIcon />}
                  {link === "Become Supplier" && <SupplierIcon />}
                  {link === "Help Center" && <HelpOutlineIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={link} 
                  primaryTypographyProps={{ 
                    fontWeight: "600",
                    fontSize: "0.9rem" 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Mobile Bottom Navigation */}
      {isMobile && (        <BottomNavigation
          value={mobileNavValue}
          onChange={(_, newValue) => setMobileNavValue(newValue)}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderTop: "1px solid",
            borderColor: "divider",
            backgroundColor: "white",
            "& .MuiBottomNavigationAction-root": {
              minWidth: 0,
              color: "text.secondary",
              "&.Mui-selected": {
                color: "maroon",
              },
            },
          }}
        >          {mobileNavItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              onClick={() => handleMobileNavigation(item.path)}
              icon={
                item.badge ? (
                  <Badge badgeContent={item.badge} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem" } }}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )
              }
              sx={{
                fontSize: "0.75rem",
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.7rem",
                  fontWeight: "600",
                },
              }}
            />
          ))}
        </BottomNavigation>
      )}
    </>
  );
};

export default Header;
