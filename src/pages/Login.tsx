import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { useNavigate } from "react-router-dom";
import logo from "../assets/png/logo.png";
import LoginIllustration from "../assets/png/login-illustration.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await axiosInstance.post("/auth/login", { email, password: pw });
      login();
      navigate("/home"); // or your dashboard
    } catch (error: any) {
      setErr(
        error.response?.data?.msg ||
          error.response?.data?.error ||
          "Invalid credentials"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel: Logo, Heading, Image */}
      <div className="hidden lg:block w-3/5 pl-8 relative">
        {/* Logo */}
        <img
          src={logo}
          alt="SwiftSupply Logo"
          className="absolute left-12 top-14 h-18 w-auto z-20"
        />

        {/* Heading and Subtext */}
        <div className="absolute left-50 top-[25%] pl-8 z-10">
          <h1 className="text-4xl font-bold mb-5">
            Sign Up to <span className="inline-block">SwiftSupply</span>
          </h1>
          <p className="text-xl mb-2 text-[gray] font-semibold">
            If you already have an account
          </p>
          <span className="text-xl text-[gray] font-semibold">
            You can{" "}
            <a
              href="/signup"
              className="text-[#B1153C] font-bold underline cursor-pointer"
            >
              Signup here !
            </a>
          </span>
        </div>

        {/* Signup Illustration Image */}
        <img
          src={LoginIllustration}
          className="absolute left-0 bottom-5 max-h-[500px] pl-8"
          alt=""
        />
      </div>

      {/* Right Panel: Stepper Form */}
        <div className="flex-1 flex flex-col justify-center items-center bg-white">
          <form
            className="w-full max-w-md bg-white rounded-xl shadow-card px-6 py-8"
            onSubmit={handleSubmit}
          >
            <div className="text-2xl font-bold mb-6">Sign in</div>
            {err && (
              <div className="bg-red-50 border border-red-400 text-red-700 rounded-md px-4 py-2 mb-4 text-center">
                {err}
              </div>
            )}
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Email
            </FormLabel>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="username"
              sx={{
                backgroundColor: "transparent",
                borderRadius: "10px",
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderRadius: "10px" },
                },
                "& .MuiOutlinedInput-input::placeholder": { opacity: 0.8 },
                "& input:-webkit-autofill, & input:-webkit-autofill:focus": {
                  borderRadius: "10px",
                  WebkitBoxShadow: "none",
                  WebkitTextFillColor: "#000",
                  transition: "background-color 5000s ease-in-out 0s",
                  caretColor: "#000",
                },
              }}
            />
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Password
            </FormLabel>
            <TextField
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "transparent",
                borderRadius: "10px",
                marginBottom: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderRadius: "10px" },
                },
                "& .MuiOutlinedInput-input::placeholder": { opacity: 0.8 },
                "& input:-webkit-autofill, & input:-webkit-autofill:focus": {
                  borderRadius: "10px",
                  WebkitBoxShadow: "none",
                  WebkitTextFillColor: "#000",
                  transition: "background-color 5000s ease-in-out 0s",
                  caretColor: "#000",
                },
              }}
            />
            <div className="flex justify-end text-sm mb-4">
              <a
                href="/forgot-password"
                className="text-[#7b0a24] hover:underline"
              >
                Forgot password ?
              </a>
            </div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{
                backgroundColor: "#7b0a24",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.1rem",
                py: 1.4,
                mb: 2,
                mt: 1,
                boxShadow: "0 2px 18px rgba(123,10,36,0.12)",
                "&:hover": { backgroundColor: "#63051c" },
              }}
            >
              Login
            </Button>
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-[gray] opacity-20"></div>
              <span className="mx-3 text-[gray] text-sm">or</span>
              <div className="flex-grow border-t border-[gray] opacity-20"></div>
            </div>
            <div className="w-full">
              <GoogleSignInButton />
            </div>
          </form>
      </div>
    </div>
  );
}
