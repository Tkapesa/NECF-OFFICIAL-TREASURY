import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  CloudUpload as UploadIcon,
  TrendingUp,
  Security,
  Speed,
  Receipt as ReceiptIcon,
  AttachMoney,
  CheckCircle,
  BarChart,
  Lock,
  CloudDone,
  TouchApp,
} from '@mui/icons-material';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 50%, #000000 100%)',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      {/* Animated background patterns */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px, 80px 80px',
          animation: 'drift 30s linear infinite',
          '@keyframes drift': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
        }}
      />
      
      {/* Floating elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
            '50%': { transform: 'scale(1.2)', opacity: 0.6 },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: { xs: 150, md: 250 },
          height: { xs: 150, md: 250 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite 2s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: { xs: 100, md: 180 },
          height: { xs: 100, md: 180 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          animation: 'pulse 10s ease-in-out infinite 4s',
        }}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4, lg: 8 }, position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            animation: 'fadeInUp 1s ease-out',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(40px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/necf-logo.png"
            alt="NECF Logo"
            sx={{
              width: { xs: 120, sm: 180, md: 220, lg: 260 },
              height: 'auto',
              mb: { xs: 2, sm: 3, md: 4 },
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) brightness(1.05)',
              animation: 'logoFloat 4s ease-in-out infinite',
              '@keyframes logoFloat': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-15px) rotate(2deg)' },
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'drop-shadow(0 25px 50px rgba(255,255,255,0.3)) brightness(1.15)',
                transform: 'scale(1.05)',
              },
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem', lg: '4.5rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE0E0 50%, #FFFFFF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 1.5, sm: 2 },
              letterSpacing: '-0.02em',
              px: { xs: 2, sm: 0 },
              textShadow: '0 0 40px rgba(255,255,255,0.3)',
              animation: 'shimmer 3s ease-in-out infinite',
              '@keyframes shimmer': {
                '0%, 100%': { filter: 'brightness(1)' },
                '50%': { filter: 'brightness(1.2)' },
              },
            }}
          >
            Treasury Management
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 1,
              fontWeight: 300,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Near East Christian Fellowship
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
              px: { xs: 3, sm: 2, md: 0 },
            }}
          >
            Streamlined receipt tracking and financial management system for transparent and efficient treasury operations
          </Typography>

          {/* Feature Pills */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: { xs: 5, sm: 6, md: 8 },
              px: { xs: 2, sm: 0 },
            }}
          >
            {[
              { icon: <Security />, text: 'Secure' },
              { icon: <Speed />, text: 'Fast' },
              { icon: <TrendingUp />, text: 'Analytics' },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  px: { xs: 2, sm: 2.5, md: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 600,
                  animation: `fadeInBounce ${1 + index * 0.2}s ease-out`,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  '@keyframes fadeInBounce': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '60%': { opacity: 1, transform: 'translateY(-5px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  },
                  '& svg': {
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  },
                }}
              >
                {feature.icon}
                {feature.text}
              </Box>
            ))}
          </Box>

          {/* Two Main Action Cards */}
          <Grid container spacing={{ xs: 3, sm: 3, md: 4 }} sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 1, sm: 2 }, justifyContent: 'center' }}>
            {/* Admin Dashboard Card */}
            <Grid item xs={12} sm={6} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: { xs: 3, md: 4 },
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.98)',
                  border: '3px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  width: '100%',
                  maxWidth: 400,
                  '&:hover': {
                    transform: { xs: 'translateY(-10px) scale(1.02)', md: 'translateY(-20px) scale(1.03)' },
                    boxShadow: '0 30px 60px rgba(107, 28, 35, 0.5)',
                    border: '3px solid #6B1C23',
                    '& .icon-box': {
                      transform: 'rotate(360deg) scale(1.15)',
                      boxShadow: '0 15px 40px rgba(107, 28, 35, 0.6)',
                    },
                    '&::after': {
                      opacity: 1,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #6B1C23 0%, #4A0E13 50%, #6B1C23 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmerBar 3s linear infinite',
                    '@keyframes shimmerBar': {
                      '0%': { backgroundPosition: '200% 0' },
                      '100%': { backgroundPosition: '-200% 0' },
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(107, 28, 35, 0.05) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                  },
                }}
                onClick={() => navigate('/admin')}
              >
                <Box
                  className="icon-box"
                  sx={{
                    width: { xs: 70, sm: 80, md: 100 },
                    height: { xs: 70, sm: 80, md: 100 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 10px 30px rgba(107, 28, 35, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                      animation: 'shine 3s infinite',
                      '@keyframes shine': {
                        '0%': { backgroundPosition: '200% 200%' },
                        '100%': { backgroundPosition: '-200% -200%' },
                      },
                    },
                  }}
                >
                  <AdminIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: '#1a1a1a', fontSize: { xs: '1.35rem', sm: '1.6rem', md: '2rem' } }}
                >
                  Admin Dashboard
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mb: { xs: 2, sm: 2.5, md: 3 }, lineHeight: 1.7, fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' } }}
                >
                  Manage receipts, approve submissions, view detailed analytics and reports
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 700,
                    py: { xs: 1.5, sm: 1.7, md: 1.8 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(107, 28, 35, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4A0E13 0%, #6B1C23 100%)',
                      boxShadow: '0 6px 20px rgba(107, 28, 35, 0.6)',
                    },
                  }}
                >
                  Enter Dashboard
                </Button>
              </Paper>
            </Grid>

            {/* Upload Receipt Card */}
            <Grid item xs={12} sm={6} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: { xs: 3, md: 4 },
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.98)',
                  border: '3px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  width: '100%',
                  maxWidth: 400,
                  '&:hover': {
                    transform: { xs: 'translateY(-10px) scale(1.02)', md: 'translateY(-20px) scale(1.03)' },
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
                    border: '3px solid #1a1a1a',
                    '& .icon-box': {
                      transform: 'rotate(360deg) scale(1.15)',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
                    },
                    '&::after': {
                      opacity: 1,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmerBar 3s linear infinite',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(26, 26, 26, 0.05) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                  },
                }}
                onClick={() => navigate('/upload')}
              >
                <Box
                  className="icon-box"
                  sx={{
                    width: { xs: 70, sm: 80, md: 100 },
                    height: { xs: 70, sm: 80, md: 100 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                      animation: 'shine 3s infinite',
                    },
                  }}
                >
                  <UploadIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: '#1a1a1a', fontSize: { xs: '1.35rem', sm: '1.6rem', md: '2rem' } }}
                >
                  Upload Receipt
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mb: { xs: 2, sm: 2.5, md: 3 }, lineHeight: 1.7, fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' } }}
                >
                  Submit receipts for approval with automatic OCR data extraction
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 700,
                    py: { xs: 1.5, sm: 1.7, md: 1.8 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
                    },
                  }}
                >
                  Upload Now
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            mt: { xs: 6, sm: 8, md: 10 },
            mb: { xs: 6, sm: 7, md: 8 },
            animation: 'fadeIn 1.5s ease-out',
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              mb: { xs: 3, sm: 4, md: 5 },
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Trusted Treasury Management
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ maxWidth: 1000, mx: 'auto' }}>
            {[
              { icon: <ReceiptIcon />, number: '1000+', label: 'Receipts Processed' },
              { icon: <AttachMoney />, number: '$50K+', label: 'Funds Tracked' },
              { icon: <CheckCircle />, number: '98%', label: 'Approval Rate' },
              { icon: <Speed />, number: '< 2min', label: 'Avg Processing' },
            ].map((stat, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: { xs: 2, md: 3 },
                    textAlign: 'center',
                    py: { xs: 2, sm: 2.5, md: 3 },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideUp ${0.8 + index * 0.1}s ease-out`,
                    position: 'relative',
                    overflow: 'hidden',
                    '@keyframes slideUp': {
                      from: { opacity: 0, transform: 'translateY(40px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                    },
                    '&:hover': {
                      transform: { xs: 'translateY(-6px) scale(1.03)', md: 'translateY(-12px) scale(1.05)' },
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: '2px solid rgba(107, 28, 35, 0.5)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                    <Box
                      sx={{
                        width: { xs: 45, sm: 55, md: 60 },
                        height: { xs: 45, sm: 55, md: 60 },
                        borderRadius: 2,
                        background: 'rgba(107, 28, 35, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: { xs: 1.5, sm: 2 },
                        color: 'white',
                      }}
                    >
                      {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 24, sm: 28, md: 32 } } })}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        mb: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.25rem' },
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            mt: { xs: 6, sm: 8, md: 10 },
            mb: { xs: 4, sm: 5, md: 6 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Why Choose Our System
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
              px: { xs: 3, sm: 2, md: 0 },
            }}
          >
            Powerful features designed to make treasury management effortless
          </Typography>

          <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }} sx={{ maxWidth: 1100, mx: 'auto' }}>
            {[
              {
                icon: <CloudDone />,
                title: 'Cloud-Based Storage',
                description: 'Secure cloud storage with automatic backups and 24/7 availability',
              },
              {
                icon: <Lock />,
                title: 'Bank-Level Security',
                description: 'Enterprise-grade encryption and authentication protocols',
              },
              {
                icon: <BarChart />,
                title: 'Real-Time Analytics',
                description: 'Comprehensive dashboards with detailed financial insights',
              },
              {
                icon: <TouchApp />,
                title: 'Easy to Use',
                description: 'Intuitive interface designed for quick adoption and daily use',
              },
              {
                icon: <TrendingUp />,
                title: 'Smart Reports',
                description: 'Automated reporting with customizable views and exports',
              },
              {
                icon: <CheckCircle />,
                title: 'Quick Approvals',
                description: 'Streamlined approval workflow with notification system',
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: { xs: 3, sm: 3.5, md: 4 },
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: { xs: 2, md: 3 },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeIn ${1 + index * 0.1}s ease-out`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #6B1C23 0%, #4A0E13 100%)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease',
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      transform: { xs: 'translateY(-6px)', md: 'translateY(-12px)' },
                      border: '2px solid rgba(107, 28, 35, 0.4)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 55, sm: 65, md: 70 },
                      height: { xs: 55, sm: 65, md: 70 },
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: { xs: 2, sm: 2.5, md: 3 },
                      color: 'white',
                    }}
                  >
                    {React.cloneElement(feature.icon, { sx: { fontSize: { xs: 28, sm: 32, md: 36 } } })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.7,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action Banner */}
        <Box
          sx={{
            mt: { xs: 6, sm: 8, md: 10 },
            mb: { xs: 4, sm: 5, md: 6 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Paper
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              borderRadius: { xs: 3, md: 4 },
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(107, 28, 35, 0.3)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(107, 28, 35, 0.1) 0%, rgba(74, 14, 19, 0.1) 100%)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                  px: { xs: 2, sm: 0 },
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: { xs: 3, sm: 4 },
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  px: { xs: 3, sm: 2, md: 0 },
                }}
              >
                Join Near East Christian Fellowship's modern treasury management system today
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/upload')}
                  sx={{
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1.5, sm: 1.8, md: 2 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
                    boxShadow: '0 8px 24px rgba(107, 28, 35, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4A0E13 0%, #6B1C23 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(107, 28, 35, 0.6)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Submit Receipt Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/admin')}
                  sx={{
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1.5, sm: 1.8, md: 2 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Access Dashboard
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.95rem',
            }}
          >
            © 2025 Near East Christian Fellowship • Treasury Management System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
