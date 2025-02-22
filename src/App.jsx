import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
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
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import UserRole from "./constants/roles.js";
import StaffDashboardPage from "./pages/StaffDashboardPage.jsx";

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

const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

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
              <Route path="/login" element={
                token && window.location.pathname === "/login" ?
                  <Navigate to="/"/> :
                  <LoginPage/>}
              />
              <Route path="/signup" element={token ? <Navigate to="/"/> : <SignupPage/>}/>
              <Route path="/business-signup" element={token ? <Navigate to="/"/> : <BusinessSignupPage/>}/>

              <Route path="/" element={
                <AuthWrapper>
                  {role === UserRole.BUSINESS_OWNER ? <BusinessDashboardPage/> : <HomePage/>}
                </AuthWrapper>
              }/>

              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={[UserRole.BUSINESS_OWNER]}>
                  <AuthWrapper>
                    <BusinessDashboardPage/>
                  </AuthWrapper>
                </ProtectedRoute>
              }/>

              {/* TODO: add business user, staff user profile*/}
              <Route path="/profile" element={
                <AuthWrapper>
                  <ProfilePage/>
                </AuthWrapper>
              }/>

              <Route
                path="/businesses/:id"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                    <AuthWrapper>
                      <BusinessPage/>
                    </AuthWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/book/:serviceId"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                    <AuthWrapper>
                      <BookingPage/>
                    </AuthWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/staff-dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STAFF]}>
                    <AuthWrapper>
                      <StaffDashboardPage/>
                    </AuthWrapper>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}