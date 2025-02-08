// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  FormHelperText
} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/registration/`,
        {
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
          phone: formData.phone,
        }
      );

      if (response.data.key) {
        localStorage.setItem('token', response.data.key);
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{
        p: 4,
        mt: 8,
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{
            m: 1,
            bgcolor: 'secondary.main',
            width: 56,
            height: 56
          }}>
            <HowToRegOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}>
            Create New Account
          </Typography>

          {errors.non_field_errors && (
            <FormHelperText error sx={{ mb: 2 }}>
              {errors.non_field_errors[0]}
            </FormHelperText>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email?.[0]}
              required
            />

            <TextField
              variant="outlined"
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone?.[0]}
              required
            />

            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              name="password1"
              type="password"
              value={formData.password1}
              onChange={handleChange}
              error={!!errors.password1}
              helperText={errors.password1?.[0]}
              required
            />

            <TextField
              variant="outlined"
              fullWidth
              label="Confirm Password"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              error={!!errors.password2}
              helperText={errors.password2?.[0]}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              Create Account
            </Button>

            <Typography variant="body2" sx={{
              mt: 2,
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Sign in here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}