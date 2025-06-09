// Product types and interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  productType: string;
  brand: string;
  supplier: {
    id: string;
    name: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  specifications: Record<string, string>;
  rating: number;
  reviews: number;
  minOrderQty: number;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category?: string;
  productType?: string;
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  supplier?: string;
  minOrderQty?: number;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'reviews' | 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
