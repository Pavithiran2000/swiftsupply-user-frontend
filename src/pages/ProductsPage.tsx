import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  Drawer,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Rating,
  useTheme,
  useMediaQuery,
  Skeleton,
  Badge,
  Fab,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingIcon,
  FiberNew as NewIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Home/HomeHeader";
import type {
  Product,
  ProductFilter,
  ProductSort,
  PaginationInfo,
} from "../types/product";
import productApi from "../api/productsApi";

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState<ProductFilter>({});
  const [sort, setSort] = useState<ProductSort>({
    field: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  // Categories and filter options
  const categories = [
    "Electronics",
    "Apparel & Accessories",
    "Home & Garden",
    "Machinery",
    "Automotive",
    "Health & Medicine",
    "Food & Beverage",
    "Packaging & Printing",
    "Chemicals",
    "Business Services",
  ];

  const productTypes = [
    "Headphones",
    "TV",
    "Smartphone",
    "Laptop",
    "T-Shirt",
    "Jeans",
    "Shoes",
    "Chair",
    "Table",
    "Coffee Machine",
    "Camera",
    "Watch",
    "Tablet",
    "Speaker",
  ];

  const sortOptions = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "createdAt-asc", label: "Oldest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "reviews-desc", label: "Most Reviews" },
    { value: "name-asc", label: "Name: A to Z" },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts(
          // filters,
          // sort,
          pagination
        );

        setProducts(response.products);
        setPagination((prev) => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, filters, sort, pagination.page, pagination.limit]);

  // const mockProducts: Product[] = [
  //   {
  //     id: "PROD-001",
  //     name: "Premium Bluetooth Headphones",
  //     description:
  //       "High-quality wireless headphones with noise cancellation and superior sound quality. Perfect for professional use and entertainment.",
  //     price: 199.99,
  //     originalPrice: 249.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  //       "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
  //       "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400",
  //     ],
  //     category: "Electronics",
  //     productType: "Headphones",
  //     brand: "Sony",
  //     supplier: {
  //       id: "SUP-001",
  //       name: "TechPro Electronics",
  //       rating: 4.8,
  //       location: "New York, NY",
  //       verified: true,
  //     },
  //     specifications: {
  //       "Battery Life": "30 hours",
  //       Connectivity: "Bluetooth 5.0",
  //       Weight: "250g",
  //       Color: "Black, White, Blue",
  //     },
  //     rating: 4.7,
  //     reviews: 1250,
  //     minOrderQty: 10,
  //     inStock: true,
  //     isNew: true,
  //     isTrending: true,
  //     tags: ["wireless", "noise-cancelling", "premium"],
  //     createdAt: "2024-12-01T00:00:00Z",
  //     updatedAt: "2024-12-01T00:00:00Z",
  //   },
  //   {
  //     id: "PROD-002",
  //     name: "Organic Cotton T-Shirts",
  //     description:
  //       "Sustainable and comfortable organic cotton t-shirts. Available in multiple colors and sizes. Perfect for bulk orders.",
  //     price: 15.99,
  //     originalPrice: 19.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  //       "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
  //     ],
  //     category: "Apparel & Accessories",
  //     productType: "T-Shirt",
  //     brand: "EcoWear",
  //     supplier: {
  //       id: "SUP-002",
  //       name: "Fashion Forward",
  //       rating: 4.6,
  //       location: "Los Angeles, CA",
  //       verified: true,
  //     },
  //     specifications: {
  //       Material: "100% Organic Cotton",
  //       Sizes: "XS-XXL",
  //       Care: "Machine Wash",
  //       Colors: "10+ colors available",
  //     },
  //     rating: 4.5,
  //     reviews: 890,
  //     minOrderQty: 50,
  //     inStock: true,
  //     isNew: false,
  //     isTrending: true,
  //     tags: ["organic", "sustainable", "comfortable"],
  //     createdAt: "2024-11-15T00:00:00Z",
  //     updatedAt: "2024-11-15T00:00:00Z",
  //   },
  //   {
  //     id: "PROD-003",
  //     name: "Industrial Coffee Machine",
  //     description:
  //       "Professional-grade espresso machine for cafes and restaurants. High capacity with multiple brewing options.",
  //     price: 2499.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
  //       "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
  //     ],
  //     category: "Machinery",
  //     productType: "Coffee Machine",
  //     brand: "BrewMaster",
  //     supplier: {
  //       id: "SUP-003",
  //       name: "Kitchen Pro Solutions",
  //       rating: 4.9,
  //       location: "Chicago, IL",
  //       verified: true,
  //     },
  //     specifications: {
  //       Capacity: "200 cups/hour",
  //       Power: "3000W",
  //       Dimensions: "60x45x40 cm",
  //       Warranty: "2 years",
  //     },
  //     rating: 4.8,
  //     reviews: 320,
  //     minOrderQty: 1,
  //     inStock: true,
  //     isNew: false,
  //     isTrending: false,
  //     tags: ["commercial", "espresso", "professional"],
  //     createdAt: "2024-10-20T00:00:00Z",
  //     updatedAt: "2024-10-20T00:00:00Z",
  //   },
  //   {
  //     id: "PROD-004",
  //     name: "Smart Home Security Camera",
  //     description:
  //       "WiFi-enabled security camera with 4K recording, night vision, and mobile app control. Perfect for home and office security.",
  //     price: 89.99,
  //     originalPrice: 129.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
  //     ],
  //     category: "Electronics",
  //     productType: "Camera",
  //     brand: "SecureTech",
  //     supplier: {
  //       id: "SUP-004",
  //       name: "SecureTech Systems",
  //       rating: 4.4,
  //       location: "Austin, TX",
  //       verified: false,
  //     },
  //     specifications: {
  //       Resolution: "4K Ultra HD",
  //       Storage: "Cloud & Local",
  //       Connectivity: "WiFi 802.11ac",
  //       Features: "Night Vision, Motion Detection",
  //     },
  //     rating: 4.3,
  //     reviews: 567,
  //     minOrderQty: 5,
  //     inStock: true,
  //     isNew: true,
  //     isTrending: false,
  //     tags: ["smart", "security", "4K", "wifi"],
  //     createdAt: "2024-11-30T00:00:00Z",
  //     updatedAt: "2024-11-30T00:00:00Z",
  //   },
  //   {
  //     id: "PROD-005",
  //     name: "Ergonomic Office Chair",
  //     description:
  //       "Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh design. Ideal for long work sessions.",
  //     price: 299.99,
  //     images: [
  //       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
  //       "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
  //     ],
  //     category: "Home & Garden",
  //     productType: "Chair",
  //     brand: "ComfortMax",
  //     supplier: {
  //       id: "SUP-005",
  //       name: "Office Comfort Plus",
  //       rating: 4.7,
  //       location: "Seattle, WA",
  //       verified: true,
  //     },
  //     specifications: {
  //       "Weight Capacity": "150kg",
  //       Adjustments: "Height, Armrest, Tilt",
  //       Material: "Mesh & Foam",
  //       Colors: "Black, Gray, Blue",
  //     },
  //     rating: 4.6,
  //     reviews: 743,
  //     minOrderQty: 5,
  //     inStock: false,
  //     isNew: false,
  //     isTrending: true,
  //     tags: ["ergonomic", "office", "comfort", "adjustable"],
  //     createdAt: "2024-09-15T00:00:00Z",
  //     updatedAt: "2024-09-15T00:00:00Z",
  //   },
  // ];

  // Simulate API call
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     // Simulate network delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     let filteredProducts = [...mockProducts];

  //     // Apply search filter
  //     if (searchQuery) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) =>
  //           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           product.description
  //             .toLowerCase()
  //             .includes(searchQuery.toLowerCase()) ||
  //           product.category.toLowerCase().includes(searchQuery.toLowerCase())
  //       );
  //     }
  //     // Apply other filters
  //     if (filters.category) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) => product.category === filters.category
  //       );
  //     }
  //     if (filters.productType) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) => product.productType === filters.productType
  //       );
  //     }
  //     if (filters.priceRange) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) =>
  //           product.price >= filters.priceRange![0] &&
  //           product.price <= filters.priceRange![1]
  //       );
  //     }
  //     if (filters.rating) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) => product.rating >= filters.rating!
  //       );
  //     }
  //     if (filters.inStock !== undefined) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) => product.inStock === filters.inStock
  //       );
  //     }
  //     if (filters.isNew) {
  //       filteredProducts = filteredProducts.filter((product) => product.isNew);
  //     }
  //     if (filters.isTrending) {
  //       filteredProducts = filteredProducts.filter(
  //         (product) => product.isTrending
  //       );
  //     }

  //     // Apply sorting
  //     filteredProducts.sort((a, b) => {
  //       const { field, order } = sort;
  //       let aValue = a[field];
  //       let bValue = b[field];

  //       if (field === "createdAt") {
  //         aValue = new Date(aValue as string).getTime();
  //         bValue = new Date(bValue as string).getTime();
  //       }

  //       if (order === "asc") {
  //         return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  //       } else {
  //         return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  //       }
  //     });

  //     // Apply pagination
  //     const startIndex = (pagination.page - 1) * pagination.limit;
  //     const endIndex = startIndex + pagination.limit;
  //     const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  //     setProducts(paginatedProducts);
  //     setPagination((prev) => ({
  //       ...prev,
  //       total: filteredProducts.length,
  //       totalPages: Math.ceil(filteredProducts.length / prev.limit),
  //     }));
  //     setLoading(false);
  //   };

  //   fetchProducts();
  // }, [searchQuery, filters, sort, pagination.page, pagination.limit]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleFilterChange = (newFilters: Partial<ProductFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [
      ProductSort["field"],
      ProductSort["order"]
    ];
    setSort({ field, order });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSearchParams({});
  };

  const ProductCard = ({
    product,
    index,
  }: {
    product: Product;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
    >
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          position: "relative",
          overflow: "visible",
        }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Badges */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          {product.isNew && (
            <Chip
              label="NEW"
              color="success"
              size="small"
              icon={<NewIcon />}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
          {product.isTrending && (
            <Chip
              label="TRENDING"
              color="warning"
              size="small"
              icon={<TrendingIcon />}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
        </Box>

        {/* Discount Badge */}
        {product.originalPrice && (
          <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
            <Chip
              label={`${Math.round(
                (1 - product.price / product.originalPrice) * 100
              )}% OFF`}
              color="error"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        )}

        <CardMedia
          component="img"
          height="200"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: "600" }}
            >
              {product.category}
            </Typography>
            {product.supplier.verified && (
              <VerifiedIcon sx={{ fontSize: "1rem", color: "success.main" }} />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "500" }}
            >
              {product.productType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {product.brand}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: "600", mb: 1, lineHeight: 1.3 }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.4 }}
          >
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Rating
              value={product.rating}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviews})
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "700" }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              {product.originalPrice && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  ${product.originalPrice.toFixed(2)}
                </Typography>
              )}
            </Box>
            {!product.inStock && (
              <Chip label="Out of Stock" color="error" size="small" />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            By: {product.supplier.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Min Order: {product.minOrderQty} units
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      sx={{ "& .MuiDrawer-paper": { width: 320, p: 2 } }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          Filters
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>{" "}
      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category || ""}
          label="Category"
          onChange={(e) =>
            handleFilterChange({ category: e.target.value || undefined })
          }
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Product Type Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Product Type</InputLabel>
        <Select
          value={filters.productType || ""}
          label="Product Type"
          onChange={(e) =>
            handleFilterChange({ productType: e.target.value || undefined })
          }
        >
          <MenuItem value="">All Product Types</MenuItem>
          {productTypes.map((productType) => (
            <MenuItem key={productType} value={productType}>
              {productType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Price Range */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
        Price Range
      </Typography>
      <Slider
        value={filters.priceRange || [0, 3000]}
        onChange={(_, value) =>
          handleFilterChange({ priceRange: value as [number, number] })
        }
        valueLabelDisplay="auto"
        min={0}
        max={3000}
        step={50}
        sx={{ mb: 3 }}
      />
      {/* Rating Filter */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
        Minimum Rating
      </Typography>
      <Rating
        value={filters.rating || 0}
        onChange={(_, value) =>
          handleFilterChange({ rating: value || undefined })
        }
        sx={{ mb: 3 }}
      />
      {/* Checkboxes */}
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.inStock || false}
            onChange={(e) =>
              handleFilterChange({ inStock: e.target.checked || undefined })
            }
          />
        }
        label="In Stock Only"
        sx={{ mb: 1 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.isNew || false}
            onChange={(e) =>
              handleFilterChange({ isNew: e.target.checked || undefined })
            }
          />
        }
        label="New Products"
        sx={{ mb: 1 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.isTrending || false}
            onChange={(e) =>
              handleFilterChange({ isTrending: e.target.checked || undefined })
            }
          />
        }
        label="Trending Products"
        sx={{ mb: 3 }}
      />
      <Button
        variant="outlined"
        fullWidth
        onClick={clearFilters}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Drawer>
  );

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
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "600", mb: 2 }}>
              Products
            </Typography>

            {/* Search and Controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mb: 3,
              }}
            >
              {/* Search Bar */}
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  maxWidth: { xs: "100%", md: "400px" },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
              </Box>

              {/* Controls */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {/* Filter Button */}
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Filters
                </Button>

                {/* Sort Dropdown */}
                <FormControl sx={{ minWidth: 180 }}>
                  <Select
                    value={`${sort.field}-${sort.order}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{ bgcolor: "white" }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* View Mode Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    onClick={() => setViewMode("grid")}
                    color={viewMode === "grid" ? "primary" : "default"}
                    sx={{
                      bgcolor: viewMode === "grid" ? "primary.light" : "white",
                    }}
                  >
                    <GridViewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode("list")}
                    color={viewMode === "list" ? "primary" : "default"}
                    sx={{
                      bgcolor: viewMode === "list" ? "primary.light" : "white",
                    }}
                  >
                    <ListViewIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Active Filters */}
            <AnimatePresence>
              {Object.keys(filters).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {" "}
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {filters.category && (
                      <Chip
                        label={`Category: ${filters.category}`}
                        onDelete={() =>
                          handleFilterChange({ category: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.productType && (
                      <Chip
                        label={`Product Type: ${filters.productType}`}
                        onDelete={() =>
                          handleFilterChange({ productType: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.priceRange && (
                      <Chip
                        label={`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
                        onDelete={() =>
                          handleFilterChange({ priceRange: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.rating && (
                      <Chip
                        label={`Rating: ${filters.rating}+ stars`}
                        onDelete={() =>
                          handleFilterChange({ rating: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.inStock && (
                      <Chip
                        label="In Stock"
                        onDelete={() =>
                          handleFilterChange({ inStock: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.isNew && (
                      <Chip
                        label="New Products"
                        onDelete={() =>
                          handleFilterChange({ isNew: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {filters.isTrending && (
                      <Chip
                        label="Trending"
                        onDelete={() =>
                          handleFilterChange({ isTrending: undefined })
                        }
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Results Summary */}
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Showing {products.length} of {pagination.total} products
          </Typography>

          {/* Products Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: pagination.limit }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                      <Skeleton variant="text" sx={{ fontSize: "0.875rem" }} />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "0.875rem", width: "60%" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={viewMode === "grid" ? 6 : 12}
                  md={viewMode === "grid" ? 4 : 12}
                  lg={viewMode === "grid" ? 3 : 12}
                  key={product.id}
                >
                  <ProductCard product={product} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <SearchIcon
                  sx={{ fontSize: "4rem", color: "grey.400", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  No Products Found
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 3 }}
                >
                  Try adjusting your search criteria or filters.
                </Typography>
                <Button
                  variant="contained"
                  onClick={clearFilters}
                  sx={{ bgcolor: "maroon", "&:hover": { bgcolor: "#63051c" } }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Container>

        {/* Filter Drawer */}
        <FilterDrawer />

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

export default ProductsPage;
