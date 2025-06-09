import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
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
  Fab,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Clear as ClearIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  GetApp as GetAppIcon,
  Category,
} from "@mui/icons-material";
import SupplierHeader from "../../components/Supplier/SupplierHeader";
import type { SupplierProduct } from "../../types/supplier";
import supplierApi from "../../api/supplierApi";
import Api from "../../api/api";

// Define Props interface for SupplierInventory
interface Props {
  supplierId: string;
}

// Extended interface for inventory management
interface InventoryProduct extends SupplierProduct {
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  productType: string;
  brand: string;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  minOrderQty: number;
  minStock: number;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
  status?: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated?: String;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  productType: string;
  brand: string;
  specifications: Record<string, string>;
  minOrderQty: number;
  stock: number;
  minStock: number;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
}

interface FilterState {
  category: string;
  status: string;
  priceRange: [number, number];
  stockLevel: string;
  isNew: boolean;
  isTrending: boolean;
}


const SupplierInventory: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [allProducts, setAllProducts] = useState<InventoryProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [csvUploadDialogOpen, setCsvUploadDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  // Filter states
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    status: "",
    priceRange: [10, 100000],
    stockLevel: "",
    isNew: false,
    isTrending: false,
  });
  // Form states
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    images: [],
    category: "",
    productType: "",
    brand: "",
    specifications: {},
    minOrderQty: 1,
    stock: 0,
    minStock: 0,
    isNew: false,
    isTrending: false,
    tags: [],
  });

  // Image upload states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // CSV upload states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");

  const fetchInventory = async () => {
    try {
      const response = await supplierApi.getInventory({
        page: page + 1, // if backend is 1-based, else just use page
        limit: rowsPerPage,
      });

      setAllProducts(response.products);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Simulate API call - in real app, fetch products from backend
    fetchInventory();
  }, [page, rowsPerPage, filters, searchTerm]);

  useEffect(() => {
    // Fetch categories, product types, and brands from API
    const fetchBusinessProfileData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          Api.getAllCategories(),
        ]);
        console.log("Fetched categories:", categoriesData);

        setCategories(categoriesData.map((cat: any) => cat.name));
      } catch (error) {
        console.error("Failed to fetch business profile data:", error);
      }
    };

    fetchBusinessProfileData();
  }, []);

  useEffect(() => {
    const fetchProductTypes = async () => {
      if (selectedCategory) {
        try {
          const productTypesData = await Api.getAllProductTypes(
            selectedCategory
          );
          setProductTypes(productTypesData.map((type: any) => type.name));
        } catch (error) {
          console.error("Failed to fetch product types:", error);
        }
      } else {
        setProductTypes([]);
      }
    };

    fetchProductTypes();
  }, [selectedCategory]);

  useEffect(() => {

    const fetchBrands = async () => {
      if (selectedProductType) {
        try {
          const brandsData = await Api.getAllBrands(selectedProductType);
          setBrands(brandsData.map((brand: any) => brand.name));
        } catch (error) {
          console.error("Failed to fetch brands:", error);
        }
      } else {
        setBrands([]);
      }
    };

    fetchBrands();
  }, [selectedProductType]);

  // Filtering and search logic
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      (product.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (product.category?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (product.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesStockLevel =
      !filters.stockLevel ||
      (filters.stockLevel === "in-stock" && product.stock > product.minStock) ||
      (filters.stockLevel === "low-stock" &&
        product.stock <= product.minStock &&
        product.stock > 0) ||
      (filters.stockLevel === "out-of-stock" && product.stock === 0);
    const matchesNew = !filters.isNew || product.isNew;
    const matchesTrending = !filters.isTrending || product.isTrending;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesPrice &&
      matchesStockLevel &&
      matchesNew &&
      matchesTrending
    );
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: InventoryProduct["status"]) => {
    switch (status) {
      case "in-stock":
        return "success";
      case "low-stock":
        return "warning";
      case "out-of-stock":
        return "error";
      default:
        return "default";
    }
  };
  const getStatusLabel = (status: InventoryProduct["status"]) => {
    switch (status) {
      case "in-stock":
        return "In Stock";
      case "low-stock":
        return "Low Stock";
      case "out-of-stock":
        return "Out of Stock";
      default:
        return status;
    }
  };
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("Rows per page changed to:", event.target.value);

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Dialog handlers
  const handleAddProduct = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      images: [],
      category: "",
      productType: "",
      brand: "",
      specifications: {},
      minOrderQty: 1,
      stock: 0,
      minStock: 0,
      isNew: false,
      isTrending: false,
      tags: [],
    });
    // Clear image states
    clearAllImages();
    setAddDialogOpen(true);
  };
  const handleEditProduct = (product: InventoryProduct) => {
    setSelectedProduct(product);
    console.log("Editing product:", product.images);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      images: product.images,
      category: product.category,
      productType: product.productType,
      brand: product.brand,
      specifications: product.specifications,
      minOrderQty: product.minOrderQty,
      stock: product.stock,
      minStock: product.minStock,
      isNew: product.isNew,
      isTrending: product.isTrending,
      tags: product.tags,
    });

    if (product.images && product.images.length > 0) {
      setImagePreview([...product.images]);
    }
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const saveProduct = async () => {
    try {
      if (selectedProduct) {
        const updatedProduct = await supplierApi.updateProduct(
          selectedProduct.id,
          formData
        );
        console.log("Updated product:", updatedProduct);
        // setAllProducts((prev) =>
        //   prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        // );
        setAllProducts((prev) => {
          const index = prev.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            const updatedProducts = [...prev];
            updatedProducts[index] = updatedProduct;
            return updatedProducts;
          }
          return [...prev, updatedProduct];
        });
        fetchInventory(); // Refresh inventory to get latest data

        setSnackbar({
          open: true,
          message: "Product updated!",
          severity: "success",
        });
      } else {
        const newProduct = await supplierApi.createProduct(formData);
        setAllProducts((prev) => [...prev, newProduct]);
        setSnackbar({
          open: true,
          message: "Product added!",
          severity: "success",
        });
        fetchInventory(); // Refresh inventory to get latest data
      }
      clearAllImages();
      setAddDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save product.",
        severity: "error",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      const updatedProducts = products.filter(
        (p) => p.id !== selectedProduct.id
      );
      setProducts(updatedProducts);
      setSnackbar({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };
  const resetFilters = () => {
    setFilters({
      category: "",
      status: "",
      priceRange: [0, 1000],
      stockLevel: "",
      isNew: false,
      isTrending: false,
    });
  };

  // CSV handling functions
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setCsvError("");
      parseCsvFile(file);
    } else {
      setCsvError("Please select a valid CSV file");
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      // Check if required headers are present
      const requiredHeaders = [
        "name",
        "description",
        "price",
        "category",
        "stock",
      ];
      const missingHeaders = requiredHeaders.filter(
        (h) => !headers.includes(h)
      );

      if (missingHeaders.length > 0) {
        setCsvError(`Missing required columns: ${missingHeaders.join(", ")}`);
        return;
      }

      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length === headers.length && values[0]) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          data.push(row);
        }
      }

      setCsvPreview(data);
    };
    reader.readAsText(file);
  };

  const processCsvData = () => {
    if (csvPreview.length === 0) return;

    const newProducts: InventoryProduct[] = csvPreview.map((row, index) => {
      const currentTime = new Date();
      const stock = parseInt(row.stock) || 0;
      const minStock = parseInt(row.minStock) || 0;

      return {
        id: `csv_${Date.now()}_${index}`,
        name: row.name,
        description: row.description || "",
        sku: `CSV-${Date.now()}-${index}`,
        category: row.category,
        productType: row.productType || "General",
        brand: row.brand || "Unknown",
        stock: stock,
        minStock: minStock,
        price: parseFloat(row.price) || 0,
        originalPrice: parseFloat(row.originalPrice) || undefined,
        images: row.images
          ? row.images.split(";")
          : ["/api/placeholder/300/300"],
        specifications: row.specifications
          ? JSON.parse(row.specifications)
          : {},
        rating: 0,
        reviewCount: 0,
        minOrderQty: parseInt(row.minOrderQty) || 1,
        inStock: stock > 0,
        isNew: row.isNew === "true",
        isTrending: row.isTrending === "true",
        tags: row.tags ? row.tags.split(";") : [],
        views: 0,
        inquiries: 0,
        orders: 0,
        revenue: 0,
        status:
          stock > minStock
            ? ("in-stock" as const)
            : stock > 0
            ? ("low-stock" as const)
            : ("out-of-stock" as const),
        lastUpdated: currentTime.toISOString().split("T")[0],
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
    });

    setProducts([...products, ...newProducts]);
    setSnackbar({
      open: true,
      message: `Successfully imported ${newProducts.length} products from CSV!`,
      severity: "success",
    });
    setCsvUploadDialogOpen(false);
    setCsvFile(null);
    setCsvPreview([]);
  };
  const downloadCsvTemplate = () => {
    const headers = [
      "name",
      "description",
      "price",
      "originalPrice",
      "category",
      "productType",
      "brand",
      "stock",
      "minStock",
      "minOrderQty",
      "isNew",
      "isTrending",
      "tags",
      "images",
      "specifications",
    ];

    const sampleData = [
      "Sample Product",
      "This is a sample product description",
      "99.99",
      "120.00",
      "Electronics",
      "Components",
      "SampleBrand",
      "100",
      "20",
      "5",
      "true",
      "false",
      "electronic;component;sample",
      "/api/placeholder/300/300;/api/placeholder/300/301",
      '{"Material":"Plastic","Color":"Blue"}',
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uploadSingleImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    // Assuming your supplierApi.uploadImage sends POST /upload-image with formData
    const response = await supplierApi.uploadImage(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.url; // backend returns { url: "http://localhost:5000/images/uuid.png" }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 5 - formData.images.length;

    if (files.length > remainingSlots) {
      setSnackbar({
        open: true,
        message: `You can only upload ${remainingSlots} more image(s). Maximum 5 images allowed.`,
        severity: "warning",
      });
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setSnackbar({
        open: true,
        message: `Some files were rejected: ${invalidFiles.join(
          ", "
        )}. Only JPG, PNG, WEBP files under 5MB are allowed.`,
        severity: "warning",
      });
    }

    if (validFiles.length === 0) return;

    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      try {
        const url = await uploadSingleImage(file);
        uploadedUrls.push(url);
      } catch (err) {
        setSnackbar({
          open: true,
          message: `Failed to upload ${file.name}`,
          severity: "error",
        });
      }
    }

    // Update formData images and previews with real URLs from backend
    console.log(formData.images, " formData.images");

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setImagePreview((prev) => [...prev, ...uploadedUrls]);

    setSnackbar({
      open: true,
      message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
      severity: "success",
    });

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL to free memory
    if (imagePreview[index]) {
      URL.revokeObjectURL(imagePreview[index]);
    }

    // Remove from all image-related states
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const clearAllImages = () => {
    // Revoke all preview URLs
    imagePreview.forEach((url) => URL.revokeObjectURL(url));

    // Clear all image states
    setImageFiles([]);
    setImagePreview([]);
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: { xs: 1, md: 4 },
        paddingTop: { md: "10px" },
      }}
    >
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
              <InventoryIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  pt: 2,
                }}
              >
                Inventory Management
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Manage your product inventory, track stock levels, and update
              product information
            </Typography>
          </Box>
          {/* Search and Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              alignItems="center"
            >
              <TextField
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: isMobile ? "100%" : 300 }}
              />{" "}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterDialogOpen(true)}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setCsvUploadDialogOpen(true)}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Import CSV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddProduct}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Add Product
                </Button>
              </Stack>
            </Stack>
          </Paper>{" "}
          {/* Inventory Table */}
          <Paper sx={{ overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Views</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Inquiries</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ "&:hover": { backgroundColor: "grey.50" } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.stock} units
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Min: {product.minStock}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          LKR {product.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <VisibilityIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="body2">
                            {product.views}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TrendingUpIcon
                            sx={{ fontSize: 16, color: "warning.main" }}
                          />
                          <Typography variant="body2">
                            {product.inquiries}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ShoppingCartIcon
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                          <Typography variant="body2">
                            {product.orders}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(product.status)}
                          color={getStatusColor(product.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>{" "}
          {/* Floating Action Button for Mobile */}
          {isMobile && (
            <Fab
              color="primary"
              onClick={handleAddProduct}
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
              }}
            >
              <AddIcon />
            </Fab>
          )}{" "}
          {/* Add/Edit Product Dialog */}
          <Dialog
            open={addDialogOpen || editDialogOpen}
            onClose={() => {
              clearAllImages();
              setAddDialogOpen(false);
              setEditDialogOpen(false);
              setSelectedProduct(null);
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </Typography>
                <IconButton
                  onClick={() => {
                    setAddDialogOpen(false);
                    setEditDialogOpen(false);
                    setSelectedProduct(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        setSelectedCategory(e.target.value);
                      }}
                    >
                      {categories.map((cat: any) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Product Type</InputLabel>
                    <Select
                      value={formData.productType}
                      label="Product Type"
                      disabled={!selectedCategory} // Disable if no category selected
                      onChange={(e) =>{
                        setFormData({
                          ...formData,
                          productType: e.target.value,
                        });
                        setSelectedProductType(e.target.value);
                      }}
                    >
                      {productTypes.map((type: any) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Brand</InputLabel>
                    <Select
                      value={formData.brand}
                      label="Brand"
                      disabled={!selectedProductType} // Disable if no product type selected
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    >
                      {brands.map((brand: any) => (
                        <MenuItem key={brand} value={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                {/* Pricing & Inventory */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Pricing & Inventory
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Price (LKR)"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Original Price (LKR)"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Minimum Stock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minStock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Order Quantity"
                    type="number"
                    value={formData.minOrderQty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderQty: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                  />
                </Grid>
                {/* Product Attributes */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Product Attributes
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isNew}
                        onChange={(e) =>
                          setFormData({ ...formData, isNew: e.target.checked })
                        }
                      />
                    }
                    label="New Product"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isTrending}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isTrending: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Trending Product"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags (comma separated)"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag),
                      })
                    }
                    placeholder="e.g., industrial, steel, construction"
                  />
                </Grid>{" "}
                {/* Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Product Images
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <input
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        style={{ display: "none" }}
                        id="image-upload-input"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload-input">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCameraIcon />}
                          disabled={imageFiles.length >= 5}
                        >
                          Upload Images
                        </Button>
                      </label>
                      {imageFiles.length > 0 && (
                        <Button
                          variant="text"
                          color="error"
                          startIcon={<ClearIcon />}
                          onClick={clearAllImages}
                          size="small"
                        >
                          Clear All
                        </Button>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Upload JPG, PNG, or WEBP files (max 5MB each, up to 5
                      images). Current images: {formData.images.length}
                    </Typography>

                    {/* Upload Guidelines */}
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Image Guidelines:</strong>
                        <br />• High-quality images show your products better
                        <br />• Use well-lit photos with clear backgrounds
                        <br />• Include multiple angles for better customer
                        understanding
                        <br />• First image will be used as the main product
                        image
                      </Typography>
                    </Alert>

                    {/* Image Preview */}
                    {imagePreview.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Image Preview ({imagePreview.length}/5):
                        </Typography>
                        <Grid container spacing={2}>
                          {imagePreview.map((preview, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                              <Box
                                sx={{
                                  position: "relative",
                                  border: "1px solid",
                                  borderColor:
                                    index === 0 ? "primary.main" : "divider",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  aspectRatio: "1",
                                  backgroundColor: "grey.50",
                                }}
                              >
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                {index === 0 && (
                                  <Chip
                                    label="Main"
                                    size="small"
                                    color="primary"
                                    sx={{
                                      position: "absolute",
                                      top: 4,
                                      left: 4,
                                    }}
                                  />
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => removeImage(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(255, 255, 255, 0.8)",
                                    color: "error.main",
                                    "&:hover": {
                                      bgcolor: "rgba(255, 255, 255, 0.9)",
                                    },
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Stack>
                </Grid>
                {/* Specifications */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Specifications
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Add key specifications for your product. You can add
                    multiple specifications.
                  </Typography>
                  {Object.entries(formData.specifications).map(
                    ([key, value], index) => (
                      <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Specification Name"
                            value={key}
                            onChange={(e) => {
                              const newSpecs = { ...formData.specifications };
                              delete newSpecs[key];
                              newSpecs[e.target.value] = value;
                              setFormData({
                                ...formData,
                                specifications: newSpecs,
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Value"
                            value={value}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                specifications: {
                                  ...formData.specifications,
                                  [key]: e.target.value,
                                },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => {
                              const newSpecs = { ...formData.specifications };
                              delete newSpecs[key];
                              setFormData({
                                ...formData,
                                specifications: newSpecs,
                              });
                            }}
                            color="error"
                          >
                            <ClearIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, "": "" },
                      });
                    }}
                  >
                    Add Specification
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>{" "}
            <DialogActions>
              <Button
                onClick={() => {
                  clearAllImages();
                  setAddDialogOpen(false);
                  setEditDialogOpen(false);
                  setSelectedProduct(null);
                }}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={saveProduct}
                startIcon={<SaveIcon />}
              >
                {selectedProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete "{selectedProduct?.name}"? This
                action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* Filter Dialog */}
          <Dialog
            open={filterDialogOpen}
            onClose={() => setFilterDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Filter Products</Typography>
                <IconButton onClick={() => setFilterDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      label="Category"
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="in-stock">In Stock</MenuItem>
                      <MenuItem value="low-stock">Low Stock</MenuItem>
                      <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Stock Level</InputLabel>
                    <Select
                      value={filters.stockLevel}
                      label="Stock Level"
                      onChange={(e) =>
                        setFilters({ ...filters, stockLevel: e.target.value })
                      }
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      <MenuItem value="in-stock">Above Minimum</MenuItem>
                      <MenuItem value="low-stock">Below Minimum</MenuItem>
                      <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      type="number"
                      label="Min Price"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [
                            parseFloat(e.target.value) || 0,
                            filters.priceRange[1],
                          ],
                        })
                      }
                      sx={{ width: 120 }}
                    />
                    <Typography>to</Typography>
                    <TextField
                      type="number"
                      label="Max Price"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [
                            filters.priceRange[0],
                            parseFloat(e.target.value) || 1000,
                          ],
                        })
                      }
                      sx={{ width: 120 }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isNew}
                          onChange={(e) =>
                            setFilters({ ...filters, isNew: e.target.checked })
                          }
                        />
                      }
                      label="New Products Only"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isTrending}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              isTrending: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Trending Products Only"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetFilters}>Reset</Button>
              <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => setFilterDialogOpen(false)}
              >
                Apply Filters
              </Button>
            </DialogActions>{" "}
          </Dialog>
          {/* CSV Upload Dialog */}
          <Dialog
            open={csvUploadDialogOpen}
            onClose={() => setCsvUploadDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Import Products from CSV</Typography>
                <IconButton onClick={() => setCsvUploadDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Download the CSV template to see the required format.
                    Required columns: name, description, price, category, stock
                  </Typography>
                </Alert>

                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={downloadCsvTemplate}
                  sx={{ mb: 3 }}
                >
                  Download CSV Template
                </Button>

                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <input
                    accept=".csv"
                    style={{ display: "none" }}
                    id="csv-file-input"
                    type="file"
                    onChange={handleCsvUpload}
                  />
                  <label htmlFor="csv-file-input">
                    <IconButton
                      color="primary"
                      aria-label="upload csv"
                      component="span"
                      size="large"
                    >
                      <CloudUploadIcon sx={{ fontSize: 48 }} />
                    </IconButton>
                  </label>
                  <Typography variant="h6" gutterBottom>
                    Upload CSV File
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to select a CSV file or drag and drop
                  </Typography>
                </Box>

                {csvFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Selected file: {csvFile.name}
                    </Typography>
                  </Box>
                )}

                {csvError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {csvError}
                  </Alert>
                )}

                {csvPreview.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Preview ({csvPreview.length} products)
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvPreview.slice(0, 5).map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.category}</TableCell>
                              <TableCell>LKR{row.price}</TableCell>
                              <TableCell>{row.stock}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {csvPreview.length > 5 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Showing first 5 of {csvPreview.length} products
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setCsvUploadDialogOpen(false);
                  setCsvFile(null);
                  setCsvPreview([]);
                  setCsvError("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={processCsvData}
                disabled={csvPreview.length === 0}
                startIcon={<UploadIcon />}
              >
                Import {csvPreview.length} Products
              </Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SupplierInventory;
