import React from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ProductEngagementChartProps {
  loading?: boolean;
}

const mockEngagementData = [
  { product: 'Electronics', views: 1250, inquiries: 89, orders: 34 },
  { product: 'Clothing', views: 980, inquiries: 65, orders: 28 },
  { product: 'Home & Garden', views: 750, inquiries: 42, orders: 18 },
  { product: 'Sports', views: 620, inquiries: 38, orders: 15 },
  { product: 'Beauty', views: 580, inquiries: 35, orders: 12 },
  { product: 'Automotive', views: 420, inquiries: 28, orders: 9 },
];

const ProductEngagementChart: React.FC<ProductEngagementChartProps> = ({ loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockEngagementData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="product" 
              stroke={theme.palette.text.secondary}
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[8],
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'views' ? 'Views' : name === 'inquiries' ? 'Inquiries' : 'Orders'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="views" 
              fill={theme.palette.info.main}
              name="Views"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="inquiries" 
              fill={theme.palette.warning.main}
              name="Inquiries"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="orders" 
              fill={theme.palette.success.main}
              name="Orders"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </motion.div>
  );
};

export default ProductEngagementChart;
