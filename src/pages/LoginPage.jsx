import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Alert, Avatar, Box, Button, Container, Paper, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from "../services/api.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call Django's login endpoint (adjust URL if needed)
      // TODO: change all requests to use api
      const response = await axios.post(`${API_BASE_URL}/api/auth/login/`, {
        email,
        password
      });
      // Save token to localStorage (matches Django's TokenAuthentication)
      localStorage.setItem('token', response.data.key);

      const userResponse = await api.get('/users/me/');
      localStorage.setItem('userId', userResponse.data.id); // Store user ID
      localStorage.setItem('role', userResponse.data.role);

      if (userResponse.data.role === 'BUSINESS_OWNER') {
        navigate('/dashboard'); // Redirect to business dashboard
      } else {
        navigate('/'); // Redirect to home
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{position: 'fixed', top: 70, left: 0, right: 0, zIndex: 1000}}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 2,
              boxShadow: 3
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
      <Paper elevation={3} sx={{p: 4, mt: 8, borderRadius: 2}}>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb: 3}}>
            Welcome Back!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{width: '100%'}}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2, py: 1.5}}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}