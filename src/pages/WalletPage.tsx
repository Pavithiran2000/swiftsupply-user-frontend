import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import {
  AccountBalanceWallet as WalletIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";

const WalletPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mock wallet data
  const walletData = {
    balance: 5420.75,
    totalSpent: 12350.25,
    totalEarned: 17771.00,
    transactions: [
      {
        id: "TXN-001",
        type: "credit",
        amount: 1250.00,
        description: "Refund for cancelled order",
        date: "2024-12-01",
      },
      {
        id: "TXN-002",
        type: "debit", 
        amount: 850.50,
        description: "Payment for Order ORD-002",
        date: "2024-11-28",
      },
      {
        id: "TXN-003",
        type: "credit",
        amount: 500.00,
        description: "Wallet top-up",
        date: "2024-11-25",
      },
    ],
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
            <WalletIcon sx={{ color: "maroon", fontSize: "2rem" }} />
            <Typography variant="h4" sx={{ fontWeight: "600", color: "text.primary" }}>
              My Wallet
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Balance Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ background: "linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)", color: "white" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    Available Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "600", mb: 2 }}>
                    ${walletData.balance.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ 
                        bgcolor: "rgba(255,255,255,0.2)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      Add Money
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                      sx={{ 
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                        "&:hover": { 
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Withdraw
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Stats Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <TrendingUpIcon sx={{ color: "maroon" }} />
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      Wallet Statistics
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      Total Earned
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "600", color: "green", mb: 1 }}>
                      ${walletData.totalEarned.toFixed(2)}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "green",
                        },
                      }} 
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      Total Spent
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "600", color: "maroon", mb: 1 }}>
                      ${walletData.totalSpent.toFixed(2)}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: "rgba(139, 0, 0, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "maroon",
                        },
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Transactions */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 3 }}>
                    Recent Transactions
                  </Typography>
                  
                  {walletData.transactions.map((transaction) => (
                    <Box 
                      key={transaction.id}
                      sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        py: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>
                          {transaction.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.id}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: "600",
                          color: transaction.type === "credit" ? "green" : "maroon",
                        }}
                      >
                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button variant="outlined" sx={{ borderColor: "maroon", color: "maroon" }}>
                      View All Transactions
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default WalletPage;
