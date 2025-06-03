import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed
import axiosInstance from "../../api/axiosInstance"; // Adjust the import path as needed
import GoogleIcon from "@mui/icons-material/Google"; // Or use SVG/logo

const GoogleSignInButton: React.FC = () => {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await axiosInstance.post(
          "/auth/google-signin",
          { token: credentialResponse.credential },
          { headers: { "Content-Type": "application/json" } }
        );
        login();
      } catch (error: any) {
        alert(
          error.response?.data?.msg ||
            error.response?.data?.error ||
            "Google sign-in failed"
        );
      }
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google SSO failed")}
      useOneTap={false}
      width="100%"
      theme="outline"
      logo_alignment="center"
      text="signin_with"
      shape="circle"
      type="standard"
      size="large"
      // For custom styling, can wrap with a button if needed
    />
  );
};

export default GoogleSignInButton;
