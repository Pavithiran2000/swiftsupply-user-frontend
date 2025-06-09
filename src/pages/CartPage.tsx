import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Divider,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import {
  ShoppingCart as CartIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  LocalOffer as CouponIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  supplier: string;
  inStock: boolean;
}

const CartPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "ITEM-001",
      name: "Premium Bluetooth Headphones",
      price: 199.99,
      quantity: 1,
      image: "/logo.png",
      supplier: "TechPro Electronics",
      inStock: true,
    },
    {
      id: "ITEM-002",
      name: "Wireless Mouse",
      price: 45.50,
      quantity: 2,
      image: "/logo.png",
      supplier: "TechPro Electronics",
      inStock: true,
    },
    {
      id: "ITEM-003",
      name: "Office Chair",
      price: 299.00,
      quantity: 1,
      image: "/logo.png",
      supplier: "Home & Garden Plus",
      inStock: false,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

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
            <CartIcon sx={{ color: "maroon", fontSize: "2rem" }} />
            <Typography variant="h4" sx={{ fontWeight: "600", color: "text.primary" }}>
              Shopping Cart ({cartItems.length} items)
            </Typography>
          </Box>

          {cartItems.length > 0 ? (
            <Grid container spacing={3}>
              {/* Cart Items */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent sx={{ p: 0 }}>
                    {cartItems.map((item, index) => (
                      <Box key={item.id}>
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3} sm={2}>
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{
                                  width: "100%",
                                  aspectRatio: "1",
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              />
                            </Grid>
                            <Grid item xs={9} sm={10}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 0.5 }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                    Sold by: {item.supplier}
                                  </Typography>
                                  {!item.inStock && (
                                    <Chip 
                                      label="Out of Stock" 
                                      color="error"
                                      size="small"
                                      sx={{ mb: 1 }}
                                    />
                                  )}
                                  <Typography variant="h6" sx={{ fontWeight: "600", color: "maroon" }}>
                                    ${item.price.toFixed(2)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <IconButton
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    size="small"
                                    disabled={!item.inStock}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <Typography variant="body1" sx={{ minWidth: "2ch", textAlign: "center" }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    size="small"
                                    disabled={!item.inStock}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => removeItem(item.id)}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        {index < cartItems.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <Card sx={{ position: "sticky", top: 100 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
                      Order Summary
                    </Typography>

                    {/* Coupon Code */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          InputProps={{
                            startAdornment: <CouponIcon sx={{ mr: 1, color: "text.secondary" }} />,
                          }}
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            borderColor: "maroon",
                            color: "maroon",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Apply
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography variant="body2">${shipping.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2">${tax.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: "600" }}>Total:</Typography>
                      <Typography variant="h6" sx={{ fontWeight: "600", color: "maroon" }}>
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        bgcolor: "maroon",
                        "&:hover": { bgcolor: "#63051c" },
                        mb: 1,
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/home")}
                      sx={{
                        borderColor: "maroon",
                        color: "maroon",
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <CartIcon sx={{ fontSize: "4rem", color: "grey.400", mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1, color: "text.secondary" }}>
                  Your Cart is Empty
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                  Add some items to your cart to continue shopping.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/home")}
                  sx={{
                    bgcolor: "maroon",
                    "&:hover": { bgcolor: "#63051c" },
                  }}
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CartPage;
