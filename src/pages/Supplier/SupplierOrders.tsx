import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Stack,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  ShoppingCart as OrderIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import SupplierHeader from '../../components/Supplier/SupplierHeader';

interface Order {
  id: string;
  orderNumber: string;
  buyer: {
    name: string;
    company: string;
    avatar?: string;
  };
  items: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  priority: 'low' | 'medium' | 'high';
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    buyer: {
      name: 'John Smith',
      company: 'ABC Construction Ltd.',
      avatar: undefined,
    },
    items: 5,
    totalAmount: 2450.99,
    status: 'pending',
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-22',
    priority: 'high',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    buyer: {
      name: 'Sarah Johnson',
      company: 'TechFlow Industries',
      avatar: undefined,
    },
    items: 12,
    totalAmount: 8750.50,
    status: 'confirmed',
    orderDate: '2024-01-14',
    expectedDelivery: '2024-01-21',
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    buyer: {
      name: 'Mike Wilson',
      company: 'BuildRight Corp',
      avatar: undefined,
    },
    items: 3,
    totalAmount: 1299.99,
    status: 'processing',
    orderDate: '2024-01-13',
    expectedDelivery: '2024-01-20',
    priority: 'low',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    buyer: {
      name: 'Emily Brown',
      company: 'Manufacturing Plus',
      avatar: undefined,
    },
    items: 8,
    totalAmount: 5680.75,
    status: 'shipped',
    orderDate: '2024-01-12',
    expectedDelivery: '2024-01-19',
    priority: 'medium',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    buyer: {
      name: 'David Lee',
      company: 'Industrial Solutions',
      avatar: undefined,
    },
    items: 15,
    totalAmount: 12450.00,
    status: 'delivered',
    orderDate: '2024-01-10',
    expectedDelivery: '2024-01-17',
    priority: 'high',
  },
];

const SupplierOrders: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 10;
      case 'confirmed':
        return 25;
      case 'processing':
        return 50;
      case 'shipped':
        return 75;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: { xs: 1, md: 4 }, paddingTop:{md: "10px"} }}>
      <SupplierHeader />
      
      <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <OrderIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  pt: 2,
                }}
              >
                Order Management
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Track and manage all your orders from buyers and business partners
            </Typography>
          </Box>

          {/* Search and Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
              <TextField
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: isMobile ? '100%' : 300 }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Export
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Orders Table */}
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Order Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Buyer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </Typography>
                          {order.expectedDelivery && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{ width: 32, height: 32 }}
                            src={order.buyer.avatar}
                          >
                            {order.buyer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {order.buyer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.buyer.company}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.items} items
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${order.totalAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.priority.toUpperCase()}
                          color={getPriorityColor(order.priority)}
                          size="small"
                          variant="filled"
                          sx={{ minWidth: 60, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getStatusProgress(order.status)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getStatusProgress(order.status)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="secondary">
                            <ShippingIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SupplierOrders;
