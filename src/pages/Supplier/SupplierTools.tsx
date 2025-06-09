import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const SupplierTools: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={2}>
          Additional Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          (Demo) Access extra tools and future enhancements for your supplier account here.
        </Typography>
      </Paper>
    </motion.div>
  );
};
export default SupplierTools;
