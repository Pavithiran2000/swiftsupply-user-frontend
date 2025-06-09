import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Rating,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Skeleton,
  Badge,
  CardMedia,
  IconButton,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";

import {
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  WhatsApp as WhatsAppIcon,
  Verified as VerifiedIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Factory as FactoryIcon,
  CheckCircle as CheckIcon,
  ShoppingCart as CartIcon,
  Send as SendIcon,
  Message as MessageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";
import type {
  Supplier,
  SupplierReview,
  SupplierContact,
} from "../types/supplier";
import supplierApi from "../api/supplierApi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const SupplierDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State management
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [contactDialog, setContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState<SupplierContact>({
    type: "inquiry",
    subject: "",
    message: "",
    productInterest: "",
  });
  const [reviews, setReviews] = useState<SupplierReview[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);


  // Mock supplier data
  // const mockSupplier: Supplier = {
  //   id: "SUP-001",
  //   name: "Hangzhou Yinjiang Metal Product Co., Ltd.",
  //   description:
  //     "Professional manufacturer of metal storage solutions and organization products with over 15 years of experience. We specialize in innovative designs and high-quality manufacturing to meet global market demands.",
  //   logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center",
  //   coverImage:
  //     "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&h=400&fit=crop",
  //   location:
  //     "No. 123 Industrial Road, Xiaoshan District, Hangzhou, Zhejiang Province, 311200",
  //   contact: {
  //     email: "sales@yinjiang.com",
  //     phone: "+86-571-8888-9999",
  //   },
  //   rating: 4.9,
  //   totalReviews: 847,
  //   verified: true,
  //   productTypes: [
  //     "Storage Racks",
  //     "Metal Organizers",
  //     "Display Stands",
  //     "Shoe Racks",
  //     "Kitchen Storage",
  //   ],
  //   categories: ["Home & Garden", "Storage Solutions", "Metal Products"],
  //   businessType: "Manufacturer",
  //   certifications: ["ISO 9001:2015", "CE", "SGS", "ROHS", "BSCI"],
  //   isGoldSupplier: true,
  //   isPremium: true,
  //   totalProducts: 156,
  //   totalOrders: 2840,
  //   successRate: 98.5,
  //   createdAt: "2008-03-15",
  //   lastActive: "2024-12-08",
  // };

  // // Mock reviews data
  // const mockReviews: SupplierReview[] = [
  //   {
  //     id: "REV-001",
  //     buyerName: "James Wilson",
  //     buyerCountry: "United States",
  //     rating: 5,
  //     comment:
  //       "Excellent quality storage racks. Fast delivery and great communication throughout the process. Highly recommended!",
  //     orderValue: 2500,
  //     productCategory: "Storage Racks",
  //     date: "2024-11-15",
  //     verified: true,
  //   },
  //   {
  //     id: "REV-002",
  //     buyerName: "Maria Garcia",
  //     buyerCountry: "Spain",
  //     rating: 4.8,
  //     comment:
  //       "Good quality products and professional service. Minor delay in shipping but overall satisfied with the purchase.",
  //     orderValue: 1800,
  //     productCategory: "Metal Organizers",
  //     date: "2024-10-28",
  //     verified: true,
  //   },
  //   {
  //     id: "REV-003",
  //     buyerName: "David Chen",
  //     buyerCountry: "Canada",
  //     rating: 5,
  //     comment:
  //       "Outstanding quality and attention to detail. The custom design service exceeded our expectations.",
  //     orderValue: 4200,
  //     productCategory: "Display Stands",
  //     date: "2024-10-10",
  //     verified: true,
  //   },
  // ];

  // Effects
  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    setLoading(true);
    try {
      if (!id) throw new Error("Supplier ID not found in URL");
      const data = await supplierApi.getSupplierDetails(Number(id));
      setSupplier(data);
      console.log(data);
      
      // setReviews(data.totalReviews || []);
    } catch (error) {
      console.error("Failed to load supplier details", error);
    } finally {
      setLoading(false);
    }
  };
  // Handlers
  // const loadSupplier = async () => {
  //   setLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     setSupplier(mockSupplier);
  //   } catch (error) {
  //     console.error('Error loading supplier:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContactSubmit = () => {
    console.log("Contact form submitted:", contactForm);
    setContactDialog(false);
    // Reset form
    setContactForm({
      type: "inquiry",
      subject: "",
      message: "",
      productInterest: "",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ mb: 3, borderRadius: 2 }}
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton
                variant="rectangular"
                height={600}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  if (!supplier) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">Supplier not found</Typography>
            <Button onClick={() => navigate("/suppliers")} sx={{ mt: 2 }}>
              Back to Suppliers
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          bgcolor: "#f8f8f8",
          minHeight: "100vh",
          paddingBottom: isMobile ? "70px" : 0,
          pt: 3,
        }}
      >
        <Container maxWidth="xl">
          {/* Breadcrumb */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="/home"
              onClick={(e) => {
                e.preventDefault();
                navigate("/home");
              }}
            >
              Home
            </Link>
            <Link
              color="inherit"
              href="/suppliers"
              onClick={(e) => {
                e.preventDefault();
                navigate("/suppliers");
              }}
            >
              Suppliers
            </Link>
            <Typography color="text.primary">{supplier.name}</Typography>
          </Breadcrumbs>

          {/* Cover Image & Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ mb: 3, overflow: "hidden" }}>
              {/* Cover Image */}
              <CardMedia
                component="img"
                height={isMobile ? 200 : 300}
                image={supplier.coverImage}
                alt={supplier.name}
                sx={{
                  objectFit: "cover",
                  height: { xs: 200, sm: 300 },
                  width: "100%",
                }}
              />

              {/* Supplier Header */}
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Avatar
                      src={supplier.logo}
                      alt={supplier.name}
                      sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 80, sm: 120 },
                        border: "4px solid white",
                        boxShadow: 3,
                      }}
                    />
                  </motion.div>

                  {/* Basic Info */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: "600" }}>
                        {supplier.name}
                      </Typography>

                      {/* Badges */}
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {supplier.verified && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Chip
                              label="VERIFIED"
                              color="success"
                              icon={<VerifiedIcon />}
                              sx={{ fontWeight: "600" }}
                            />
                          </motion.div>
                        )}
                        {supplier.isGoldSupplier && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Chip
                              label="GOLD SUPPLIER"
                              sx={{
                                bgcolor: "gold",
                                color: "black",
                                fontWeight: "600",
                                "& .MuiChip-icon": { color: "black" },
                              }}
                              icon={<TrophyIcon />}
                            />
                          </motion.div>
                        )}
                        {supplier.isPremium && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Chip
                              label="PREMIUM"
                              sx={{
                                bgcolor: "purple",
                                color: "white",
                                fontWeight: "600",
                                "& .MuiChip-icon": { color: "white" },
                              }}
                              icon={<TrendingIcon />}
                            />
                          </motion.div>
                        )}
                      </Box>
                    </Box>

                    {/* Rating & Location */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Rating
                          value={supplier.rating}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>
                          {supplier.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({supplier.totalReviews} reviews)
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationIcon color="action" />
                        <Typography variant="body2">
                          {supplier.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Quick Stats */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: "rgba(0,0,0,0.04)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "600", color: "primary.main" }}
                          >
                            {supplier.totalProducts}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Products
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: "rgba(0,0,0,0.04)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "600", color: "success.main" }}
                          >
                            {supplier.successRate}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Success Rate
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {supplier.description}
                    </Typography>

                    {/* Main Products */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {supplier.productTypes.map((product, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Chip
                            label={product}
                            variant="outlined"
                            color="primary"
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      minWidth: 200,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<MessageIcon />}
                      onClick={() => setContactDialog(true)}
                      sx={{
                        bgcolor: "maroon",
                        "&:hover": { bgcolor: "#63051c" },
                      }}
                    >
                      Contact Supplier
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      href={`tel:${supplier.contact.phone}`}
                    >
                      Call Now
                    </Button>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => setIsFavorited(!isFavorited)}
                        color={isFavorited ? "error" : "default"}
                      >
                        {isFavorited ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Content */}
            <Grid item xs={12} lg={8}>
              <Card>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {/* <Tab label="Company Profile" /> */}
                  <Tab label="Products & Services" />
                  <Tab label="Certifications" />
                  <Tab label="Reviews" />
                  <Tab label="Trade Capacity" />
                </Tabs>

                {/* Company Profile Tab
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                        Company Information
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "600" }}>Business Type</TableCell>
                              <TableCell>{supplier.businessType}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                        Services & Capabilities
                      </Typography>

                      <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: "600" }}>
                        Export Markets
                      </Typography>
              
                    </Grid>
                  </Grid>
                </TabPanel> */}

                {/* Products & Services Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                    Main Products
                  </Typography>
                  <Grid container spacing={2}>
                    {supplier.productTypes.map((product, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          variant="outlined"
                          sx={{ p: 2, textAlign: "center" }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: "primary.light",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 1,
                            }}
                          >
                            <FactoryIcon sx={{ color: "primary.main" }} />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "600" }}
                          >
                            {product}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography
                    variant="h6"
                    sx={{ mb: 2, mt: 4, fontWeight: "600" }}
                  >
                    Product Categories
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {supplier.categories.map((category, index) => (
                      <Chip key={index} label={category} color="primary" />
                    ))}
                  </Box>
                </TabPanel>

                {/* Certifications Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: "600" }}>
                    Certifications & Standards
                  </Typography>
                  <Grid container spacing={2}>
                    {supplier.certifications.map((cert, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          variant="outlined"
                          sx={{ p: 3, textAlign: "center", height: "100%" }}
                        >
                          <SecurityIcon
                            sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "600", mb: 1 }}
                          >
                            {cert}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Certified by accredited third party
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                {/* Reviews Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      Customer Reviews ({reviews.length})
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating
                        value={supplier.rating}
                        precision={0.1}
                        readOnly
                      />
                      <Typography variant="h6" sx={{ fontWeight: "600" }}>
                        {supplier.rating}
                      </Typography>
                    </Box>
                  </Box>

                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="outlined" sx={{ mb: 2, p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "600" }}
                              >
                                {review.buyerName}
                              </Typography>
                              <Chip
                                label={review.buyerCountry}
                                size="small"
                                variant="outlined"
                              />
                              {review.verified && (
                                <VerifiedIcon
                                  color="success"
                                  fontSize="small"
                                />
                              )}
                            </Box>
                            <Rating
                              value={review.rating}
                              precision={0.1}
                              size="small"
                              readOnly
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {review.comment}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <Chip
                            label={`Order: $${review.orderValue.toLocaleString()}`}
                            size="small"
                          />
                          <Chip
                            label={review.productCategory}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Card>
                    </motion.div>
                  ))}
                </TabPanel>

                {/* Trade Capacity Tab */}
                <TabPanel value={tabValue} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "600" }}
                      >
                        Business Statistics
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "rgba(76, 175, 80, 0.1)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: "600", color: "success.main" }}
                          >
                            {supplier.totalOrders.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Orders Completed
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "rgba(33, 150, 243, 0.1)",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: "600", color: "primary.main" }}
                          >
                            {supplier.successRate}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Order Success Rate
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Card>
            </Grid>

            {/* Right Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                    Contact Information
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                          Address
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                          Phone
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.contact.phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon color="action" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                          Email
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.contact.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<MessageIcon />}
                      onClick={() => setContactDialog(true)}
                      sx={{
                        bgcolor: "maroon",
                        "&:hover": { bgcolor: "#63051c" },
                      }}
                      fullWidth
                    >
                      Send Inquiry
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      href={`tel:${supplier.contact.phone}`}
                      fullWidth
                    >
                      Call Supplier
                    </Button>
                  </Box>
                </Card>
              </motion.div>

              {/* Quick Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                    Quick Facts
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Business Type</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {supplier.businessType}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Total Products</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {supplier.totalProducts}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Success Rate</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: "success.main" }}
                      >
                        {supplier.successRate}%
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Contact Dialog */}
        <Dialog
          open={contactDialog}
          onClose={() => setContactDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Contact {supplier.name}</Typography>
              <IconButton onClick={() => setContactDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                select
                label="Inquiry Type"
                value={contactForm.type}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    type: e.target.value as any,
                  }))
                }
                fullWidth
              >
                <MenuItem value="inquiry">General Inquiry</MenuItem>
                <MenuItem value="quote">Request Quote</MenuItem>
                <MenuItem value="call">Request Call Back</MenuItem>
                <MenuItem value="whatsapp">WhatsApp Contact</MenuItem>
              </TextField>

              <TextField
                label="Subject"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Product of Interest"
                value={contactForm.productInterest}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    productInterest: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Message"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                multiline
                rows={4}
                fullWidth
                placeholder="Please provide details about your requirements..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setContactDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleContactSubmit}
              startIcon={<SendIcon />}
              sx={{
                bgcolor: "maroon",
                "&:hover": { bgcolor: "#63051c" },
              }}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Cart Button */}
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: isMobile ? 90 : 20,
            right: 20,
            bgcolor: "maroon",
            "&:hover": { bgcolor: "#63051c" },
          }}
          onClick={() => navigate("/cart")}
        >
          <Badge badgeContent={cartCount} color="error">
            <CartIcon />
          </Badge>
        </Fab>
      </Box>
    </>
  );
};

export default SupplierDetailPage;
