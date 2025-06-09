import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
import Home from "./pages/Home";
// import ProfileSettings from "./pages/Buyer/ProfileSettings";
// import OrdersPage from "./pages/OrdersPage";
// import WalletPage from "./pages/WalletPage";
// import PromotionsPage from "./pages/PromotionsPage";
// import StoresPage from "./pages/StoresPage";
// import SupplierDetailPage from "./pages/SupplierDetailPage";
// import CartPage from "./pages/CartPage";
// import ProductsPage from "./pages/ProductsPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
// import BuyerRoute from "./components/auth/BuyerRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SupplierLayout from "./pages/Supplier/SupplierLayout";
import SupplierInventory from "./pages/Supplier/SupplierInventory";
import SupplierOrders from "./pages/Supplier/SupplierOrders";
import SupplierMessages from "./pages/Supplier/SupplierMessages";
// Placeholder imports for new pages
const SupplierAnalytics = React.lazy(
  () => import("./pages/Supplier/SupplierAnalytics")
);
const SupplierBusinessProfile = React.lazy(
  () => import("./pages/Supplier/SupplierBusinessProfile")
);
const SupplierVisibility = React.lazy(
  () => import("./pages/Supplier/SupplierVisibility")
);
const SupplierTools = React.lazy(
  () => import("./pages/Supplier/SupplierTools")
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (user) return <Navigate to="/" />;
  return <>{children}</>;
};

const DefaultRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (user?.role === "SELLER") {
    return <Navigate to="/supplier/dashboard" replace />;
  }
  
  return <Navigate to="/home" replace />;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DefaultRedirect />} />
          {/* <Route 
            path="/home" 
            element={
              <BuyerRoute>
                <Home />
              </BuyerRoute>
            } 
          /> */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}
          {/* <Route
            path="/profile"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <ProfileSettings />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <OrdersPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <WalletPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/promotions"
            element={
              <PrivateRoute>
                <BuyerRoute>
                  <PromotionsPage />
                </BuyerRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <BuyerRoute>
                <ProductsPage />
              </BuyerRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <BuyerRoute>
                <ProductDetailPage />
              </BuyerRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <BuyerRoute>
                <StoresPage />
              </BuyerRoute>
            }
          />
          <Route
            path="/suppliers/:id"
            element={
              <BuyerRoute>
                <SupplierDetailPage />
              </BuyerRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <BuyerRoute>
                <StoresPage />
              </BuyerRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <BuyerRoute>
                <CartPage />
              </BuyerRoute>
            }
          /> */}
          <Route
            path="/s"
            element={
                <SupplierDashboard />
            }
          ></Route>

          {/* Supplier Routes */}
          <Route
            path="/supplier"
            element={
              <RoleBasedRoute allowedRoles={["SELLER"]}>
                <SupplierLayout />
              </RoleBasedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SupplierDashboard />} />
            <Route path="orders" element={<SupplierOrders />} />
            <Route path="inventory" element={<SupplierInventory />} />
            <Route
              path="analytics"
              element={
                <React.Suspense fallback={<>Loading...</>}>
                  <SupplierAnalytics />
                </React.Suspense>
              }
            />
            <Route
              path="business-profile"
              element={
                <React.Suspense fallback={<>Loading...</>}>
                  <SupplierBusinessProfile />
                </React.Suspense>
              }
            />
            <Route path="messages" element={<SupplierMessages />} />
            <Route
              path="visibility"
              element={
                <React.Suspense fallback={<>Loading...</>}>
                  <SupplierVisibility />
                </React.Suspense>
              }
            />
            <Route
              path="tools"
              element={
                <React.Suspense fallback={<>Loading...</>}>
                  <SupplierTools />
                </React.Suspense>
              }
            />
          </Route>

          {/* Add more routes as needed */}
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
