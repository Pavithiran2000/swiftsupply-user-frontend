import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Chip, 
  Skeleton,
  Pagination,
  useTheme
} from '@mui/material';
import { 
  ShoppingCart as OrderIcon,
  Message as MessageIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendIcon,
  Warning as AlertIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'order' | 'message' | 'view' | 'alert' | 'success';
  title: string;
  description: string;
  timestamp: string;
  status?: 'new' | 'read' | 'pending' | 'completed';
}

interface RecentActivityProps {
  loading?: boolean;
}

const mockActivityData: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    description: 'Order #ORD-2024-001 from TechCorp Solutions',
    timestamp: '2 minutes ago',
    status: 'new'
  },
  {
    id: '2',
    type: 'message',
    title: 'Inquiry Message',
    description: 'Question about bulk pricing for Electronics category',
    timestamp: '15 minutes ago',
    status: 'new'
  },
  {
    id: '3',
    type: 'view',
    title: 'Product View Spike',
    description: 'Wireless Headphones received 50+ views in last hour',
    timestamp: '1 hour ago',
    status: 'read'
  },
  {
    id: '4',
    type: 'success',
    title: 'Order Completed',
    description: 'Order #ORD-2024-002 has been delivered successfully',
    timestamp: '2 hours ago',
    status: 'completed'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Low Stock Alert',
    description: 'Smartphone Accessories inventory below threshold',
    timestamp: '3 hours ago',
    status: 'pending'
  },
  {
    id: '6',
    type: 'message',
    title: 'Supplier Verification',
    description: 'Your business documents have been approved',
    timestamp: '4 hours ago',
    status: 'completed'
  },
  {
    id: '7',
    type: 'order',
    title: 'Quote Request',
    description: 'Custom quote requested for Home & Garden products',
    timestamp: '5 hours ago',
    status: 'pending'
  },
  {
    id: '8',
    type: 'view',
    title: 'Profile Visit',
    description: 'RetailMax Inc. viewed your supplier profile',
    timestamp: '6 hours ago',
    status: 'read'
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <OrderIcon />;
    case 'message':
      return <MessageIcon />;
    case 'view':
      return <ViewIcon />;
    case 'alert':
      return <AlertIcon />;
    case 'success':
      return <SuccessIcon />;
    default:
      return <TrendIcon />;
  }
};

const getActivityColor = (type: string, theme: any) => {
  switch (type) {
    case 'order':
      return theme.palette.primary.main;
    case 'message':
      return theme.palette.info.main;
    case 'view':
      return theme.palette.success.main;
    case 'alert':
      return theme.palette.warning.main;
    case 'success':
      return theme.palette.success.main;
    default:
      return theme.palette.grey[500];
  }
};

const getStatusChip = (status: string) => {
  switch (status) {
    case 'new':
      return <Chip label="New" size="small" color="error" variant="filled" />;
    case 'pending':
      return <Chip label="Pending" size="small" color="warning" variant="outlined" />;
    case 'completed':
      return <Chip label="Completed" size="small" color="success" variant="outlined" />;
    default:
      return null;
  }
};

const RecentActivity: React.FC<RecentActivityProps> = ({ loading = false }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const totalPages = Math.ceil(mockActivityData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = mockActivityData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        <AnimatePresence mode="wait">
          {currentItems.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ListItem
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                  },
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: activity.status === 'new' ? theme.palette.action.selected : 'transparent',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getActivityColor(activity.type, theme),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: activity.status === 'new' ? 600 : 500,
                          color: 'text.primary',
                        }}
                      >
                        {activity.title}
                      </Typography>
                      {activity.status && getStatusChip(activity.status)}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </motion.div>
  );
};

export default RecentActivity;
