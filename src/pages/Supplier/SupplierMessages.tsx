import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Stack,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
  Badge,
  Divider,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  CheckOutlined  as MarkIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import SupplierHeader from '../../components/Supplier/SupplierHeader';

interface Message {
  id: string;
  sender: {
    name: string;
    company: string;
    avatar?: string;
    isSupplier: boolean;
  };
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'inquiry' | 'order' | 'support' | 'partnership';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'John Smith',
      company: 'ABC Construction Ltd.',
      avatar: undefined,
      isSupplier: false,
    },
    subject: 'Bulk Order Inquiry - Steel Pipes',
    preview: 'Hi, I\'m interested in placing a bulk order for industrial steel pipes...',
    content: 'Hi, I\'m interested in placing a bulk order for industrial steel pipes. Could you please provide pricing for quantities of 500+ units? We need them for our upcoming construction project.',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    isStarred: true,
    priority: 'high',
    category: 'inquiry',
  },
  {
    id: '2',
    sender: {
      name: 'Sarah Johnson',
      company: 'TechFlow Industries',
      avatar: undefined,
      isSupplier: false,
    },
    subject: 'Order Confirmation Request',
    preview: 'Could you please confirm the delivery date for order #ORD-2024-002...',
    content: 'Could you please confirm the delivery date for order #ORD-2024-002? We need to coordinate with our project timeline.',
    timestamp: '2024-01-15T09:15:00Z',
    isRead: false,
    isStarred: false,
    priority: 'medium',
    category: 'order',
  },
  {
    id: '3',
    sender: {
      name: 'Mike Wilson',
      company: 'BuildRight Corp',
      avatar: undefined,
      isSupplier: false,
    },
    subject: 'Partnership Opportunity',
    preview: 'We\'re looking for long-term suppliers for our construction projects...',
    content: 'We\'re looking for long-term suppliers for our construction projects. Would you be interested in establishing a partnership agreement?',
    timestamp: '2024-01-14T16:45:00Z',
    isRead: true,
    isStarred: false,
    priority: 'medium',
    category: 'partnership',
  },
  {
    id: '4',
    sender: {
      name: 'Emily Brown',
      company: 'Manufacturing Plus',
      avatar: undefined,
      isSupplier: false,
    },
    subject: 'Product Quality Inquiry',
    preview: 'Can you provide more details about the specifications and certifications...',
    content: 'Can you provide more details about the specifications and certifications for your hydraulic pumps? We need products that meet ISO standards.',
    timestamp: '2024-01-14T14:20:00Z',
    isRead: true,
    isStarred: true,
    priority: 'low',
    category: 'inquiry',
  },
  {
    id: '5',
    sender: {
      name: 'David Lee',
      company: 'Industrial Solutions',
      avatar: undefined,
      isSupplier: false,
    },
    subject: 'Support - Payment Issue',
    preview: 'I\'m having trouble with the payment processing for my recent order...',
    content: 'I\'m having trouble with the payment processing for my recent order. Could you please check the status and help resolve this issue?',
    timestamp: '2024-01-13T11:30:00Z',
    isRead: true,
    isStarred: false,
    priority: 'high',
    category: 'support',
  },
];

const SupplierMessages: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredMessages = messages.filter(message =>
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  const getCategoryColor = (category: Message['category']) => {
    switch (category) {
      case 'inquiry':
        return 'primary';
      case 'order':
        return 'success';
      case 'support':
        return 'error';
      case 'partnership':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, isRead: true } : m)
      );
    }
  };

  const handleStarToggle = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: { xs: 1, md: 4 }, paddingTop:{md: "10px"} }}>
      <SupplierHeader />
      
      <Container maxWidth="xl" sx={{ flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Badge badgeContent={unreadCount} color="error">
                <ChatIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Badge>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  pt: 2,
                }}
              >
                Messages
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Communicate with buyers, manage inquiries, and handle support requests
            </Typography>
          </Box>

          {/* Search */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Paper>

          <Box sx={{ display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Messages List */}
            <Paper sx={{ flex: isMobile ? 1 : 0.4, maxHeight: '600px', overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {filteredMessages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      component="button"
                      onClick={() => handleMessageClick(message)}
                      sx={{
                        py: 2,
                        backgroundColor: selectedMessage?.id === message.id ? 'action.selected' : 'transparent',
                        '&:hover': { backgroundColor: 'action.hover' },
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={message.sender.avatar}>
                          {message.sender.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: message.isRead ? 400 : 600,
                                flex: 1,
                              }}
                            >
                              {message.sender.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: message.isRead ? 400 : 600,
                                mb: 0.5,
                              }}
                            >
                              {message.subject}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {message.preview}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <Chip
                                label={message.category}
                                color={getCategoryColor(message.category)}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={message.priority}
                                color={getPriorityColor(message.priority)}
                                size="small"
                                variant="filled"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ ml: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(message.id);
                          }}
                        >
                          {message.isStarred ? (
                            <StarIcon color="warning" />
                          ) : (
                            <StarBorderIcon />
                          )}
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < filteredMessages.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Message Detail */}
            <Paper sx={{ flex: isMobile ? 1 : 0.6, p: 3 }}>
              {selectedMessage ? (
                <Box>
                  {/* Message Header */}
                  <Box mb={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar src={selectedMessage.sender.avatar}>
                        {selectedMessage.sender.name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedMessage.subject}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedMessage.sender.name} • {selectedMessage.sender.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(selectedMessage.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={selectedMessage.category}
                        color={getCategoryColor(selectedMessage.category)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={selectedMessage.priority}
                        color={getPriorityColor(selectedMessage.priority)}
                        size="small"
                        variant="filled"
                      />
                    </Box>
                  </Box>

                  {/* Message Content */}
                  <Card sx={{ mb: 3, backgroundColor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="body1">
                        {selectedMessage.content}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<ReplyIcon />}
                      fullWidth={isMobile}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MarkIcon />}
                      fullWidth={isMobile}
                    >
                      Mark as Unread
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth={isMobile}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="400px"
                  flexDirection="column"
                  gap={2}
                >
                  <ChatIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a message to view
                  </Typography>
                  <Typography variant="body2" color="text.disabled" textAlign="center">
                    Choose a message from the list to read and respond to inquiries
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Floating Action Button for Mobile */}
          {isMobile && (
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
              }}
            >
              <AddIcon />
            </Fab>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default SupplierMessages;
