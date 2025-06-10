// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "@mui/material";

// const DashboardPage: React.FC = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Top bar */}
//       <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <img src="/logo.png" alt="SwiftSupply Logo" className="h-10" />
//           <span className="font-bold text-2xl text-maroon">SwiftSupply</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="font-semibold text-gray-700">
//             Hi, {user?.first_name} {user?.last_name}
//           </span>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={logout}
//             sx={{
//               backgroundColor: "#7b0a24",
//               borderRadius: "10px",
//               fontWeight: 600,
//               "&:hover": { backgroundColor: "#63051c" },
//             }}
//           >
//             Logout
//           </Button>
//         </div>
//       </div>
//       {/* Content */}
//       <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
//         <h1 className="text-4xl font-bold mb-4 text-maroon">
//           Welcome to your Dashboard!
//         </h1>
//         <div className="max-w-xl bg-white rounded-xl shadow-card p-8 mt-6">
//           <p className="text-lg text-gray-800 mb-2">
//             <b>Email:</b> {user?.email}
//           </p>
//           <p className="text-lg text-gray-800 mb-2">
//             <b>Role:</b> {user?.role}
//           </p>
//           <p className="text-lg text-gray-800 mb-2">
//             <b>Contact:</b> {user?.contact}
//           </p>
//           {user?.profile && (
//             <div className="mt-2">
//               <p className="text-md text-gray-700 font-semibold">Profile Details:</p>
//               <pre className="text-sm text-gray-600 bg-gray-100 rounded p-2 mt-1">
//                 {JSON.stringify(user.profile, null, 2)}
//               </pre>
//             </div>
//           )}
//           <div className="mt-8">
//             <span className="text-gray-600">
//               (You can build out your dashboard features here!)
//             </span>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;
import React, { useEffect } from "react";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Header from "../components/Home/HomeHeader";
import HeroBanner from "../components/Home/HeroBanner";
import CategoriesCarousel from "../components/Home/CategoryCarousel";
import ProductHighlights from "../components/Home/ProductSections";
import Testimonials from "../components/Home/Testimonials";
import NewsletterSignup from "../components/Home/NewsletterSignup";
import Footer from "../components/Home/Footer";
import Api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ChatBotWidget from "../components/chatbot";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const { user, logout } = useAuth();
  
  useEffect(() => {
    loadAllCategories();
  }, []);

  const loadAllCategories = async () => {
    try {
      // Assuming Api.getAllCategories is defined in your API module
      const categories = await Api.getAllCategories();
      console.log("Categories loaded:", categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };



  
  return (
    <Box 
      sx={{ 
        bgcolor: "#f8f8f8", 
        minHeight: "100vh",
        paddingBottom: isMobile ? "70px" : 0, // Add padding for bottom navigation
        overflowX: "hidden", // Prevent horizontal scroll
        width: "100vw",
        maxWidth: "100%",
      }}
    >
      <ChatBotWidget/>
      <Header />
      <Box component="main" sx={{ overflowX: "hidden", width: "100%", maxWidth: "100%" }}>
        <HeroBanner />
        <Box 
          component="section" 
          className="py-12 px-4" 
          sx={{ 
            maxWidth: "1400px", 
            mx: "auto", 
            overflowX: "hidden",
            width: "100%"
          }}
        >
          <CategoriesCarousel />
        </Box>
        <Box component="section" sx={{ overflowX: "hidden", width: "100%" }}>
          <ProductHighlights />
        </Box>
        <Box component="section" className="bg-white py-10" sx={{ overflowX: "hidden", width: "100%" }}>
          <Testimonials />
        </Box>
        <Box component="section" sx={{ overflowX: "hidden", width: "100%" }}>
          <NewsletterSignup />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
export default HomePage;
