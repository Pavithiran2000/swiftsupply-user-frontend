import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import {
  History as OrdersIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";

const OrdersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-12-01",
      total: "$1,250.00",
      status: "Delivered",
      items: 3,
    },
    {
      id: "ORD-002", 
      date: "2024-11-28",
      total: "$850.50",
      status: "In Transit",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2024-11-25",
      total: "$2,100.75",
      status: "Processing",
      items: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "info";
      case "Processing":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ 
        bgcolor: "#f8f8f8", 
        minHeight: "100vh",
        paddingBottom: isMobile ? "70px" : 0,
        pt: 3,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ 
                borderColor: "grey.300",
                color: "text.secondary",
              }}
            >
              Back
            </Button>
            <OrdersIcon sx={{ color: "maroon", fontSize: "2rem" }} />
            <Typography variant="h4" sx={{ fontWeight: "600", color: "text.primary" }}>
              Past Orders
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order.id}>
                  <Card sx={{ height: "100%", "&:hover": { boxShadow: 4 } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "600" }}>
                          {order.id}
                        </Typography>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                        Items: {order.items}
                      </Typography>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "600", color: "maroon" }}>
                          {order.total}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            borderColor: "maroon",
                            color: "maroon",
                            "&:hover": { 
                              bgcolor: "maroon",
                              color: "white",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <OrdersIcon sx={{ fontSize: "4rem", color: "grey.400", mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 1, color: "text.secondary" }}>
                      No Orders Yet
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      When you place orders, they will appear here.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default OrdersPage;
