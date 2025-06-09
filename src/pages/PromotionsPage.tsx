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
  LocalOffer as PromotionsIcon,
  ArrowBack as ArrowBackIcon,
  StarRate as StarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";

const PromotionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mock promotions data
  const promotions = [
    {
      id: "PROMO-001",
      title: "New User Discount",
      description: "Get 20% off on your first order above $100",
      discount: "20% OFF",
      code: "WELCOME20",
      validUntil: "2025-01-31",
      minOrder: 100,
      category: "First Time",
      used: false,
    },
    {
      id: "PROMO-002",
      title: "Bulk Order Savings", 
      description: "Save $50 on orders above $500",
      discount: "$50 OFF",
      code: "BULK50",
      validUntil: "2025-02-15",
      minOrder: 500,
      category: "Bulk Purchase",
      used: true,
    },
    {
      id: "PROMO-003",
      title: "Premium Member Deal",
      description: "Exclusive 15% discount for premium members",
      discount: "15% OFF",
      code: "PREMIUM15",
      validUntil: "2025-03-01",
      minOrder: 200,
      category: "Premium",
      used: false,
    },
    {
      id: "PROMO-004",
      title: "Electronics Special",
      description: "Extra 10% off on all electronics items",
      discount: "10% OFF",
      code: "ELECTRONICS10",
      validUntil: "2024-12-31",
      minOrder: 0,
      category: "Category",
      used: false,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "First Time":
        return "success";
      case "Bulk Purchase":
        return "info";
      case "Premium":
        return "warning";
      case "Category":
        return "secondary";
      default:
        return "default";
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
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
            <PromotionsIcon sx={{ color: "maroon", fontSize: "2rem" }} />
            <Typography variant="h4" sx={{ fontWeight: "600", color: "text.primary" }}>
              Promotions & Offers
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {promotions.map((promo) => (
              <Grid item xs={12} md={6} lg={4} key={promo.id}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    "&:hover": { boxShadow: 4 },
                    opacity: promo.used || isExpired(promo.validUntil) ? 0.7 : 1,
                    border: promo.used ? "2px solid #ccc" : "2px solid transparent",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip 
                        label={promo.category} 
                        color={getCategoryColor(promo.category) as any}
                        size="small"
                      />
                      {promo.used && (
                        <Chip 
                          label="USED" 
                          color="default"
                          size="small"
                        />
                      )}
                      {isExpired(promo.validUntil) && !promo.used && (
                        <Chip 
                          label="EXPIRED" 
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                      {promo.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                      {promo.description}
                    </Typography>

                    <Box sx={{ 
                      bgcolor: "maroon", 
                      color: "white", 
                      p: 2, 
                      borderRadius: 2, 
                      textAlign: "center",
                      mb: 2,
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: "600" }}>
                        {promo.discount}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Code: {promo.code}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <TimeIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Valid until {new Date(promo.validUntil).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {promo.minOrder > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <StarIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Minimum order: ${promo.minOrder}
                        </Typography>
                      </Box>
                    )}

                    <Button 
                      variant={promo.used || isExpired(promo.validUntil) ? "outlined" : "contained"}
                      fullWidth
                      disabled={promo.used || isExpired(promo.validUntil)}
                      sx={{ 
                        mt: 2,
                        bgcolor: promo.used || isExpired(promo.validUntil) ? "transparent" : "maroon",
                        "&:hover": { 
                          bgcolor: promo.used || isExpired(promo.validUntil) ? "transparent" : "#63051c",
                        },
                      }}
                    >
                      {promo.used ? "Already Used" : isExpired(promo.validUntil) ? "Expired" : "Apply Now"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {promotions.length === 0 && (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <PromotionsIcon sx={{ fontSize: "4rem", color: "grey.400", mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1, color: "text.secondary" }}>
                  No Promotions Available
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Check back later for exciting offers and discounts!
                </Typography>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </>
  );
};

export default PromotionsPage;
