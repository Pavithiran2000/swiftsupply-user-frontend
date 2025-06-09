import React from 'react';
import { Box, Skeleton, useTheme, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface OrderStatusChartProps {
  loading?: boolean;
}

const mockOrderStatusData = [
  { name: 'Pending', value: 12, color: '#FF9800' },
  { name: 'Processing', value: 8, color: '#2196F3' },
  { name: 'Shipped', value: 15, color: '#4CAF50' },
  { name: 'Delivered', value: 45, color: '#8BC34A' },
  { name: 'Cancelled', value: 3, color: '#F44336' },
];

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="circular" width={200} height={200} />
      </Box>
    );
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      style={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockOrderStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mockOrderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[8],
              }}
              formatter={(value: number) => [value, 'Orders']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Summary */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {mockOrderStatusData.reduce((sum, item) => sum + item.value, 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Orders
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default OrderStatusChart;
