import axiosInstance from "./axiosInstance";
import { type DashboardStats, type Supplier } from "../types/supplier";

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductEngagementData {
  product_name: string;
  views: number;
  inquiries: number;
  conversion_rate: number;
}

export interface SupplierApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  productType: string;
  brand: string;
  stock: number;
  minStock: number;
  price: number;
  originalPrice?: number;
  images: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  minOrderQty: number;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
  views: number;
  inquiries: number;
  orders: number;
  revenue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryResponse {
  total(total: any): unknown;
  products: InventoryProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InventorySummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface InventoryAlert {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  alertLevel: "critical" | "warning" | "low";
  lastUpdated: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  change: number;
  reason: string;
  timestamp: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  businessRegistration: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  description: string;
  certifications: string[];
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  joinedDate: string;
  businessType: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isGoldSupplier: boolean;
  isPremium: boolean;
  productTypes: string[];
  categories: string[];
}

export interface VerificationStatus {
  supplierId: string;
  isVerified: boolean;
  isGoldSupplier: boolean;
  isPremium: boolean;
  verificationDate?: string;
  certifications: string[];
  verificationLevel: "basic" | "verified" | "gold" | "premium";
}

export interface StockUpdate {
  productId: string;
  stock: number;
  reason?: string;
}

export const supplierApi = {
  // Get supplier dashboard stats
  getDashboardStats: async (supplierId: number): Promise<DashboardStats> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/dashboard`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },

  // Get supplier details
  getSupplierDetails: async (supplierId: number): Promise<Supplier> => {
    try {
      const response = await axiosInstance.get(`/suppliers/${supplierId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch supplier details:", error);
      throw error;
    }
  },

  // Get sales data for charts
  getSalesData: async (
    supplierId: number,
    period: string = "30d"
  ): Promise<SalesDataPoint[]> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/sales-data`,
        {
          params: { period },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
      throw error;
    }
  },

  // Get product engagement data
  getProductEngagement: async (
    supplierId: number
  ): Promise<ProductEngagementData[]> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/product-engagement`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product engagement data:", error);
      throw error;
    }
  },

  // Get all suppliers (for admin/listing purposes)
  // getAllSuppliers: async (params?: {
  //   page?: number;
  //   per_page?: number;
  //   search?: string;
  //   category?: string;
  //   location?: string;
  //   rating_min?: number;
  //   sort_by?: string;
  // }): Promise<{ suppliers: Supplier[]; total: number; pages: number }> => {
  //   try {
  //     const response = await axiosInstance.get('/suppliers/', { params });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch suppliers:', error);
  //     throw error;
  //   }
  // },
  // Get suppliers by pagination
  getAllSuppliers: async (params?: { page?: number; per_page?: number }) => {
    try {
      const response = await axiosInstance.get("/suppliers/", { params });
      return response.data;
    } catch (error: any) {
      // If backend provided a JSON error message
      if (error.response && error.response.data && error.response.data.error) {
        // The backend sent: { "error": "Some message" }
        throw new Error(error.response.data.error);
      }
      // If generic network or unknown error
      throw new Error("Failed to fetch suppliers. Please try again.");
    }
  },

  // Inventory Management
  getInventory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<InventoryResponse> => {
    try {
      const response = await axiosInstance.get(`/suppliers/inventory`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      throw error;
    }
  },

  createProduct: async (productData: any): Promise<InventoryProduct> => {
    try {
      const response = await axiosInstance.post(
        `/suppliers/product`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  },

  updateProduct: async (
    productId: string,
    productData: any
  ): Promise<InventoryProduct> => {
    try {
      const response = await axiosInstance.put(
        `/suppliers/products/${productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  },

  deleteProduct: async (productId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(
        `/suppliers/products/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },

  uploadImage: async (
    formData: FormData,
    config?: object
  ): Promise<{ url: string }> => {
    try {
      const response = await axiosInstance.post(
        `/suppliers/upload-image`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      // You can customize error handling/logging here
      console.error("Image upload failed:", error);
      throw new Error(error?.response?.data?.error || "Failed to upload image");
    }
  },

  getInventorySummary: async (
    supplierId: number
  ): Promise<InventorySummary> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/inventory/summary`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inventory summary:", error);
      throw error;
    }
  },

  getInventoryAlerts: async (
    supplierId: number,
    threshold?: number
  ): Promise<InventoryAlert[]> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/inventory/alerts`,
        {
          params: { threshold },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inventory alerts:", error);
      throw error;
    }
  },

  getInventoryLogs: async (
    supplierId: number,
    params?: { limit?: number; productId?: number }
  ): Promise<InventoryLog[]> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/inventory/logs`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inventory logs:", error);
      throw error;
    }
  },

  updateStock: async (
    supplierId: number,
    updates: StockUpdate[]
  ): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        `/suppliers/${supplierId}/inventory/update-stock`,
        {
          updates,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update stock:", error);
      throw error;
    }
  },

  //   // Product Management
  //   getSupplierProducts: async (
  //     supplierId: number,
  //     params?: {
  //       page?: number;
  //       limit?: number;
  //       category?: string;
  //       status?: string;
  //       search?: string;
  //     }
  //   ): Promise<InventoryResponse> => {
  //     try {
  //       const response = await axiosInstance.get(`/suppliers/${supplierId}/products`, { params });
  //       return response.data;
  //     } catch (error) {
  //       console.error('Failed to fetch supplier products:', error);
  //       throw error;
  //     }
  //   },

  // Business Profile Management
  getBusinessProfile: async (supplierId: number): Promise<BusinessProfile> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/business-profile`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch business profile:", error);
      throw error;
    }
  },

  updateBusinessProfile: async (
    supplierId: number,
    profileData: Partial<BusinessProfile>
  ): Promise<BusinessProfile> => {
    try {
      const response = await axiosInstance.put(
        `/suppliers/${supplierId}/business-profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update business profile:", error);
      throw error;
    }
  },

  getVerificationStatus: async (
    supplierId: number
  ): Promise<VerificationStatus> => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/verification-status`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch verification status:", error);
      throw error;
    }
  },
};

export default supplierApi;
