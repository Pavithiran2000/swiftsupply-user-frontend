import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from '@mui/material/GridLegacy';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Header from "../../components/Home/HomeHeader";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  profile?: {
    company_name?: string;
    company_reg?: string;
    company_address?: string;
    store_name?: string;
    store_reg?: string;
    store_address?: string;
    user_type?: string;
  };
}

const ProfileSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    profile: {},
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    profile: {},
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      const userData: ProfileData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        contact: user.contact || "",
        profile: user.profile || {},
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("profile.")) {
      const profileField = field.replace("profile.", "");
      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const updatePayload = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        contact: profileData.contact,
        profile: profileData.profile,
      };

      await axiosInstance.put("/auth/profile", updatePayload);
      
      // Refresh user data
      await refreshUser();
      
      setOriginalData(profileData);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.msg || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ 
        bgcolor: "#f8f8f8", 
        minHeight: "100vh",
        paddingBottom: isMobile ? "70px" : 0,
        pt: 3,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Profile Header Card */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 80, sm: 120 },
                        bgcolor: "maroon",
                        fontSize: { xs: "2rem", sm: "3rem" },
                      }}
                    >
                      {user.first_name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "white",
                          boxShadow: 2,
                          "&:hover": { bgcolor: "grey.100" },
                        }}
                        size="small"
                      >
                        <PhotoCameraIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: "600", color: "text.primary" }}>
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
                      {user.email}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "maroon", 
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.role}
                    </Typography>
                  </Box>
                  <Box>
                    {!isEditing ? (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                          bgcolor: "maroon",
                          "&:hover": { bgcolor: "#63051c" },
                        }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: "grey.400",
                            color: "text.secondary",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={saveLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                          onClick={handleSave}
                          disabled={saveLoading}
                          sx={{
                            bgcolor: "maroon",
                            "&:hover": { bgcolor: "#63051c" },
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <PersonIcon sx={{ color: "maroon" }} />
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{
                          "& .MuiFilledInput-root": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        sx={{
                          "& .MuiFilledInput-root": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileData.email}
                        disabled={true} // Email should not be editable
                        variant="filled"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: "action.disabled" }} />,
                        }}
                        sx={{
                          "& .MuiFilledInput-root": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        value={profileData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: isEditing ? "action.active" : "action.disabled" }} />,
                        }}
                        sx={{
                          "& .MuiFilledInput-root": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Business Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <BusinessIcon sx={{ color: "maroon" }} />
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      {user.role === "buyer" ? "Company Information" : "Store Information"}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {user.role === "buyer" ? (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Company Name"
                            value={profileData.profile?.company_name || ""}
                            onChange={(e) => handleInputChange("profile.company_name", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Company Registration"
                            value={profileData.profile?.company_reg || ""}
                            onChange={(e) => handleInputChange("profile.company_reg", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Company Address"
                            value={profileData.profile?.company_address || ""}
                            onChange={(e) => handleInputChange("profile.company_address", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            multiline
                            rows={3}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                        {profileData.profile?.user_type && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="User Type"
                              value={profileData.profile.user_type}
                              disabled={true}
                              variant="filled"
                              sx={{
                                "& .MuiFilledInput-root": {
                                  bgcolor: "grey.100",
                                },
                              }}
                            />
                          </Grid>
                        )}
                      </>
                    ) : (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Store Name"
                            value={profileData.profile?.store_name || ""}
                            onChange={(e) => handleInputChange("profile.store_name", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Store Registration"
                            value={profileData.profile?.store_reg || ""}
                            onChange={(e) => handleInputChange("profile.store_reg", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Store Address"
                            value={profileData.profile?.store_address || ""}
                            onChange={(e) => handleInputChange("profile.store_address", e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? "outlined" : "filled"}
                            multiline
                            rows={3}
                            sx={{
                              "& .MuiFilledInput-root": {
                                bgcolor: "grey.100",
                              },
                            }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default ProfileSettings;
