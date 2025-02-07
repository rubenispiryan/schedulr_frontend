import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';

import Navbar from './components/Navbar';
import AuthWrapper from './components/AuthWrapper';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

// Create a basic theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5', // Add light gray background
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh' // Full viewport height
        }}>
          <Navbar />

          {/* Main content container */}
          <Box component="main" sx={{
            flexGrow: 1,
            py: 4,  // Vertical padding
            px: 2,  // Horizontal padding
            mt: 2,   // Margin top to account for fixed navbar
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '800px',
          }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/" element={
                <AuthWrapper>
                  <HomePage />
                </AuthWrapper>
              }/>

              <Route path="/profile" element={
                <AuthWrapper>
                  <ProfilePage />
                </AuthWrapper>
              }/>
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}