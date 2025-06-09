import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Chat as ChatIcon,
  ShoppingCart as OrderIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { type DashboardStats } from '../../types/supplier';
import SupplierHeader from '../../components/Supplier/SupplierHeader';
import SalesChart from './components/SalesChart';
import ProductEngagementChart from './components/ProductEngagementChart';
import OrderStatusChart from './components/OrderStatusChart';
import BuyerEngagementFunnel from './components/BuyerEngagementFunnel';
import RecentActivity from './components/RecentActivity';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="rectangular" height={40} />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change >= 0;

  return (
    <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}20`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: `0 8px 25px ${color}25`,
            transform: 'translateY(-2px)',
          }
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: `${color}20`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              {isPositive ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: isPositive ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {isPositive ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>
          
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SupplierDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          totalInquiries: 156,
          unreadMessages: 23,
          pendingOrders: 12,
          productViews: 2847,
          lowStockAlerts: 5,
          todayOrderValue: 45600,
          percentageChanges: {
            inquiries: 12.5,
            messages: -3.2,
            orders: 8.1,
            views: 15.7,
            stock: -20.0,
            revenue: 22.8,
          },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: <InboxIcon />,
      change: stats?.percentageChanges.inquiries || 0,
      color: theme.palette.primary.main,
    },
    // {
    //   title: 'Unread Messages',
    //   value: stats?.unreadMessages || 0,
    //   icon: <ChatIcon />,
    //   change: stats?.percentageChanges.messages || 0,
    //   color: theme.palette.info.main,
    // },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <OrderIcon />,
      change: stats?.percentageChanges.orders || 0,
      color: theme.palette.warning.main,
    },
    {
      title: 'Product Views',
      value: stats?.productViews || 0,
      icon: <ViewIcon />,
      change: stats?.percentageChanges.views || 0,
      color: theme.palette.success.main,
    },
    // {
    //   title: 'Low Stock Alerts',
    //   value: stats?.lowStockAlerts || 0,
    //   icon: <WarningIcon />,
    //   change: stats?.percentageChanges.stock || 0,
    //   color: theme.palette.error.main,
    // },
    {
      title: "Today's Revenue",
      value: `$${(stats?.todayOrderValue || 0).toLocaleString()}`,
      icon: <MoneyIcon />,
      change: stats?.percentageChanges.revenue || 0,
      color: '#9C27B0',
    },
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: { xs: 2, md: 4 }, paddingTop:{md: "10px"}}}>
      {/* Supplier Header */}
      <SupplierHeader />
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
        {/* Header */}
        <motion.div variants={item}>
          <Box mb={4}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                pt: 2,
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Track your business performance and manage your supplier operations
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Cards - Using Stack for responsive grid */}
        <Stack spacing={3} mb={4}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3
            }}
          >
            {statCards.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                color={stat.color}
                loading={loading}
              />
            ))}
          </Box>
        </Stack>

        {/* Charts Section */}
        <Stack spacing={3} mb={4}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                lg: '2fr 1fr'
              },
              gap: 3
            }}
          >
            {/* Sales Trend Chart */}
            <motion.div variants={item}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Sales Trend
                </Typography>
                <SalesChart loading={loading} />
              </Paper>
            </motion.div>

            {/* Order Status Breakdown */}
            <motion.div variants={item}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Order Status
                </Typography>
                <OrderStatusChart loading={loading} />
              </Paper>
            </motion.div>
          </Box>
        </Stack>

        {/* Bottom Section */}
        {/* <Stack spacing={3}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                lg: '1fr 1fr'
              },
              gap: 3
            }}
          > */}
            {/* Product Engagement */}
            {/* <motion.div variants={item}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Product Views vs Inquiries
                </Typography>
                <ProductEngagementChart loading={loading} />
              </Paper>
            </motion.div> */}

            {/* Buyer Engagement Funnel */}
            {/* <motion.div variants={item}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Buyer Engagement Funnel
                </Typography>
                <BuyerEngagementFunnel loading={loading} />
              </Paper>
            </motion.div>
          </Box>
        </Stack> */}

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <RecentActivity loading={loading} />
          </Paper>
        </motion.div>        </motion.div>
      </Container>
    </Box>
  );
};

export default SupplierDashboard;
