import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear Django token
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <Toolbar>
        <Typography color="inherit" component={Link} to="/" variant="h6" sx={{ flexGrow: 1, fontWeight: 700, textTransform: 'none' }}>
          ✂️ BookMe
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/profile" sx={{ textTransform: 'none' }}>
                👤 Profile
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
                🚪 Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none' }}>
                🔑 Login
              </Button>
              <Button color="inherit" component={Link} to="/signup" sx={{ textTransform: 'none' }}>
                📝 Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}