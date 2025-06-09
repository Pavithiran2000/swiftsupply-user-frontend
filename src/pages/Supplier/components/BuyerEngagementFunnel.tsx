import React from 'react';
import { Box, Skeleton, useTheme, Typography } from '@mui/material';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { motion } from 'framer-motion';

interface BuyerEngagementFunnelProps {
  loading?: boolean;
}

const mockFunnelData = [
  { name: 'Product Views', value: 10000, fill: '#8884d8' },
  { name: 'Product Detail Views', value: 3500, fill: '#82ca9d' },
  { name: 'Inquiries Sent', value: 1200, fill: '#ffc658' },
  { name: 'Quote Requests', value: 450, fill: '#ff7c7c' },
  { name: 'Orders Placed', value: 180, fill: '#8dd1e1' },
];

const BuyerEngagementFunnel: React.FC<BuyerEngagementFunnelProps> = ({ loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>
    );
  }

  // Calculate conversion rates
  const calculateConversionRate = (current: number, previous: number) => {
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveContainer width="100%" height="80%">
          <FunnelChart>
            <Funnel
              dataKey="value"
              data={mockFunnelData}
              isAnimationActive
              animationDuration={1000}
            >
              <LabelList position="center" fill="#fff" stroke="none" fontSize={12} fontWeight="bold" />
              {mockFunnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[8],
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name
              ]}
            />
          </FunnelChart>
        </ResponsiveContainer>

        {/* Conversion Rates */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Conversion Rates
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {mockFunnelData.slice(1).map((item, index) => (
              <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {mockFunnelData[index].name} → {item.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'success.main',
                    fontSize: '0.75rem'
                  }}
                >
                  {calculateConversionRate(item.value, mockFunnelData[index].value)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default BuyerEngagementFunnel;
