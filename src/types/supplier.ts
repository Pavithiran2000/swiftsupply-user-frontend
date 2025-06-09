// Supplier types and interfaces
export interface Supplier {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  location: string;
  contact: {
    email: string;
    phone: string;
  };
  rating: number;
  totalReviews: number;
  verified: boolean;
  productTypes: string[];
  categories: string[];
  businessType: 'Manufacturer' | 'Trading Company' | 'Supplier' | 'Distributor';
  certifications: string[];
  isGoldSupplier: boolean;
  isPremium: boolean;
  totalProducts: number;
  totalOrders: number;
  successRate: number;
  createdAt: string;
  lastActive: string;
}

export interface SupplierFilter {
  country?: string;
  businessType?: string;
  categories?: string[];
  verified?: boolean;
  isGoldSupplier?: boolean;
  isPremium?: boolean;
  ratingMin?: number;
}

export interface SupplierSort {
  field: 'rating' | 'totalReviews' | 'name' | 'totalProducts' | 'successRate' | 'lastActive';
  order: 'asc' | 'desc';
}

export interface SupplierPaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupplierReview {
  id: string;
  buyerName: string;
  buyerCountry: string;
  rating: number;
  comment: string;
  orderValue: number;
  productCategory: string;
  date: string;
  verified: boolean;
}

export interface SupplierContact {
  type: 'inquiry' | 'quote' | 'call' | 'whatsapp';
  subject?: string;
  message?: string;
  productInterest?: string;
}

// Dashboard-specific interfaces
export interface DashboardStats {
  totalInquiries: number;
  unreadMessages: number;
  pendingOrders: number;
  productViews: number;
  lowStockAlerts: number;
  todayOrderValue: number;
  percentageChanges: {
    inquiries: number;
    messages: number;
    orders: number;
    views: number;
    stock: number;
    revenue: number;
  };
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductEngagement {
  productName: string;
  views: number;
  inquiries: number;
  orders: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'inquiry' | 'order' | 'view' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  relatedEntity?: {
    id: string;
    name: string;
    type: 'product' | 'buyer' | 'order';
  };
}

export interface BuyerEngagementData {
  stage: string;
  count: number;
  percentage: number;
}

export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  views: number;
  inquiries: number;
  orders: number;
  revenue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierInquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
  isRead: boolean;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  orderDate: Date;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SupplierProfile {
  id: string;
  businessName: string;
  businessRegistration: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  description?: string;
  certifications: string[];
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  joinedDate: Date;
}