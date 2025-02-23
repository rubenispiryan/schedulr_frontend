import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, Toolbar, Typography} from '@mui/material';
import UserRole from "../constants/roles.js";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => navigate('/login'), 0);
  };

  // TODO: move to the constants file
  const isBusinessOwner = localStorage.getItem('role') === UserRole.BUSINESS_OWNER;
  const isStaff = localStorage.getItem('role') === UserRole.STAFF;

  return (
    <AppBar position="fixed" sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <Toolbar>
        <Typography color="inherit" variant="h6" sx={{flexGrow: 1, fontWeight: 700}}>
          ✂️ BookMe
        </Typography>
        <Box sx={{
          display: 'flex',
          gap: 2,
          '& .MuiButton-root': {color: 'inherit'} // Apply `inherit` color to all buttons
        }}>
          {isLoggedIn ? (
            <>
              {isBusinessOwner ? (
                <>
                  <Button component={Link} to="/dashboard">Dashboard</Button>
                </>
              ) : isStaff ? (
                <>
                  <Button component={Link} to="/staff-dashboard">Dashboard</Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/">Home</Button>
                  <Button component={Link} to="/profile">Profile</Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                🚪 Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                🔑 Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                📝 Sign Up
              </Button>
              <Button color="inherit" component={Link} to="/business-signup">
                🏢 Business Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}