import React from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SalesChartProps {
  loading?: boolean;
}

const mockSalesData = [
  { month: 'Jan', sales: 12000, orders: 45 },
  { month: 'Feb', sales: 15000, orders: 58 },
  { month: 'Mar', sales: 18000, orders: 72 },
  { month: 'Apr', sales: 22000, orders: 89 },
  { month: 'May', sales: 25000, orders: 95 },
  { month: 'Jun', sales: 28000, orders: 108 },
  { month: 'Jul', sales: 32000, orders: 125 },
  { month: 'Aug', sales: 29000, orders: 118 },
  { month: 'Sep', sales: 35000, orders: 142 },
  { month: 'Oct', sales: 38000, orders: 156 },
  { month: 'Nov', sales: 42000, orders: 168 },
  { month: 'Dec', sales: 45000, orders: 185 },
];

const SalesChart: React.FC<SalesChartProps> = ({ loading = false }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="month" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[8],
              }}
              formatter={(value: number, name: string) => [
                name === 'sales' ? `$${value.toLocaleString()}` : value,
                name === 'sales' ? 'Revenue' : 'Orders'
              ]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: theme.palette.secondary.main, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </motion.div>
  );
};

export default SalesChart;
