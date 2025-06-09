import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SupplierSidebar from '../../components/Supplier/SupplierSidebar';

const SupplierLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((open) => !open);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f8f8' }}>
      <SupplierSidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flex: 1, transition: 'margin 0.3s', "& .MuiContainer-root": { padding: 0 } }}>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ position: 'fixed', top: 24, left: {xs: 30, md:54}, zIndex: 1300, bgcolor: 'white', boxShadow: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default SupplierLayout;
