import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
  CameraAlt as CameraAltIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SupplierHeader from '../../components/Supplier/SupplierHeader';
import type { SupplierProfile, Supplier } from '../../types/supplier';

// Mock backend data for product types and categories
const BACKEND_PRODUCT_TYPES = [
  'Industrial Equipment',
  'Machinery',
  'Tools & Hardware',
  'Construction Materials',
  'Safety Equipment',
  'Electrical Components',
  'Automotive Parts',
  'Chemical Products',
  'Textiles & Fabrics',
  'Food & Beverages',
  'Electronics',
  'Packaging Materials',
  'Medical Equipment',
  'Office Supplies',
  'Agricultural Equipment',
  'Marine Equipment',
  'HVAC Systems',
  'Plumbing Supplies',
  'Lighting Equipment',
  'Power Tools'
];

const BACKEND_CATEGORIES = [
  'Manufacturing',
  'Construction',
  'Automotive',
  'Electronics',
  'Agriculture',
  'Healthcare',
  'Food & Beverage',
  'Textiles',
  'Chemical',
  'Energy',
  'Marine',
  'Aerospace',
  'Mining',
  'Oil & Gas',
  'Telecommunications',
  'Transportation',
  'Retail',
  'Hospitality',
  'Education',
  'Government'
];

// Mock data using the proper types
const mockSupplierProfile: SupplierProfile = {
  id: 'sup_001',
  businessName: 'Swift Industrial Solutions',
  businessRegistration: 'BRN-2023-001234',
  address: '123 Industrial Park, Manufacturing District, New York, NY 10001',
  contactPerson: 'John Smith',
  email: 'john.smith@swiftindustrial.com',
  phone: '+1 (555) 123-4567',
  description: 'Leading supplier of industrial equipment and machinery with over 15 years of experience in the manufacturing sector.',
  certifications: ['ISO 9001:2015', 'CE Marking', 'UL Listed', 'RoHS Compliant'],
  isVerified: true,
  rating: 4.8,
  totalReviews: 234,
  joinedDate: new Date('2023-03-15'),
};

const mockSupplier: Supplier = {
  id: 'sup_001',
  name: 'Swift Industrial Solutions',
  description: 'Leading supplier of industrial equipment and machinery with over 15 years of experience.',
  logo: '/api/placeholder/120/120',
  coverImage: '/api/placeholder/800/300',
  location: 'New York, NY, USA',
  contact: {
    email: 'john.smith@swiftindustrial.com',
    phone: '+1 (555) 123-4567',
  },
  rating: 4.8,
  totalReviews: 234,
  verified: true,
  productTypes: ['Industrial Equipment', 'Machinery', 'Tools'],
  categories: ['Manufacturing', 'Construction', 'Automotive'],
  businessType: 'Manufacturer',
  certifications: ['ISO 9001:2015', 'CE Marking', 'UL Listed', 'RoHS Compliant'],
  isGoldSupplier: true,
  isPremium: true,
  totalProducts: 156,
  totalOrders: 1243,
  successRate: 98.5,
  createdAt: '2023-03-15T00:00:00Z',
  lastActive: '2024-01-16T10:30:00Z',
};

const SupplierBusinessProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  const [profile, setProfile] = useState<SupplierProfile>(mockSupplierProfile);
  const [supplier, setSupplier] = useState<Supplier>(mockSupplier);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<SupplierProfile>(profile);
  const [editedSupplier, setEditedSupplier] = useState<Supplier>(supplier);  // Image upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  
  // Image editing states
  const [logoEditing, setLogoEditing] = useState(false);
  const [coverEditing, setCoverEditing] = useState(false);
  
  // Certificate upload states
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [uploadedCertificates, setUploadedCertificates] = useState<File[]>([]);
  const [certificateType, setCertificateType] = useState('');
  const [certificateProgress, setCertificateProgress] = useState(0);
  
  // Notification states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  useEffect(() => {
    // In a real app, fetch profile data from API
    setProfile(mockSupplierProfile);
    setSupplier(mockSupplier);
    
    // Save initial supplier profile data to localStorage for inventory component
    localStorage.setItem('supplierProfile', JSON.stringify({
      productTypes: mockSupplier.productTypes,
      categories: mockSupplier.categories,
    }));
  }, []);
  const handleEdit = () => {
    setEditedProfile(profile);
    setEditedSupplier(supplier);
    setLogoPreview(supplier.logo || '');
    setCoverImagePreview(supplier.coverImage || '');
    setIsEditing(true);
  };  const handleSave = () => {
    // Update profile
    setProfile(editedProfile);
    
    // Update supplier with image changes if any
    const updatedSupplier = {
      ...editedSupplier,
      logo: logoPreview || editedSupplier.logo,
      coverImage: coverImagePreview || editedSupplier.coverImage,
    };
    setSupplier(updatedSupplier);
    
    // Save supplier profile data to localStorage for inventory component
    localStorage.setItem('supplierProfile', JSON.stringify({
      productTypes: updatedSupplier.productTypes,
      categories: updatedSupplier.categories,
    }));
    
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: 'Business profile updated successfully!',
      severity: 'success'
    });
    
    // In real app, upload images to server if logoFile or coverImageFile exist
    if (logoFile) {
      console.log('Logo file to upload:', logoFile);
      // uploadImage(logoFile, 'logo');
    }
    if (coverImageFile) {
      console.log('Cover image file to upload:', coverImageFile);
      // uploadImage(coverImageFile, 'cover');
    }
  };  const handleCancel = () => {
    setEditedProfile(profile);
    setEditedSupplier(supplier);
    setLogoPreview(supplier.logo || '');
    setCoverImagePreview(supplier.coverImage || '');
    setLogoFile(null);
    setCoverImageFile(null);
    setIsEditing(false);
  };
  const handleInputChange = (field: keyof SupplierProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Certificate handling functions
  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      setSnackbar({
        open: true,
        message: 'Some files were rejected. Only PDF, JPG, PNG files under 10MB are allowed.',
        severity: 'warning'
      });
    }

    setUploadedCertificates([...uploadedCertificates, ...validFiles]);
  };

  const processCertificateUpload = () => {
    if (uploadedCertificates.length === 0 || !certificateType) {
      setSnackbar({
        open: true,
        message: 'Please select certificate type and upload at least one file.',
        severity: 'error'
      });
      return;
    }

    // Simulate upload progress
    setCertificateProgress(0);
    const interval = setInterval(() => {
      setCertificateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add certificate to profile
          const newCertification = `${certificateType} (Pending Verification)`;
          setProfile(prev => ({
            ...prev,
            certifications: [...prev.certifications, newCertification]
          }));
          setSnackbar({
            open: true,
            message: 'Certificate uploaded successfully! Verification may take 2-3 business days.',
            severity: 'success'
          });
          setCertificateDialogOpen(false);
          setUploadedCertificates([]);
          setCertificateType('');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  const removeCertificateFile = (index: number) => {
    setUploadedCertificates(prev => prev.filter((_, i) => i !== index));
  };
  // Image handling functions
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Please upload a valid image file (JPG, PNG, WEBP).',
          severity: 'error'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'Image size must be less than 5MB.',
          severity: 'error'
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        setLogoEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Please upload a valid image file (JPG, PNG, WEBP).',
          severity: 'error'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'Image size must be less than 5MB.',
          severity: 'error'
        });
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
        setCoverEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLogoImage = () => {
    const updatedSupplier = {
      ...supplier,
      logo: logoPreview || supplier.logo,
    };
    setSupplier(updatedSupplier);
    
    setLogoEditing(false);
    setSnackbar({
      open: true,
      message: 'Logo updated successfully!',
      severity: 'success'
    });
    
    // In real app, upload image to server
    if (logoFile) {
      console.log('Logo file to upload:', logoFile);
    }
  };

  const cancelLogoEdit = () => {
    setLogoPreview(supplier.logo || '');
    setLogoFile(null);
    setLogoEditing(false);
  };

  const saveCoverImage = () => {
    const updatedSupplier = {
      ...supplier,
      coverImage: coverImagePreview || supplier.coverImage,
    };
    setSupplier(updatedSupplier);
    
    setCoverEditing(false);
    setSnackbar({
      open: true,
      message: 'Cover image updated successfully!',
      severity: 'success'
    });
    
    // In real app, upload image to server
    if (coverImageFile) {
      console.log('Cover image file to upload:', coverImageFile);
    }
  };

  const cancelCoverEdit = () => {
    setCoverImagePreview(supplier.coverImage || '');
    setCoverImageFile(null);
    setCoverEditing(false);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: { xs: 1, md: 4 }, paddingTop: { md: "10px" } }}>
      <SupplierHeader />
      
      <Container maxWidth="xl" sx={{ flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  pt: 2,
                }}
              >
                Business Profile & Verification
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Manage your business information, verification status, and supplier credentials
            </Typography>
          </Box>

          {/* Cover Image and Profile Section */}
          <Paper sx={{ mb: 4, overflow: 'hidden', position: 'relative' }}>            {/* Cover Image */}
            <Box
              sx={{
                height: { xs: 200, md: 300 },
                background: coverImagePreview || supplier.coverImage 
                  ? `url(${coverImagePreview || supplier.coverImage})`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              {/* Cover Image Edit/Save/Cancel Buttons */}
              {!coverEditing ? (
                <>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="cover-image-upload"
                    type="file"
                    onChange={handleCoverImageUpload}
                  />
                  <label htmlFor="cover-image-upload">
                    <Tooltip title="Change Cover Image">
                      <IconButton
                        component="span"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <CameraAltIcon />
                      </IconButton>
                    </Tooltip>
                  </label>
                </>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Save Cover Image">
                    <IconButton
                      onClick={saveCoverImage}
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.9)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 1)',
                        },
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton
                      onClick={cancelCoverEdit}
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 1)',
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>

            {/* Profile Info Section */}
            <Box sx={{ p: 3, pt: 0 }}>
              {/* Profile Avatar and Basic Info */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: -8 }}>                {/* Profile Logo */}
                <Box sx={{ position: 'relative', alignSelf: { xs: 'center', md: 'flex-start' } }}>
                  <Avatar
                    src={logoPreview || supplier.logo}
                    sx={{
                      width: { xs: 120, md: 150 },
                      height: { xs: 120, md: 150 },
                      border: '4px solid white',
                      boxShadow: 3,
                      fontSize: { xs: 48, md: 60 },
                      bgcolor: 'primary.main',
                    }}
                  >
                    {!logoPreview && !supplier.logo && supplier.name.charAt(0)}
                  </Avatar>
                  
                  {/* Logo Edit/Save/Cancel Buttons */}
                  {!logoEditing ? (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload">
                        <Tooltip title="Change Logo">
                          <IconButton
                            component="span"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              backgroundColor: 'white',
                              boxShadow: 2,
                              '&:hover': {
                                backgroundColor: 'grey.100',
                              },
                            }}
                            size="small"
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </Tooltip>
                      </label>
                    </>
                  ) : (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8,
                      display: 'flex',
                      gap: 0.5
                    }}>
                      <Tooltip title="Save Logo">
                        <IconButton
                          onClick={saveLogoImage}
                          sx={{
                            backgroundColor: 'success.main',
                            color: 'white',
                            boxShadow: 2,
                            '&:hover': {
                              backgroundColor: 'success.dark',
                            },
                          }}
                          size="small"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          onClick={cancelLogoEdit}
                          sx={{
                            backgroundColor: 'error.main',
                            color: 'white',
                            boxShadow: 2,
                            '&:hover': {
                              backgroundColor: 'error.dark',
                            },
                          }}
                          size="small"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Business Info */}
                <Box sx={{ flex: 1, pt: { xs: 2, md: 6 } }}>                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {supplier.name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {supplier.verified && (
                          <Chip 
                            icon={<VerifiedIcon />}
                            label="Verified" 
                            color="success" 
                            variant="filled"
                            size="small"
                          />
                        )}
                        {supplier.isGoldSupplier && (
                          <Chip 
                            label="Gold Supplier" 
                            color="warning" 
                            variant="filled"
                            size="small"
                          />
                        )}
                        {supplier.isPremium && (
                          <Chip 
                            label="Premium" 
                            color="primary" 
                            variant="filled"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
                    gap: 3,
                    mb: 3
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                        {supplier.totalProducts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Products
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                        {supplier.successRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>
                        {supplier.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="info.main" sx={{ fontWeight: 700 }}>
                        {supplier.totalReviews}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reviews
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" />
                      <Typography variant="body2">{supplier.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{supplier.contact.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      <Typography variant="body2">{supplier.contact.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Description */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
                  {supplier.description}
                </Typography>
              </Box>

              {/* Product Types and Categories Tags */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Product Types:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                  {supplier.productTypes.map((type, index) => (
                    <Chip
                      key={index}
                      label={type}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))}
                </Stack>
                
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Categories:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {supplier.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      variant="outlined"
                      size="small"
                      color="secondary"
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Paper><Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Profile Overview Card */}
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' }, 
              gap: 3 
            }}>
              <Box sx={{ 
                flex: { xs: '1 1 100%', lg: '1 1 66.67%' }
              }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Business Information
                    </Typography>
                    {!isEditing ? (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        variant="outlined"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          variant="contained"
                          size="small"
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          variant="outlined"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 3 
                  }}>                    <TextField
                      fullWidth
                      label="Business Name"
                      value={profile.businessName}
                      disabled={true}
                      variant="filled"
                      helperText="This field cannot be edited. Contact support to change."
                    />
                    <TextField
                      fullWidth
                      label="Business Registration"
                      value={profile.businessRegistration}
                      disabled={true}
                      variant="filled"
                      helperText="This field cannot be edited. Contact support to change."
                    />
                    <TextField
                      fullWidth
                      label="Contact Person"
                      value={isEditing ? editedProfile.contactPerson : profile.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      disabled={!isEditing}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile.email}
                      disabled={true}
                      variant="filled"
                      helperText="This field cannot be edited. Contact support to change."
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profile.phone}
                      disabled={true}
                      variant="filled"
                      helperText="This field cannot be edited. Contact support to change."
                    />
                    <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={isEditing ? editedProfile.address : profile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                        multiline
                        rows={2}
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                      <TextField
                        fullWidth
                        label="Business Description"
                        value={isEditing ? editedProfile.description || '' : profile.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={!isEditing}
                        variant={isEditing ? 'outlined' : 'filled'}
                        multiline
                        rows={3}
                      />                    </Box>
                  </Box>
                </Paper>{/* Product Types and Categories */}
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Product Types & Categories
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 3 
                  }}>
                    {/* Product Types Multi-Select */}
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Product Types</InputLabel>
                        <Select
                          multiple
                          value={isEditing ? editedSupplier.productTypes : supplier.productTypes}
                          onChange={(e) => {
                            const values = typeof e.target.value === 'string' 
                              ? e.target.value.split(',') 
                              : e.target.value;
                            setEditedSupplier(prev => ({
                              ...prev,
                              productTypes: values
                            }));
                          }}
                          input={<OutlinedInput label="Product Types" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip 
                                  key={value} 
                                  label={value} 
                                  size="small" 
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                              },
                            },
                          }}
                        >
                          {BACKEND_PRODUCT_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                              <Checkbox 
                                checked={(isEditing ? editedSupplier.productTypes : supplier.productTypes).indexOf(type) > -1} 
                              />
                              <ListItemText primary={type} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {/* Display selected types when not editing */}
                      {!isEditing && (
                        <Box sx={{ mt: 2 }}>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {supplier.productTypes.map((type, index) => (
                              <Chip
                                key={index}
                                label={type}
                                variant="outlined"
                                size="small"
                                color="primary"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>

                    {/* Categories Multi-Select */}
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Categories</InputLabel>
                        <Select
                          multiple
                          value={isEditing ? editedSupplier.categories : supplier.categories}
                          onChange={(e) => {
                            const values = typeof e.target.value === 'string' 
                              ? e.target.value.split(',') 
                              : e.target.value;
                            setEditedSupplier(prev => ({
                              ...prev,
                              categories: values
                            }));
                          }}
                          input={<OutlinedInput label="Categories" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip 
                                  key={value} 
                                  label={value} 
                                  size="small" 
                                  color="secondary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                              },
                            },
                          }}
                        >
                          {BACKEND_CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>
                              <Checkbox 
                                checked={(isEditing ? editedSupplier.categories : supplier.categories).indexOf(category) > -1} 
                              />
                              <ListItemText primary={category} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {/* Display selected categories when not editing */}
                      {!isEditing && (
                        <Box sx={{ mt: 2 }}>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {supplier.categories.map((category, index) => (
                              <Chip
                                key={index}
                                label={category}
                                variant="outlined"
                                size="small"
                                color="secondary"
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Box>{/* Verification Status */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', lg: '1 1 33.33%' }
            }}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Verification Status
                </Typography>
                
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <VerifiedIcon 
                      sx={{ 
                        color: profile.isVerified ? 'success.main' : 'grey.400',
                        fontSize: 20 
                      }} 
                    />
                    <Typography variant="body2">
                      {profile.isVerified ? 'Verified Supplier' : 'Pending Verification'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      {supplier.rating}/5.0 ({supplier.totalReviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2">
                      Member since {profile.joinedDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Supplier Badges
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {supplier.isGoldSupplier && (
                        <Chip 
                          label="Gold Supplier" 
                          color="warning" 
                          size="small" 
                          variant="filled"
                        />
                      )}
                      {supplier.isPremium && (
                        <Chip 
                          label="Premium" 
                          color="primary" 
                          size="small" 
                          variant="filled"
                        />
                      )}
                      {supplier.verified && (
                        <Chip 
                          label="Verified" 
                          color="success" 
                          size="small" 
                          variant="filled"
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              {/* Certifications */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Certifications
                </Typography>
                
                <Stack spacing={1}>
                  {profile.certifications.map((cert, index) => (
                    <Chip
                      key={index}
                      label={cert}
                      variant="outlined"
                      size="small"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                  ))}
                </Stack>
                  <Button
                  startIcon={<UploadIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, width: '100%' }}
                  onClick={() => setCertificateDialogOpen(true)}
                >
                  Upload Certificate
                </Button>
              </Paper>
            </Box>
            </Box>            {/* Business Statistics */}
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Business Performance
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: '1fr 1fr', 
                    md: '1fr 1fr 1fr 1fr' 
                  }, 
                  gap: 3 
                }}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                        {supplier.totalProducts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        {supplier.totalOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                        {supplier.successRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                        {supplier.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Rating
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            </Box>          </Box>
        </motion.div>
      </Container>

      {/* Certificate Upload Dialog */}
      <Dialog open={certificateDialogOpen} onClose={() => setCertificateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Upload Business Certificate</Typography>
            <IconButton onClick={() => setCertificateDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
                <br />
                Verification process: 2-3 business days
                <br />
                Required: Official government or accredited body issued certificates
              </Typography>
            </Alert>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Certificate Type</InputLabel>
              <Select
                value={certificateType}
                label="Certificate Type"
                onChange={(e) => setCertificateType(e.target.value)}
              >
                <MenuItem value="ISO 9001">ISO 9001 - Quality Management</MenuItem>
                <MenuItem value="ISO 14001">ISO 14001 - Environmental Management</MenuItem>
                <MenuItem value="ISO 45001">ISO 45001 - Occupational Health & Safety</MenuItem>
                <MenuItem value="CE Marking">CE Marking - European Conformity</MenuItem>
                <MenuItem value="UL Listed">UL Listed - Underwriters Laboratories</MenuItem>
                <MenuItem value="FDA Approval">FDA Approval - Food & Drug Administration</MenuItem>
                <MenuItem value="FCC Certification">FCC Certification - Federal Communications</MenuItem>
                <MenuItem value="RoHS Compliant">RoHS Compliant - Restriction of Hazardous Substances</MenuItem>
                <MenuItem value="Business License">Business License</MenuItem>
                <MenuItem value="Tax Certificate">Tax Registration Certificate</MenuItem>
                <MenuItem value="Other">Other Certification</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ 
              border: '2px dashed', 
              borderColor: 'primary.main', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center',
              backgroundColor: 'grey.50'
            }}>
              <input
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                id="certificate-file-input"
                type="file"
                multiple
                onChange={handleCertificateUpload}
              />
              <label htmlFor="certificate-file-input">
                <IconButton color="primary" aria-label="upload certificate" component="span" size="large">
                  <CloudUploadIcon sx={{ fontSize: 48 }} />
                </IconButton>
              </label>
              <Typography variant="h6" gutterBottom>
                Upload Certificate Files
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to select files or drag and drop
              </Typography>
            </Box>
            
            {uploadedCertificates.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Selected Files ({uploadedCertificates.length}):
                </Typography>
                {uploadedCertificates.map((file, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    mb: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => removeCertificateFile(index)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {certificateProgress > 0 && certificateProgress < 100 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Uploading... {certificateProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={certificateProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCertificateDialogOpen(false);
            setUploadedCertificates([]);
            setCertificateType('');
            setCertificateProgress(0);
          }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={processCertificateUpload}
            disabled={uploadedCertificates.length === 0 || !certificateType || certificateProgress > 0}
            startIcon={<UploadIcon />}
          >
            Upload & Submit for Verification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierBusinessProfile;
