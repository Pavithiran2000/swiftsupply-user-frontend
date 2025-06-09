import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface BuyerRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showAccessMessage?: boolean;
}

const BuyerRoute: React.FC<BuyerRouteProps> = ({
  children,
  redirectTo = "/supplier/dashboard",
  showAccessMessage = false
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // If user is not logged in, allow access (public routes)
  if (!user) {
    return <>{children}</>;
  }
  // If user is a seller, redirect them to supplier dashboard
  if (user.role === "seller") {
    if (showAccessMessage) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Access</h1>
            <p className="text-gray-600 mb-6">
              This page is for buyers. As a seller, you can access your supplier dashboard.
            </p>
            <a
              href="/supplier/dashboard"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors inline-block"
            >
              Go to Supplier Dashboard
            </a>
          </div>
        </div>
      );
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  // If user is a buyer or has any other role, allow access
  return <>{children}</>;
};

export default BuyerRoute;
