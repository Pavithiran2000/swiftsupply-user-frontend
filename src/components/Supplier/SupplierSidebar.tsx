import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme, useMediaQuery, IconButton, Divider, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  BarChart as AnalyticsIcon,
  Business as BusinessIcon,
  Chat as MessageIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Build as ToolsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import logoImage from '../../assets/png/logo.png';
import { useAuth } from '../../context/AuthContext';

const sidebarItems = [
  { label: 'Overview', icon: <DashboardIcon />, path: '/supplier/dashboard' },
  { label: 'Order Management', icon: <OrdersIcon />, path: '/supplier/orders' },
  { label: 'Product & Catalog', icon: <ProductsIcon />, path: '/supplier/inventory' },
  { label: 'Analytics & Engagement', icon: <AnalyticsIcon />, path: '/supplier/analytics' },
  { label: 'Business Profile', icon: <BusinessIcon />, path: '/supplier/business-profile' },
  { label: 'Inquiry & Message Center', icon: <MessageIcon />, path: '/supplier/messages' },
  { label: 'Visibility & Pricing', icon: <VisibilityIcon />, path: '/supplier/visibility' },
  { label: 'Additional Tools', icon: <ToolsIcon />, path: '/supplier/tools' },
];

const SupplierSidebar: React.FC<{ mobileOpen: boolean; onDrawerToggle: () => void; }> = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const drawerWidth = 300;

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:"center",p: 3, pb: 2 }}>
        <Box component="img" src={logoImage} alt="SwiftSupply" sx={{ height: 36, cursor: 'pointer' }} onClick={() => navigate('/')} />
      </Box>
      <Divider />
      <Box flex={1}>
        <List>
          {sidebarItems.map((item, idx) => (
            <motion.div key={item.label} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(123,10,36,0.08)',
                    color: 'maroon',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </Box>
      <Box p={2}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton onClick={logout} sx={{ borderRadius: 2 }}>
          <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #eee',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default SupplierSidebar;
