// src/apis/productApis.ts

import axiosInstance from "./axiosInstance";
import { type Product } from "../types/product";

export interface ProductFilterParams {
  search?: string;
  category?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface ProductSort {
  field: "createdAt" | "price" | "rating" | "reviews" | "name";
  order: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

const productApi = {
  // Fetch public product listings
  getProducts: async (
    filters: ProductFilterParams = {},
    sort: ProductSort = { field: "createdAt", order: "desc" },
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<ProductApiResponse> => {
    try {
      const response = await axiosInstance.get("/products/", {
        params: {
          ...filters,
          sortField: sort.field,
          sortOrder: sort.order,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      throw new Error("Unable to load products. Please try again.");
    }
  },

  // Fetch single product details
  getProductById: async (productId: string): Promise<Product> => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      throw new Error("Unable to load product details.");
    }
  },
  getRelatedProducts: async (productId: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}/related`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch related products:", error);
      throw new Error("Unable to load related products.");
    }
  },
};

export default productApi;
