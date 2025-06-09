import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
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
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Skeleton,
  Badge,
  Dialog,
  DialogContent,
  Fab,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingIcon,
  FiberNew as NewIcon,
  ExpandMore as ExpandMoreIcon,
  ZoomIn as ZoomIcon,
  NavigateNext as NavigateNextIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Home/HomeHeader";
import { type Product } from "../types/product";
import productApi from "../api/productsApi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const ProductDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // // Mock product data (in real app, this would come from API)
  // const mockProduct: Product = {
  //   id: "PROD-001",
  //   name: "Premium Bluetooth Headphones with Active Noise Cancellation",
  //   description:
  //     "Experience exceptional audio quality with our premium wireless headphones featuring advanced active noise cancellation technology. These professional-grade headphones are perfect for music enthusiasts, content creators, and professionals who demand superior sound quality and comfort during extended use.",
  //   price: 199.99,
  //   originalPrice: 249.99,
  //   images: [
  //     "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  //     "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
  //     "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800",
  //     "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
  //     "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
  //   ],
  //   category: "Electronics",
  //   productType: "Headphones",
  //   brand: "Sony",
  //   supplier: {
  //     id: "SUP-001",
  //     name: "TechPro Electronics",
  //     rating: 4.8,
  //     location: "New York, NY",
  //     verified: true,
  //   },
  //   specifications: {
  //     Brand: "TechPro Audio",
  //     Model: "TP-ANC Pro 2024",
  //     "Battery Life": "30 hours with ANC, 40 hours without",
  //     Connectivity: "Bluetooth 5.2, USB-C",
  //     "Driver Size": "40mm Dynamic Drivers",
  //     "Frequency Response": "20Hz - 40kHz",
  //     Weight: "250g",
  //     "Colors Available": "Midnight Black, Pearl White, Ocean Blue",
  //     "Noise Cancellation": "Active Noise Cancellation (ANC)",
  //     Microphone: "Built-in with CVC 8.0",
  //     "Charging Time": "2 hours (Quick charge: 15 min = 3 hours playback)",
  //     Foldable: "Yes, with premium carrying case",
  //     Warranty: "2 years international warranty",
  //   },
  //   rating: 4.7,
  //   reviews: 1250,
  //   minOrderQty: 10,
  //   inStock: true,
  //   isNew: true,
  //   isTrending: true,
  //   tags: ["wireless", "noise-cancelling", "premium", "professional"],
  //   createdAt: "2024-12-01T00:00:00Z",
  //   updatedAt: "2024-12-01T00:00:00Z",
  // };

  // const mockRelatedProducts: Product[] = [
  //   {
  //     id: "PROD-002",
  //     name: "Wireless Earbuds Pro",
  //     description: "Compact wireless earbuds with premium sound quality",
  //     price: 89.99,
  //     originalPrice: 119.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
  //       "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
  //     ],
  //     productType: "Earbuds",
  //     brand: "TechPro Audio",
  //     category: "Electronics",
  //     supplier: {
  //       id: "SUP-001",
  //       name: "TechPro Electronics",
  //       rating: 4.6,
  //       location: "New York, NY",
  //       verified: true
  //     },
  //     specifications: {},
  //     rating: 4.5,
  //     reviews: 890,
  //     minOrderQty: 20,
  //     inStock: true,
  //     isNew: false,
  //     isTrending: true,
  //     tags: ["wireless", "compact"],
  //     createdAt: "2024-11-01T00:00:00Z",
  //     updatedAt: "2024-11-01T00:00:00Z",
  //   },
  //   {
  //     id: "PROD-003",
  //     name: "Studio Monitor Speakers",
  //     description: "Professional studio monitors for audio production",
  //     price: 299.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
  //     ],
  //     productType: "Speakers",
  //     brand: "Base us",
  //     category: "Electronics",
  //     supplier: {
  //       id: "SUP-002",
  //       name: "Audio Pro Solutions",
  //       rating: 4.9,
  //       location: "Los Angeles, CA",
  //       verified: true,
  //     },
  //     specifications: {},
  //     rating: 4.8,
  //     reviews: 450,
  //     minOrderQty: 5,
  //     inStock: true,
  //     isNew: false,
  //     isTrending: false,
  //     tags: ["professional", "studio"],
  //     createdAt: "2024-10-15T00:00:00Z",
  //     updatedAt: "2024-10-15T00:00:00Z",
  //   },
  // ];

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     setLoading(true);
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     setProduct(mockProduct);
  //     setRelatedProducts(mockRelatedProducts);
  //     setLoading(false);
  //   };

  //   fetchProduct();
  // }, [id]);
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const productData = await productApi.getProductById(id!);
        setProduct(productData);

        const relatedData = await productApi.getRelatedProducts(id!);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Failed to load product or related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductAndRelated();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 999) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} units of ${product?.name} to cart`);
  };

  const handleContactSupplier = () => {
    // Contact supplier logic
    console.log(`Contacting supplier: ${product?.supplier.name}`);
  };

  const ImageGallery = () => (
    <Box>
      {/* Main Image */}
      <motion.div
        key={selectedImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            position: "relative",
            mb: 2,
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => setImageDialogOpen(true)}
        >
          <Box
            component="img"
            src={product?.images[selectedImageIndex]}
            alt={product?.name}
            sx={{
              width: "100%",
              height: { xs: 300, md: 400 },
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ZoomIcon />
          </IconButton>

          {/* Badges */}
          <Box sx={{ position: "absolute", top: 8, left: 8 }}>
            {product?.isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Chip
                  label="NEW"
                  color="success"
                  size="small"
                  icon={<NewIcon />}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              </motion.div>
            )}
            {product?.isTrending && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Chip
                  label="TRENDING"
                  color="warning"
                  size="small"
                  icon={<TrendingIcon />}
                />
              </motion.div>
            )}
          </Box>

          {/* Discount Badge */}
          {product?.originalPrice && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Box sx={{ position: "absolute", top: 8, right: 50 }}>
                <Chip
                  label={`${Math.round(
                    (1 - product.price / product.originalPrice) * 100
                  )}% OFF`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Thumbnail Images */}
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
        {product?.images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              sx={{
                cursor: "pointer",
                border: selectedImageIndex === index ? 2 : 0,
                borderColor: "primary.main",
                minWidth: 80,
                opacity: selectedImageIndex === index ? 1 : 0.7,
              }}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Box
                component="img"
                src={image}
                alt={`${product?.name} ${index + 1}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                }}
              />
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );

  const ProductInfo = () => (
    <Box>
      {/* Breadcrumbs */}
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
          href="/products"
          onClick={(e) => {
            e.preventDefault();
            navigate("/products");
          }}
        >
          Products
        </Link>
        <Typography color="text.primary">{product?.category}</Typography>
      </Breadcrumbs>

      {/* Product Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", mb: 2, lineHeight: 1.3 }}
        >
          {product?.name}
        </Typography>
      </motion.div>

      {/* Rating and Reviews */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Rating value={product?.rating} precision={0.1} readOnly />
          <Typography variant="body1">
            {product?.rating} ({product?.reviews} reviews)
          </Typography>
          <Chip label={product?.category} color="primary" size="small" />
        </Box>
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            color="primary"
            sx={{ fontWeight: "700", mb: 1 }}
          >
            ${product?.price.toFixed(2)}
          </Typography>
          {product?.originalPrice && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h5"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ${product.originalPrice.toFixed(2)}
              </Typography>
              <Chip
                label={`Save $${(product.originalPrice - product.price).toFixed(
                  2
                )}`}
                color="success"
                size="small"
              />
            </Box>
          )}
        </Box>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
          {product?.description}
        </Typography>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
            Key Features
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {product?.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Chip label={tag} variant="outlined" color="primary" />
              </motion.div>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Quantity and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={3} alignItems="center">
            {/* Quantity Selector */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1 }}>
                Quantity (Min: {product?.minOrderQty})
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= product?.minOrderQty!}
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val >= product?.minOrderQty! && val <= 999) {
                      setQuantity(val);
                    }
                  }}
                  inputProps={{
                    min: product?.minOrderQty,
                    max: 999,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 80 }}
                  size="small"
                />
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 999}
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  disabled={!product?.inStock}
                  sx={{
                    bgcolor: "maroon",
                    "&:hover": { bgcolor: "#63051c" },
                    py: 1.5,
                  }}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    color={isFavorite ? "error" : "default"}
                    sx={{ border: 1, borderColor: "divider", flex: 1 }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton
                    sx={{ border: 1, borderColor: "divider", flex: 1 }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Stock Status */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: product?.inStock ? "success.main" : "error.main",
              }}
            />
            <Typography
              variant="body2"
              color={product?.inStock ? "success.main" : "error.main"}
            >
              {product?.inStock ? "In Stock" : "Out of Stock"}
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );

  const SupplierCard = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
          Supplier Information
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main" }}>
            {product?.supplier.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "600" }}>
                {product?.supplier.name}
              </Typography>
              {product?.supplier.verified && (
                <VerifiedIcon
                  sx={{ color: "success.main", fontSize: "1.2rem" }}
                />
              )}
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Rating
                value={product?.supplier.rating}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                ({product?.supplier.rating})
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
            <Typography variant="body2">
              {product?.supplier.location}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<MessageIcon />}
            onClick={handleContactSupplier}
            fullWidth
          >
            Contact Supplier
          </Button>
          <Button variant="outlined" startIcon={<PhoneIcon />} fullWidth>
            Request Quote
          </Button>
        </Box>
      </Card>
    </motion.div>
  );

  const ProductTabs = () => (
    <Box sx={{ mt: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <Tab label="Specifications" />
        <Tab label="Reviews" />
        <Tab label="Shipping & Returns" />
        <Tab label="Q&A" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {Object.entries(product?.specifications || {}).map(
                ([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: "600", width: "30%" }}>
                      {key}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Customer Reviews
        </Typography>
        {/* Reviews would be dynamically loaded here */}
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">Reviews coming soon...</Typography>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <ShippingIcon color="primary" />
              <Typography variant="h6">Shipping Information</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Free shipping on orders over $500. Standard delivery 3-7 business
              days.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h6">Return Policy</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              30-day return policy. Items must be in original condition.
            </Typography>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Questions & Answers
        </Typography>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No questions yet. Be the first to ask!
          </Typography>
        </Box>
      </TabPanel>
    </Box>
  );

  const RelatedProducts = () => (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
        Related Products
      </Typography>
      <Grid container spacing={3}>
        {relatedProducts.map((relatedProduct, index) => (
          <Grid item xs={12} sm={6} md={4} key={relatedProduct.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card
                sx={{ cursor: "pointer", height: "100%" }}
                onClick={() => navigate(`/products/${relatedProduct.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={relatedProduct.images[0]}
                  alt={relatedProduct.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                    {relatedProduct.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {relatedProduct.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "700" }}
                  >
                    ${relatedProduct.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={80}
                    height={80}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
              <Skeleton
                variant="text"
                sx={{ fontSize: "3rem", mb: 2, width: "50%" }}
              />
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
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
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 3 }}
            >
              Back to Products
            </Button>
          </motion.div>

          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <ImageGallery />
            </Grid>

            {/* Product Information */}
            <Grid item xs={12} md={6}>
              <ProductInfo />
            </Grid>

            {/* Supplier Information */}
            <Grid item xs={12} md={4}>
              <SupplierCard />
            </Grid>

            {/* Product Details Tabs */}
            <Grid item xs={12} md={8}>
              <ProductTabs />
            </Grid>
          </Grid>

          {/* Related Products */}
          <RelatedProducts />
        </Container>

        {/* Image Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <Box
              component="img"
              src={product?.images[selectedImageIndex]}
              alt={product?.name}
              sx={{ width: "100%", height: "auto" }}
            />
          </DialogContent>
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
          <Badge badgeContent={3} color="error">
            <CartIcon />
          </Badge>
        </Fab>
      </Box>
    </>
  );
};

export default ProductDetailPage;
