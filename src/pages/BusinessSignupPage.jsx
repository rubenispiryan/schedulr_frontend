import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Avatar, Box, Button, Container, FormHelperText, Paper, TextField, Typography} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import api from "../services/api.js";

// TODO: make phone not required
// TODO: save business id in local storage if user is business owner

export default function BusinessSignupPage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: '',
    password1: '',
    password2: '',
    phone: '',
  });
  const [businessData, setBusinessData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();



  const handleNext = (e) => {
    e.preventDefault();
    // Validate user data before proceeding
    if (!userData.email || !userData.password1 || !userData.password2) {
      setErrors({ non_field_errors: ['Please fill all required fields'] });
      return;
    }
    if (userData.password1 !== userData.password2) {
      setErrors({ non_field_errors: ['Passwords do not match'] });
      return;
    }
    setStep(2);
  }

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/registration/', {
        ...userData,
        role: 'BUSINESS_OWNER'
      });

      if (response.data.key) {
        localStorage.setItem('token', response.data.key);

        await api.post('/businesses/', businessData);
        navigate('/dashboard');

        // Get user ID and store it
        const userResponse = await api.get('/users/me/');
        localStorage.setItem('userId', userResponse.data.id);
        localStorage.setItem('role', userResponse.data.role);
        setStep(2); // Proceed to business creation
      }
    } catch (err) {
      setErrors(err.response?.data || {non_field_errors: ['Registration failed. Please try again.']});
    }
  };

  const handleUserChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: null});
  };

  const handleBusinessChange = (e) => {
    setBusinessData({...businessData, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: null});
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
            <StorefrontOutlinedIcon fontSize="large"/>
          </Avatar>

          <Typography component="h1" variant="h5" sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}>
            {step === 1 ? 'Business Account Setup' : 'Business Information'}
          </Typography>

          {errors.non_field_errors && (
            <FormHelperText error sx={{mb: 2}}>
              {errors.non_field_errors[0]}
            </FormHelperText>
          )}

          {step === 1 ? (
            <Box component="form" sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleUserChange}
                error={!!errors.email}
                helperText={errors.email?.[0]}
                required
              />

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleUserChange}
                error={!!errors.phone}
                helperText={errors.phone?.[0]}
              />

              <TextField
                label="Password"
                name="password1"
                type="password"
                value={userData.password1}
                onChange={handleUserChange}
                error={!!errors.password1}
                helperText={errors.password1?.[0]}
                required
              />

              <TextField
                label="Confirm Password"
                name="password2"
                type="password"
                value={userData.password2}
                onChange={handleUserChange}
                error={!!errors.password2}
                helperText={errors.password2?.[0]}
                required
              />

              <Button
                onClick={handleNext}
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
                  '&:hover': {boxShadow: 'none'}
                }}
              >
                Next: Business Details
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <TextField
                label="Business Name"
                name="name"
                value={businessData.name}
                onChange={handleBusinessChange}
                error={!!errors.name}
                helperText={errors.name?.[0]}
                required
              />

              <TextField
                label="Business Address"
                name="address"
                value={businessData.address}
                onChange={handleBusinessChange}
                error={!!errors.address}
                helperText={errors.address?.[0]}
                required
              />

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={businessData.phone}
                onChange={handleBusinessChange}
                error={!!errors.phone}
                helperText={errors.phone?.[0]}
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
                  '&:hover': {boxShadow: 'none'}
                }}
              >
                Complete Registration
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                sx={{mt: 1}}
              >
                Back to Account Details
              </Button>
            </Box>
          )}

          <Typography variant="body2" sx={{mt: 2}}>
            Already have an account?{' '}
            <Button
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {backgroundColor: 'transparent'}
              }}
            >
              Sign in here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}