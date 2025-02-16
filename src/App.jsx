import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';

import Navbar from './components/Navbar';
import AuthWrapper from './components/AuthWrapper';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import BusinessPage from "./pages/BusinessPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import BusinessSignupPage from "./pages/BusinessSignupPage.jsx";
import BusinessDashboardPage from "./pages/BusinessDashboardPage.jsx";

// Create a basic theme
const theme = createTheme({
  palette: {
    primary: {main: '#1976d2'},
    secondary: {main: '#dc004e'},
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh' // Full viewport height
        }}>
          <Navbar/>

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
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignupPage/>}/>
              <Route path="/business-signup" element={<BusinessSignupPage/>}/>

              <Route path="/" element={
                <AuthWrapper>
                  <HomePage/>
                </AuthWrapper>
              }/>

              <Route path="/dashboard" element={
                <AuthWrapper>
                  <BusinessDashboardPage/>
                </AuthWrapper>
              }/>

              <Route path="/profile" element={
                <AuthWrapper>
                  <ProfilePage/>
                </AuthWrapper>
              }/>
              <Route
                path="/businesses/:id"
                element={
                  <AuthWrapper>
                    <BusinessPage/>
                  </AuthWrapper>
                }
              />
              <Route
                path="/book/:serviceId"
                element={
                  <AuthWrapper>
                    <BookingPage/>
                  </AuthWrapper>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}