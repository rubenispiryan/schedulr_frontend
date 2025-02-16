import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, Toolbar, Typography} from '@mui/material';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear Django token
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isBusinessOwner = localStorage.getItem('role') === 'BUSINESS_OWNER';

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