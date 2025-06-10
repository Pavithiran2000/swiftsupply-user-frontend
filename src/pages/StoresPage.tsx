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
  useTheme,
  useMediaQuery,
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
  Skeleton,
  Badge,
  Fab,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Storefront as StorefrontIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  EmojiEvents as PremiumIcon,
  ShoppingCart as CartIcon,
  EmojiEvents,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Home/HomeHeader";
import type {
  Supplier,
  SupplierFilter,
  SupplierSort,
  SupplierPaginationInfo,
} from "../types/supplier";
import supplierApi from "../api/supplierApi";
import sampleCoverImage from "../assets/png/sample_cover_image.png";
import Api from "../api/api";
import type { category } from "../types/type";

const SuppliersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState<SupplierFilter>({});
  const [sort, setSort] = useState<SupplierSort>({
    field: "rating",
    order: "desc",
  });
  const [pagination, setPagination] = useState<SupplierPaginationInfo>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  // Filter options
  // const countries = [
  //   "China",
  //   "India",
  //   "USA",
  //   "Germany",
  //   "Japan",
  //   "South Korea",
  //   "Turkey",
  //   "Italy",
  // ];
  const businessTypes = [
    "Manufacturer",
    "Trading Company",
    "Supplier",
    "Distributor",
  ];

  // Mock suppliers data
  // const mockSuppliers: Supplier[] = [
  //   {
  //     id: "SUP-001",
  //     name: "Hangzhou Yinjiang Metal Product Co., Ltd.",
  //     description:
  //       "Professional manufacturer of metal storage solutions and organization products",
  //     logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1565793298595-52ebec16ebf7?w=800&h=300&fit=crop",
  //     location: "No. 123 Industrial Road, Hangzhou, Zhejiang",
  //     contact: {
  //       email: "sales@yinjiang.com",
  //       phone: "+86-571-8888-9999",
  //     },
  //     rating: 4.9,
  //     totalReviews: 847,
  //     verified: true,
  //     productTypes: ["Storage Racks", "Metal Organizers", "Display Stands"],
  //     categories: ["Home & Garden", "Storage Solutions"],
  //     businessType: "Manufacturer",
  //     certifications: ["ISO 9001", "CE", "SGS"],

  //     isGoldSupplier: true,
  //     isPremium: true,
  //     totalProducts: 156,
  //     totalOrders: 2840,
  //     successRate: 98.5,
  //     createdAt: "2008-03-15",
  //     lastActive: "2024-12-08",
  //   },
  //   {
  //     id: "SUP-002",
  //     name: "Shenzhen Skystar Packaging Co., Ltd.",
  //     description:
  //       "Leading packaging solutions provider specializing in custom packaging designs",
  //     logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=300&fit=crop",
  //     location: "Building A, Tech Park, Shenzhen, Guangdong",
  //     contact: {
  //       email: "info@skystar.com",
  //       phone: "+86-755-2888-6666",
  //     },
  //     rating: 4.7,
  //     totalReviews: 523,
  //     verified: true,
  //     productTypes: ["Custom Boxes", "Packaging Design", "Gift Packaging"],
  //     categories: ["Packaging & Printing"],
  //     businessType: "Manufacturer",
  //     certifications: ["ISO 14001", "FSC"],
  //     isGoldSupplier: false,
  //     isPremium: false,
  //     totalProducts: 89,
  //     totalOrders: 1560,
  //     successRate: 96.8,
  //     createdAt: "2012-07-20",
  //     lastActive: "2024-12-07",
  //   },
  //   {
  //     id: "SUP-003",
  //     name: "Mumbai Electronics Hub Pvt. Ltd.",
  //     description:
  //       "Comprehensive electronics supplier with focus on consumer and industrial electronics",
  //     logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=800&h=300&fit=crop",
  //     location: "Electronics District, Mumbai, Maharashtra",
  //     contact: {
  //       email: "sales@mumbaielectronics.in",
  //       phone: "+91-22-4455-6677",
  //     },
  //     rating: 4.6,
  //     totalReviews: 692,
  //     verified: true,
  //     productTypes: ["Smartphones", "Laptops", "Components"],
  //     categories: ["Electronics", "Consumer Electronics"],
  //     businessType: "Trading Company",
  //     certifications: ["ISO 9001", "BIS"],
  //     isGoldSupplier: true,
  //     isPremium: false,
  //     totalProducts: 245,
  //     totalOrders: 3200,
  //     successRate: 97.2,
  //     createdAt: "2005-11-10",
  //     lastActive: "2024-12-08",
  //   },
  //   {
  //     id: "SUP-004",
  //     name: "German Precision Machinery GmbH",
  //     description:
  //       "High-quality industrial machinery and precision equipment manufacturer",
  //     logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=center",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=300&fit=crop",
  //     location: "Industrial Zone 5, Munich, Bavaria",
  //     contact: {
  //       email: "export@germanprecision.de",
  //       phone: "+49-89-1234-5678",
  //     },
  //     rating: 4.8,
  //     totalReviews: 234,
  //     verified: true,
  //     productTypes: ["CNC Machines", "Precision Tools", "Industrial Equipment"],
  //     categories: ["Machinery", "Industrial Equipment"],
  //     businessType: "Manufacturer",
  //     certifications: ["ISO 9001", "CE", "TUV"],
  //     isGoldSupplier: true,
  //     isPremium: true,
  //     totalProducts: 78,
  //     totalOrders: 890,
  //     successRate: 99.1,
  //     createdAt: "1985-06-01",
  //     lastActive: "2024-12-06",
  //   },
  // ];

  // Sorting options
  const sortOptions = [
    {
      value: "rating-desc",
      label: "Highest Rated",
      field: "rating" as const,
      order: "desc" as const,
    },
    {
      value: "rating-asc",
      label: "Lowest Rated",
      field: "rating" as const,
      order: "asc" as const,
    },
    {
      value: "totalReviews-desc",
      label: "Most Reviews",
      field: "totalReviews" as const,
      order: "desc" as const,
    },
    {
      value: "name-asc",
      label: "Name A-Z",
      field: "name" as const,
      order: "asc" as const,
    },
    {
      value: "name-desc",
      label: "Name Z-A",
      field: "name" as const,
      order: "desc" as const,
    },
    {
      value: "lastActive-desc",
      label: "Recently Active",
      field: "lastActive" as const,
      order: "desc" as const,
    },
    {
      value: "lastActive-asc",
      label: "Least Recently Active",
      field: "lastActive" as const,
      order: "asc" as const,
    },
    {
      value: "totalProducts-desc",
      label: "Most Products",
      field: "totalProducts" as const,
      order: "desc" as const,
    },
    {
      value: "successRate-desc",
      label: "Highest Success Rate",
      field: "successRate" as const,
      order: "desc" as const,
    },
  ];

  // Effects
  useEffect(() => {
    loadSuppliers();
  }, [searchQuery, filters, sort, pagination.page]);

  useEffect(() => {
    loadAllCategories();
  }, []);

  const loadAllCategories = async () => {
    try {
      const categories = await Api.getAllCategories();
      // categories is an array of objects, so map to names
      setCategories(categories.map((cat: category) => cat.name));

    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (pagination.page > 1) params.set("page", pagination.page.toString());
    setSearchParams(params);
  }, [searchQuery, pagination.page, setSearchParams]);

  //    useEffect(() => {
  //   const fetchSuppliers = async () => {
  //     setSupllierLoading(true);
  //     setError("");
  //     try {
  //       const { suppliers, total, pages } = await getAllSuppliers({ page });
  //       setSuppliers(suppliers);
  //       setTotal(total);
  //       setPages(pages);
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch suppliers");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSuppliers();
  // }, [page]); // Re-fetch if page changes  // Handlers
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      // Convert filters to API format
      const apiParams: any = {
        page: pagination.page,
        per_page: pagination.limit,
      };

      // Only add parameters if they have values
      if (searchQuery) apiParams.search = searchQuery;
      if (filters.businessType) apiParams.businessType = filters.businessType;
      if (filters.verified !== undefined) apiParams.verified = filters.verified;
      if (filters.isGoldSupplier !== undefined) apiParams.isGoldSupplier = filters.isGoldSupplier;
      if (filters.isPremium !== undefined) apiParams.isPremium = filters.isPremium;
      if (filters.ratingMin) apiParams.ratingMin = filters.ratingMin;
      if (filters.categories?.length) apiParams.categories = filters.categories.join(',');
      if (sort.field) apiParams.sortField = sort.field;
      if (sort.order) apiParams.sortOrder = sort.order;

      const { suppliers, total, pages } = await supplierApi.getAllSuppliers(apiParams);
      console.log(suppliers);
      console.log(total);
      console.log(pages);

      setSuppliers(suppliers);
      setPagination((prev) => ({
        ...prev,
        total: total,
        totalPages: pages,
      }));
    } catch (error) {
      console.error("Error loading suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SupplierFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortValue: string) => {
    const option = sortOptions.find((opt) => opt.value === sortValue);
    if (option) {
      setSort({ field: option.field, order: option.order });
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  // Render loading skeletons
  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from({ length: pagination.limit }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: 400 }}>
            <Skeleton variant="rectangular" height={160} />
            <CardContent>
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  console.log(sampleCoverImage);

  // Render supplier card
  // const renderSupplierCard = (supplier: Supplier) => (
  //   <motion.div
  //     key={supplier.id}
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     exit={{ opacity: 0, y: -20 }}
  //     transition={{ duration: 0.3 }}
  //     whileHover={{ y: -4 }}
  //   >
  //     <Card
  //       sx={{
  //         height: "100%",
  //         cursor: "pointer",
  //         position: "relative",
  //         overflow: "visible",
  //         transition: "all 0.3s ease-in-out",
  //         "&:hover": {
  //           boxShadow: theme.shadows[8],
  //         },
  //       }}
  //       onClick={() => navigate(`/suppliers/${supplier.id}`)}
  //     >
  //       {/* Badges */}
  //       <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
  //         {supplier.isGoldSupplier && (
  //           <Chip
  //             label="GOLD"
  //             color="warning"
  //             size="small"
  //             icon={<EmojiEvents />}
  //             sx={{ mr: 0.5, mb: 0.5, fontWeight: "600" }}
  //           />
  //         )}
  //         {supplier.isPremium && (
  //           <Chip
  //             label="PREMIUM"
  //             sx={{
  //               mr: 0.5,
  //               mb: 0.5,
  //               bgcolor: "purple",
  //               color: "white",
  //               fontWeight: "600",
  //               "& .MuiChip-icon": { color: "white" },
  //             }}
  //             size="small"
  //             icon={<PremiumIcon />}
  //           />
  //         )}
  //         {supplier.verified && (
  //           <Chip
  //             label="VERIFIED"
  //             color="success"
  //             size="small"
  //             icon={<VerifiedIcon />}
  //             sx={{ mr: 0.5, mb: 0.5, fontWeight: "600" }}
  //           />
  //         )}
  //       </Box>

  //       {/* Cover Image */}
  //         <CardMedia
  //           component="img"
  //           height={viewMode === "grid" ? 160 : 120}
  //           image={supplier.coverImage || sampleCoverImage}
  //           alt={supplier.name}
  //           sx={{ objectFit: "cover" }}
  //         />

  //       <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column",  height:(viewMode === "grid") ? 230 : 120 }}>
  //         {/* Supplier Header */}
  //         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
  //           <Avatar
  //             src={supplier.logo}
  //             alt={supplier.name}
  //             sx={{ width: 40, height: 40 }}
  //           />
  //           <Box sx={{ flexGrow: 1, minWidth: 0 }}>
  //             <Typography
  //               variant="h6"
  //               sx={{
  //                 fontWeight: "600",
  //                 fontSize: "1rem",
  //                 overflow: "hidden",
  //                 textOverflow: "ellipsis",
  //                 whiteSpace: "nowrap",
  //               }}
  //             >
  //               {supplier.name}
  //             </Typography>
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
  //               <LocationIcon
  //                 sx={{ fontSize: "0.875rem", color: "text.secondary" }}
  //               />
  //               <Typography variant="body2" color="text.secondary">
  //                 {supplier.location}
  //               </Typography>
  //             </Box>
  //           </Box>
  //         </Box>

  //         {/* Rating */}
  //         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
  //           <Rating
  //             value={supplier.rating}
  //             precision={0.1}
  //             size="small"
  //             readOnly
  //           />
  //           <Typography variant="body2" color="text.secondary">
  //             {supplier.rating} ({supplier.totalReviews} reviews)
  //           </Typography>
  //         </Box>

  //         {/* Description */}
  //         <Typography
  //           variant="body2"
  //           color="text.secondary"
  //           sx={{
  //             mb: 1,
  //             overflow: "hidden",
  //             textOverflow: "ellipsis",
  //             display: "-webkit-box",
  //             WebkitLineClamp: 2,
  //             WebkitBoxOrient: "vertical",
  //           }}
  //         >
  //           {supplier.description}
  //         </Typography>

  //         {/* Stats */}
  //         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
  //           <Box sx={{ textAlign: "center" }}>
  //             <Typography variant="body2" sx={{ fontWeight: "600" }}>
  //               {supplier.totalProducts}
  //             </Typography>
  //             <Typography variant="caption" color="text.secondary">
  //               Products
  //             </Typography>
  //           </Box>
  //           <Box sx={{ textAlign: "center" }}>
  //             <Typography variant="body2" sx={{ fontWeight: "600" }}>
  //               {supplier.successRate}%
  //             </Typography>
  //             <Typography variant="caption" color="text.secondary">
  //               Success Rate
  //             </Typography>
  //           </Box>
  //         </Box>

  //         {/* Main Products */}
  //         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
  //           {supplier.productTypes.slice(0, 3).map((product, index) => (
  //             <Chip
  //               key={index}
  //               label={product}
  //               size="small"
  //               variant="outlined"
  //               sx={{ fontSize: "0.7rem"}}
  //             />
  //           ))}
  //           {supplier.productTypes.length > 3 && (<>...</>)}
  //           {/* {supplier.productTypes.length > 3 && (
  //             <Chip
  //               label={`+${supplier.productTypes.length - 3}`}
  //               size="small"
  //               variant="outlined"
  //               sx={{ fontSize: "0.7rem" }}
  //             />
  //           )} */}
  //         </Box>
  //       </CardContent>
  //     </Card>
  //   </motion.div>
  // );
  // Replace your renderSupplierCard function with this responsive version:

  const renderSupplierCard = (supplier: Supplier) => (
    <motion.div
      key={supplier.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          height: {
            xs: 420, // Mobile heights
            sm: 380, // Tablet heights
            md: 400, // Desktop heights
            lg: 380, // Large desktop heights
          },
          cursor: "pointer",
          position: "relative",
          overflow: "visible",
          transition: "all 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            boxShadow: theme.shadows[8],
          },
        }}
        onClick={() => navigate(`/suppliers/${supplier.id}`)}
      >
        {/* Badges */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          {supplier.isGoldSupplier && (
            <Chip
              label="GOLD"
              color="warning"
              size="small"
              icon={<EmojiEvents />}
              sx={{
                mr: 0.5,
                mb: 0.5,
                fontWeight: "600",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
              }}
            />
          )}
          {supplier.isPremium && (
            <Chip
              label="PREMIUM"
              sx={{
                mr: 0.5,
                mb: 0.5,
                bgcolor: "purple",
                color: "white",
                fontWeight: "600",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                "& .MuiChip-icon": { color: "white" },
              }}
              size="small"
              icon={<PremiumIcon />}
            />
          )}
          {supplier.verified && (
            <Chip
              label="VERIFIED"
              color="success"
              size="small"
              icon={<VerifiedIcon />}
              sx={{
                mr: 0.5,
                mb: 0.5,
                fontWeight: "600",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
              }}
            />
          )}
        </Box>

        {/* Cover Image */}
        <CardMedia
          component="img"
          image={supplier.coverImage || sampleCoverImage}
          alt={supplier.name}
          sx={{
            height: { xs: 140, sm: 160, md: 180 }, // Grid mode image heights
            objectFit: "cover",
            flexShrink: 0,
            width: "100%",
          }}
        />

        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: {
              xs: 280, // Mobile content height (grid)
              sm: 290, // Tablet content height (grid)
              md: 290, // Desktop content height (grid)
            },
          }}
        >
          {/* Supplier Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar
              src={supplier.logo}
              alt={supplier.name}
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {supplier.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationIcon
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.825rem", md: "0.875rem" },
                    color: "text.secondary",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                  }}
                >
                  {supplier.location}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating
              value={supplier.rating}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}
            >
              {supplier.rating} ({supplier.totalReviews} reviews)
            </Typography>
          </Box>{" "}
          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: "2.4em",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
            }}
          >
            {supplier.description}
          </Typography>
          {/* Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              gap: 1,
            }}
          >
            <Box sx={{ textAlign: "center", minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.875rem" },
                }}
              >
                {supplier.totalProducts}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
              >
                Products
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.875rem" },
                }}
              >
                {supplier.successRate}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
              >
                Success Rate
              </Typography>
            </Box>
          </Box>
          {/* Main Products */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: "auto",
              alignItems: "flex-start",
            }}
          >
            {supplier.productTypes.slice(0, 3).map((product, index) => (
              <Chip
                key={index}
                label={product}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                  height: { xs: "20px", sm: "24px" },
                }}
              />
            ))}
            {supplier.productTypes.length > 3 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
              >
                +{supplier.productTypes.length - 3}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
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
          {/* Page Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
              <StorefrontIcon sx={{ color: "maroon", fontSize: "2rem" }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: "600", color: "text.primary" }}
              >
                Suppliers
              </Typography>
            </Box>

            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                maxWidth: { xs: "100%", md: "500px" },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search suppliers, products, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "maroon",
                  "&:hover": { bgcolor: "#63051c" },
                  px: 3,
                }}
              >
                Search
              </Button>
            </Box>

            {/* Controls Bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* Mobile Filter Button */}
                {isMobile && (
                  <Button
                    startIcon={<FilterIcon />}
                    onClick={() => setFilterDrawerOpen(true)}
                    variant="outlined"
                  >
                    Filters
                  </Button>
                )}

                {/* Results Count */}
                <Typography variant="body2" color="text.secondary">
                  {loading
                    ? "Loading..."
                    : `${pagination.total} suppliers found`}
                </Typography>

                {/* Clear Filters */}
                {(Object.keys(filters).length > 0 || searchQuery) && (
                  <Button
                    onClick={clearFilters}
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={`${sort.field}-${sort.order}`}
                    label="Sort by"
                    onChange={(e) => handleSortChange(e.target.value)}
                    sx={{ bgcolor: "white" }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>{" "}
                </FormControl>
              </Box>
            </Box>

            {/* Active Filters */}
            <AnimatePresence>
              {Object.keys(filters).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {Object.entries(filters).map(([key, value]) => {
                      if (value === undefined || value === null) return null;

                      let displayValue = value;
                      if (Array.isArray(value)) {
                        displayValue = value.join(", ");
                      } else if (typeof value === "boolean") {
                        displayValue = value ? "Yes" : "No";
                      }

                      return (
                        <Chip
                          key={key}
                          label={`${key}: ${displayValue}`}
                          onDelete={() =>
                            handleFilterChange({ [key]: undefined })
                          }
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Main Content */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Desktop Filters Sidebar */}
            {!isMobile && (
              <Box sx={{ width: 280, flexShrink: 0 }}>
                <Card sx={{ p: 2, position: "sticky", top: 20 }}>
                  <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
                    Filters
                  </Typography>

                  {/* Country Filter */}
                  {/* <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={filters.country || ''}
                      label="Country"
                      onChange={(e) => handleFilterChange({ country: e.target.value || undefined })}
                    >
                      <MenuItem value="">All Countries</MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}

                  {/* Business Type Filter */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      value={filters.businessType || ""}
                      label="Business Type"
                      onChange={(e) =>
                        handleFilterChange({
                          businessType: (e.target.value as any) || undefined,
                        })
                      }
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Rating Filter */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Minimum Rating
                    </Typography>
                    <Slider
                      value={filters.ratingMin || 0}
                      onChange={(_, value) =>
                        handleFilterChange({ ratingMin: value as number })
                      }
                      min={0}
                      max={5}
                      step={0.5}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  {/* Categories Filter */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Categories
                    </Typography>
                    {categories.map((category) => (
                      <FormControlLabel
                        key={category}
                        control={
                          <Checkbox
                            checked={
                              filters.categories?.includes(category) || false
                            }
                            onChange={(e) => {
                              const currentCategories =
                                filters.categories || [];
                              if (e.target.checked) {
                                handleFilterChange({
                                  categories: [...currentCategories, category],
                                });
                              } else {
                                handleFilterChange({
                                  categories: currentCategories.filter(
                                    (c) => c !== category
                                  ),
                                });
                              }
                            }}
                          />
                        }
                        label={category}
                        sx={{ display: "block" }}
                      />
                    ))}
                  </Box>

                  {/* Special Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Special Features
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.verified || false}
                          onChange={(e) =>
                            handleFilterChange({
                              verified: e.target.checked || undefined,
                            })
                          }
                        />
                      }
                      label="Verified Suppliers"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isGoldSupplier || false}
                          onChange={(e) =>
                            handleFilterChange({
                              isGoldSupplier: e.target.checked || undefined,
                            })
                          }
                        />
                      }
                      label="Gold Suppliers"
                      sx={{ display: "block" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isPremium || false}
                          onChange={(e) =>
                            handleFilterChange({
                              isPremium: e.target.checked || undefined,
                            })
                          }
                        />
                      }
                      label="Premium Suppliers"
                      sx={{ display: "block" }}
                    />
                  </Box>
                </Card>
              </Box>
            )}

            {/* Suppliers Grid */}
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                renderSkeletons()
              ) : suppliers.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <StorefrontIcon
                    sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    No suppliers found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Try adjusting your search criteria or filters
                  </Typography>
                </Box>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${searchQuery}-${JSON.stringify(filters)}-${
                      sort.field
                    }-${sort.order}-${pagination.page}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      {suppliers.map((supplier) => (
                        <Grid item xs={12} sm={6} md={4} key={supplier.id}>
                          {renderSupplierCard(supplier)}
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Pagination */}
              {!loading &&
                suppliers.length > 0 &&
                pagination.totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 4,
                      mb: 2,
                    }}
                  >
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
            </Box>
          </Box>
        </Container>

        {/* Mobile Filter Drawer */}
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
          </Box>

          {/* Mobile filters (same as desktop) */}
          {/* <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country || ""}
              label="Country"
              onChange={(e) =>
                handleFilterChange({ country: e.target.value || undefined })
              }
            >
              <MenuItem value="">All Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Business Type</InputLabel>
            <Select
              value={filters.businessType || ""}
              label="Business Type"
              onChange={(e) =>
                handleFilterChange({
                  businessType: (e.target.value as any) || undefined,
                })
              }
            >
              <MenuItem value="">All Types</MenuItem>
              {businessTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Minimum Rating
            </Typography>
            <Slider
              value={filters.ratingMin || 0}
              onChange={(_, value) =>
                handleFilterChange({ ratingMin: value as number })
              }
              min={0}
              max={5}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Special Features
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verified || false}
                  onChange={(e) =>
                    handleFilterChange({
                      verified: e.target.checked || undefined,
                    })
                  }
                />
              }
              label="Verified Suppliers"
              sx={{ display: "block" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isGoldSupplier || false}
                  onChange={(e) =>
                    handleFilterChange({
                      isGoldSupplier: e.target.checked || undefined,
                    })
                  }
                />
              }
              label="Gold Suppliers"
              sx={{ display: "block" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isPremium || false}
                  onChange={(e) =>
                    handleFilterChange({
                      isPremium: e.target.checked || undefined,
                    })
                  }
                />
              }
              label="Premium Suppliers"
              sx={{ display: "block" }}
            />
          </Box>
        </Drawer>

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

export default SuppliersPage;
