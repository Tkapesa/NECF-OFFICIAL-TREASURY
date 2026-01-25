/**
 * Upload Page (User Side)
 */
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import ReceiptUploadForm from '../components/ReceiptUploadForm';

export default function UploadPage() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #f7f7f9 0%, #eceff3 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        overflowY: 'auto',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(600px 300px at 10% 0%, rgba(107, 28, 35, 0.08), transparent 70%),' +
            'radial-gradient(500px 300px at 90% 10%, rgba(74, 14, 19, 0.06), transparent 70%)',
          pointerEvents: 'none',
          animation: 'glowShift 12s ease-in-out infinite',
        },
        '@keyframes glowShift': {
          '0%': { opacity: 0.6, transform: 'translateY(0px)' },
          '50%': { opacity: 0.9, transform: 'translateY(-6px)' },
          '100%': { opacity: 0.6, transform: 'translateY(0px)' },
        },
      }}
    >
      {/* Header */}
      <AppBar 
        position="sticky"
        top={0}
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
          zIndex: 10,
          animation: 'dropIn 0.6s ease-out',
          '@keyframes dropIn': {
            from: { opacity: 0, transform: 'translateY(-10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Toolbar sx={{ py: { xs: 0.5, sm: 1 }, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flexGrow: 1 }}>
            <img 
              src="/necf-logo.png" 
              alt="NECF Logo" 
              style={{ 
                width: window.innerWidth < 600 ? '40px' : '50px',
                height: window.innerWidth < 600 ? '40px' : '50px',
                objectFit: 'contain' 
              }} 
            />
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
              >
                Near East Christian Fellowship
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Treasury Management System
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box 
        sx={{ 
          py: { xs: 3, sm: 4, md: 6 }, 
          px: { xs: 2, sm: 3, md: 4 }, 
          maxWidth: '900px', 
          margin: '0 auto', 
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, sm: 4, md: 5 },
            animation: 'fadeIn 0.8s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box 
            sx={{ 
              display: 'inline-block',
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
              mb: { xs: 2, sm: 2.5, md: 3 },
              boxShadow: '0 8px 24px rgba(107, 28, 35, 0.3)',
              animation: 'floatLogo 5s ease-in-out infinite',
            }}
          >
            <img 
              src="/necf-logo.png" 
              alt="NECF Logo" 
              style={{ 
                width: window.innerWidth < 600 ? '60px' : window.innerWidth < 900 ? '80px' : '100px',
                height: window.innerWidth < 600 ? '60px' : window.innerWidth < 900 ? '80px' : '100px',
                objectFit: 'contain',
                display: 'block'
              }} 
            />
          </Box>
          
          <Typography 
            variant="h3" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #6B1C23 0%, #4A0E13 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              animation: 'titleGlow 4s ease-in-out infinite',
            }}
          >
            Submit Your Receipt
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Upload your receipt and fill in the details below
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Your submission will be reviewed by the treasury team
          </Typography>
        </Box>

        {/* Upload Form */}
        <Box 
          sx={{
            animation: 'slideUp 0.8s ease-out 0.2s both',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <ReceiptUploadForm />
        </Box>

        {/* Footer Info */}
        <Box 
          sx={{ 
            mt: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            animation: 'fadeIn 1s ease-out 0.4s both',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            © 2025 Near East Christian Fellowship. All rights reserved.
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              mt: 1,
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            For assistance, please contact the treasury department
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
