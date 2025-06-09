import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  OutlinedInput,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

type UserRole = "BUYER" | "SELLER";
type UserType = "retailers" | "wholesales";
type StepKey = 0 | 1 | 2 | 3;

const steps = [
  "Personal Information",
  "Store Information",
  "Password Information",
  "OTP Verification",
];

interface Category {
  id: number;
  name: string;
}
interface ProductType {
  id: number;
  name: string;
}

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  role: UserRole;
  // Buyer
  userType: UserType;
  companyName: string;
  companyReg: string;
  companyAddress: string;
  preferredCategoryIds: number[]; // multi
  // Seller
  storeName: string;
  storeReg: string;
  storeAddress: string;
  productTypeIds: number[]; // multi
  // Password
  password: string;
  confirmPassword: string;
  // OTP
  otp: number | null;
}

const initialState: SignupState = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  role: "BUYER",
  userType: "retailers",
  companyName: "",
  companyReg: "",
  companyAddress: "",
  preferredCategoryIds: [],
  storeName: "",
  storeReg: "",
  storeAddress: "",
  productTypeIds: [],
  password: "",
  confirmPassword: "",
  otp: null,
};

const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
const phonePattern = /^[0-9]{10,15}$/;
const passwordPattern = /^.{6,}$/;

const SignupStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<StepKey>(0);
  const [values, setValues] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Options
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const [resentLoading, setResentLoading] = useState(false);
  const [resentMsg, setResentMsg] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Start timer when step 3 (OTP) is reached
  useEffect(() => {
    if (activeStep === 3) {
      setResendSeconds(60);
      setCanResend(false);
      setResentMsg(null);
      const timer = setInterval(() => {
        setResendSeconds((sec) => {
          if (sec <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeStep, values.email]);

  // Fetch category/product types when needed
  useEffect(() => {
    if (activeStep !== 1) return;
    setOptionsLoading(true);
    if (values.role === "BUYER") {
      axiosInstance
        .get("/api/categories")
        .then((res) => setCategories(res.data))
        .catch((err) => {
          setCategories([]);
          setBackendError(
            err.response?.data?.msg ||
              err.response?.data?.error ||
              "Failed to load categories"
          );
        })
        .finally(() => setOptionsLoading(false));
    } else {
      axiosInstance
        .get("/api/product-types")
        .then((res) => setProductTypes(res.data))
        .catch((err) => {
          setProductTypes([]);
          setBackendError(
            err.response?.data?.msg ||
              err.response?.data?.error ||
              "Failed to load product types"
          );
        })
        .finally(() => setOptionsLoading(false));
    }
  }, [activeStep, values.role]);

  // Place at top of your SignupStepper component
  const checkUnique = async (field: string, value: string) => {
    try {
      console.log("checkemail");

      const res = await axiosInstance.post("/auth/check-unique", {
        [field]: value,
      });
      return res.data;
    } catch (e) {
      return {};
    }
  };

  // === Step Navigation ===
  const handleNext = async () => {
    setBackendError(null);
    if (!validateStep(activeStep)) return;
    if (activeStep === 2) {
      setLoading(true);
      setErrors({});
      try {
        console.log(values);
        const payload: any = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          contact: values.contact,
          role: values.role,
          password: values.password,
        };
        if (values.role === "BUYER") {
          payload.userType = values.userType;
          payload.companyName = values.companyName;
          payload.companyReg = values.companyReg;
          payload.companyAddress = values.companyAddress;
          payload.preferredCategoryIds = values.preferredCategoryIds;
        } else {
          payload.storeName = values.storeName;
          payload.storeReg = values.storeReg;
          payload.storeAddress = values.storeAddress;
          payload.productTypeIds = values.productTypeIds;
        }
        await axiosInstance.post("/auth/signup", payload);
        setActiveStep(3);
      } catch (err: any) {
        setBackendError(
          err.response?.data?.msg ||
            err.response?.data?.error ||
            "Registration failed"
        );
      }
      setLoading(false);
    } else {
      setActiveStep((s) => (s + 1) as StepKey);
    }
  };

  const handleResendOTP = async () => {
    setResentLoading(true);
    setResentMsg(null);
    try {
      await axiosInstance.post("/auth/resend-otp", { email: values.email });
      setResentMsg("OTP resent! Check your email.");
      // Restart timer
      setResendSeconds(60);
      setCanResend(false);
      const timer = setInterval(() => {
        setResendSeconds((sec) => {
          if (sec <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } catch (err: any) {
      setResentMsg(
        err.response?.data?.msg || "Could not resend OTP. Try again."
      );
    } finally {
      setResentLoading(false);
      setTimeout(() =>setResentMsg(null), 5000);
    }
  };

  const handleBack = () => {
    setBackendError(null);
    setErrors({});
    setOtpError(null);
    setActiveStep((s) => (s - 1) as StepKey);
  };

  // === OTP Submission ===
  const handleOTP = async () => {
    setLoading(true);
    setOtpError(null);
    setBackendError(null);
    try {
      await axiosInstance.post("/auth/verify-otp", {
        email: values.email,
        otp_code: values.otp,
      });
      setSignupSuccess(true);
    } catch (err: any) {
      setOtpError(
        err.response?.data?.msg || "Verification failed. Please try again."
      );
    }
    setLoading(false);
  };

  function validateStep(step: StepKey): boolean {
    const newErrors: { [k: string]: string } = {};
    if (step === 0) {
      if (!values.firstName) newErrors.firstName = "First name cannot be blank";
      if (!values.lastName) newErrors.lastName = "Last name cannot be blank";
      if (!values.email) newErrors.email = "Email cannot be blank";
      else if (!emailPattern.test(values.email))
        newErrors.email = "Invalid email address";
      if (!values.contact) newErrors.contact = "Contact number cannot be blank";
      else if (!phonePattern.test(values.contact))
        newErrors.contact = "Invalid phone number";
    }
    if (step === 1) {
      if (values.role === "BUYER") {
        if (!values.companyName)
          newErrors.companyName = "Company name required";
        if (!values.companyReg) newErrors.companyReg = "Company Reg. required";
        if (!values.companyAddress)
          newErrors.companyAddress = "Address required";
        if (!values.preferredCategoryIds.length)
          newErrors.preferredCategoryIds = "Choose at least one category";
      } else {
        if (!values.storeName) newErrors.storeName = "Store name required";
        if (!values.storeReg) newErrors.storeReg = "Store Reg. required";
        if (!values.storeAddress)
          newErrors.storeAddress = "Store address required";
        if (!values.productTypeIds.length)
          newErrors.productTypeIds = "Choose at least one product type";
      }
    }
    if (step === 2) {
      if (!values.password) newErrors.password = "Password is required";
      else if (!passwordPattern.test(values.password))
        newErrors.password = "At least 6 characters";
      if (!values.confirmPassword)
        newErrors.confirmPassword = "Please confirm password";
      else if (values.password !== values.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleField = (k: keyof SignupState, v: any) => {
    setValues((old) => ({ ...old, [k]: v }));
    setErrors((old) => ({ ...old, [k]: undefined }));
    setBackendError(null);
  };

  // === UI per Step ===
  function renderStep(step: StepKey) {
    if (signupSuccess)
      return (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <img src="/success-icon.png" alt="" className="w-24 mb-4" />
          <div className="text-3xl font-bold mb-2">You're all signed up!</div>
          <div className="text-blue-600 mb-6">
            Your settings have been saved
          </div>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7b0a24",
              borderRadius: "12px",
              mt: 2,
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
            href="/login"
          >
            Continue
          </Button>
        </div>
      );

    if (step === 0)
      return (
        <>
          <div className="font-bold text-xl mb-2">Personal Information</div>
          <div className="space-y-4">
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              First Name
            </FormLabel>
            <TextField
              value={values.firstName}
              onChange={(e) => handleField("firstName", e.target.value)}
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
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
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Last Name
            </FormLabel>
            <TextField
              value={values.lastName}
              onChange={(e) => handleField("lastName", e.target.value)}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
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
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Email
            </FormLabel>
            <TextField
              value={values.email}
              onChange={(e) => handleField("email", e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              onBlur={async () => {
                if (values.email && emailPattern.test(values.email)) {
                  const res = await checkUnique("email", values.email);
                  if (res.emailExists) {
                    setErrors((old) => ({
                      ...old,
                      email: "Email already in use",
                    }));
                  }
                }
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
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Contact Number
            </FormLabel>
            <TextField
              value={values.contact}
              onChange={(e) => handleField("contact", e.target.value)}
              onBlur={async () => {
                if (values.contact) {
                  const res = await checkUnique("contact", values.contact);
                  if (res.contactExists) {
                    setErrors((old) => ({
                      ...old,
                      contact: "Contact already in use",
                    }));
                  }
                }
              }}
              fullWidth
              error={!!errors.contact}
              helperText={errors.contact}
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
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Select User Role
            </FormLabel>
            <RadioGroup
              row
              value={values.role}
              onChange={(e) => handleField("role", e.target.value)}
            >
              <FormControlLabel
                value="BUYER"
                control={<Radio color="primary" />}
                label="Buyer"
              />
              <FormControlLabel
                value="SELLER"
                control={<Radio color="primary" />}
                label="Seller"
              />
            </RadioGroup>
          </div>
        </>
      );
    if (step === 1)
      return (
        <>
          <div className="font-bold text-xl mb-2">
            {values.role === "BUYER"
              ? "Company Information"
              : "Store Information"}
          </div>
          {values.role === "BUYER" ? (
            <div className="space-y-4">
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Company Name
              </FormLabel>
              <TextField
                value={values.companyName}
                onChange={(e) => handleField("companyName", e.target.value)}
                fullWidth
                error={!!errors.companyName}
                helperText={errors.companyName}
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
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Company Reg. No.
              </FormLabel>
              <TextField
                value={values.companyReg}
                onChange={(e) => handleField("companyReg", e.target.value)}
                onBlur={async () => {
                  if (values.companyReg) {
                    const res = await checkUnique(
                      "companyReg",
                      values.companyReg
                    );
                    if (res.companyRegExists) {
                      setErrors((old) => ({
                        ...old,
                        companyReg: "Company Reg. already exists",
                      }));
                    }
                  }
                }}
                fullWidth
                error={!!errors.companyReg}
                helperText={errors.companyReg}
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
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Company Address
              </FormLabel>
              <TextField
                value={values.companyAddress}
                onChange={(e) => handleField("companyAddress", e.target.value)}
                onBlur={async () => {
                  if (values.storeReg) {
                    const res = await checkUnique("storeReg", values.storeReg);
                    if (res.storeRegExists) {
                      setErrors((old) => ({
                        ...old,
                        storeReg: "Store Reg. already exists",
                      }));
                    }
                  }
                }}
                fullWidth
                error={!!errors.companyAddress}
                helperText={errors.companyAddress}
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

              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Preferred Categories
              </FormLabel>
              <Select
                multiple
                value={values.preferredCategoryIds}
                onChange={(e) =>
                  handleField(
                    "preferredCategoryIds",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",").map(Number)
                      : e.target.value
                  )
                }
                renderValue={(selected) =>
                  (selected as number[]).length === 0
                    ? "--selected--"
                    : (selected as number[])
                        .map(
                          (id) =>
                            categories.find((c) => c.id === id)?.name || id
                        )
                        .join(", ")
                }
                displayEmpty
                fullWidth
                error={!!errors.preferredCategoryIds}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
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
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Checkbox
                      checked={values.preferredCategoryIds.includes(cat.id)}
                    />
                    <ListItemText primary={cat.name} />
                  </MenuItem>
                ))}
              </Select>
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                User Type
              </FormLabel>
              <RadioGroup
                row
                value={values.userType}
                onChange={(e) => handleField("userType", e.target.value)}
              >
                <FormControlLabel
                  value="retailers"
                  control={<Radio color="primary" />}
                  label="Retailers"
                />
                <FormControlLabel
                  value="wholesales"
                  control={<Radio color="primary" />}
                  label="Wholesales"
                />
              </RadioGroup>

              {errors.preferredCategoryIds && (
                <div className="text-red-600 text-xs">
                  {errors.preferredCategoryIds}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Store Name
              </FormLabel>
              <TextField
                value={values.storeName}
                onChange={(e) => handleField("storeName", e.target.value)}
                fullWidth
                error={!!errors.storeName}
                helperText={errors.storeName}
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
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Store Reg No.
              </FormLabel>
              <TextField
                value={values.storeReg}
                onChange={(e) => handleField("storeReg", e.target.value)}
                fullWidth
                error={!!errors.storeReg}
                helperText={errors.storeReg}
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
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Store Address
              </FormLabel>
              <TextField
                value={values.storeAddress}
                onChange={(e) => handleField("storeAddress", e.target.value)}
                fullWidth
                error={!!errors.storeAddress}
                helperText={errors.storeAddress}
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
              <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
                Product Types
              </FormLabel>
              <Select
                multiple
                value={values.productTypeIds}
                onChange={(e) =>
                  handleField(
                    "productTypeIds",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",").map(Number)
                      : e.target.value
                  )
                }
                renderValue={(selected) =>
                  (selected as number[]).length === 0
                    ? "--selected--"
                    : (selected as number[])
                        .map(
                          (id) =>
                            productTypes.find((p) => p.id === id)?.name || id
                        )
                        .join(", ")
                }
                displayEmpty
                fullWidth
                error={!!errors.productTypeIds}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
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
              >
                {productTypes.map((prod) => (
                  <MenuItem key={prod.id} value={prod.id}>
                    <Checkbox
                      checked={values.productTypeIds.includes(prod.id)}
                    />
                    <ListItemText primary={prod.name} />
                  </MenuItem>
                ))}
              </Select>
              {errors.productTypeIds && (
                <div className="text-red-600 text-xs">
                  {errors.productTypeIds}
                </div>
              )}
            </div>
          )}
        </>
      );
    if (step === 2)
      return (
        <>
          <div className="font-bold text-xl mb-2">Password Information</div>
          <div className="space-y-4">
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Password
            </FormLabel>
            <TextField
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => handleField("password", e.target.value)}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
            <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
              Confirm Password
            </FormLabel>
            <TextField
              type={showConfirm ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) => handleField("confirmPassword", e.target.value)}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
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
          </div>
        </>
      );
    if (step === 3)
      return (
        <>
          <div className="font-bold text-xl mb-2">OTP Verification</div>
          <div className="text-blue-700 mb-4">
            Enter OTP code sent to{" "}
            <span className="font-mono">{maskEmail(values.email)}</span>
          </div>
          <FormLabel className="text-[#000]" sx={{ fontWeight: 600 }}>
            OTP
          </FormLabel>
          <TextField
            value={values.otp}
            onChange={(e) => handleField("otp", e.target.value)}
            fullWidth
            error={!!otpError}
            helperText={otpError}
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
          <div className="flex items-center gap-2 mt-2">
            {canResend ? (
              <button
                type="button"
                disabled={resentLoading}
                onClick={handleResendOTP}
                className="text-maroon underline font-semibold text-sm hover:opacity-80 transition disabled:opacity-60"
                style={{ minWidth: 90, cursor: "pointer" }}
              >
                {resentLoading ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-[gray] text-l select-none font-semibold">
                Resend in {resendSeconds}s
              </span>
            )}
            {resentMsg && (
              <span className="ml-2 text-green-700 text-xs">{resentMsg}</span>
            )}
          </div>
        </>
      );
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-card px-4 py-6">
      {!signupSuccess && (
        <h1 className="text-4xl font-bold text-left mb-6">Sign Up</h1>
      )}
      {backendError && (
        <div className="bg-red-50 border border-red-400 text-red-700 rounded-md px-4 py-2 mb-4 text-center">
          {backendError}
        </div>
      )}
      <form
        className="flex flex-col gap-6 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (activeStep === 3 && !signupSuccess) handleOTP();
          else handleNext();
        }}
      >
        {renderStep(activeStep)}
        <div className="flex gap-3 mt-2 items-center">
          {activeStep > 0 && activeStep < 3 && !signupSuccess && (
            <IconButton
              type="button"
              onClick={handleBack}
              sx={{
                background: "#ececec",
                borderRadius: "50%",
                boxShadow: "0 1px 4px #0001",
                marginRight: "8px",
                "&:hover": { background: "#e5e5e5" },
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          )}
          {activeStep < 3 && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#7b0a24",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.1rem",
                flex: 1,
                py: 1.3,
                mt: 1,
                boxShadow: "0 2px 18px rgba(123,10,36,0.10)",
                "&:hover": { backgroundColor: "#63051c" },
              }}
            >
              {activeStep === 2 ? "Continue" : "Next"}
            </Button>
          )}
          {activeStep === 3 && !signupSuccess && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#7b0a24",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.1rem",
                flex: 1,
                py: 1.3,
                mt: 1,
                boxShadow: "0 2px 18px rgba(123,10,36,0.10)",
                "&:hover": { backgroundColor: "#63051c" },
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : null
              }
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          )}
        </div>
      </form>
      {!signupSuccess && (
        <div className="stepper-container mt-10 mb-6">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      )}
    </div>
  );
};

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return "";
  return u[0] + "*".repeat(Math.max(2, u.length - 2)) + "@" + d;
}

export default SignupStepper;
