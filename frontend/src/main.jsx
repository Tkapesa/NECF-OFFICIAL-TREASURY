import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Custom Professional Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8c9aed',
      dark: '#4d5fc4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9165b8',
      dark: '#5a3780',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    info: {
      main: '#4facfe',
      light: '#80c7ff',
      dark: '#2196f3',
    },
    warning: {
      main: '#fee140',
      light: '#fff176',
      dark: '#fbc02d',
    },
    error: {
      main: '#f5576c',
      light: '#ff8a95',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 14px 28px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.2)',
    '0px 18px 36px rgba(0,0,0,0.22)',
    '0px 20px 40px rgba(0,0,0,0.24)',
    '0px 22px 44px rgba(0,0,0,0.26)',
    '0px 24px 48px rgba(0,0,0,0.28)',
    '0px 26px 52px rgba(0,0,0,0.3)',
    '0px 28px 56px rgba(0,0,0,0.32)',
    '0px 30px 60px rgba(0,0,0,0.34)',
    '0px 32px 64px rgba(0,0,0,0.36)',
    '0px 34px 68px rgba(0,0,0,0.38)',
    '0px 36px 72px rgba(0,0,0,0.4)',
    '0px 38px 76px rgba(0,0,0,0.42)',
    '0px 40px 80px rgba(0,0,0,0.44)',
    '0px 42px 84px rgba(0,0,0,0.46)',
    '0px 44px 88px rgba(0,0,0,0.48)',
    '0px 46px 92px rgba(0,0,0,0.5)',
    '0px 48px 96px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
