import {useEffect, useState} from 'react';
import api from '../services/api';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Favorites from "../components/Favorites.jsx";
import BookingHistory from "../components/BookingHistory.jsx";
import UserRole from "../constants/roles.js";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    favorite_businesses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch user data from Django endpoint
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me/');
        setUserData({
          email: response.data.email,
          phone: response.data.phone || '',
          favorite_businesses: response.data.favorite_businesses || []
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch('/users/me/', {
        phone: userData.phone
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to save changes');
    }
  };

  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
        <CircularProgress size={60}/>
      </Box>
    );
  }

  const isCustomer = localStorage.getItem('role') === UserRole.CUSTOMER;

  return (
    <Box sx={{display: 'flex'}}>
      {isCustomer ?
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{mb: 4}}
          >
            <Tab label="Booking History"/>
            <Tab label="Favorites"/>
          </Tabs>

          {tabValue === 0 && <BookingHistory/>}
          {tabValue === 1 && <Favorites/>}
        </Box> : null
      }
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '80vh',
        alignItems: 'center',
        width: isCustomer ? '60%' : '100%',
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            margin: '0 auto'
          }}>
            <Avatar sx={{
              m: 2,
              bgcolor: 'primary.main',
              width: 56,
              height: 56
            }}>
              <PersonOutlineOutlinedIcon fontSize="large"/>
            </Avatar>

            <Typography variant="h4" sx={{
              mb: 4,
              fontWeight: 600,
              color: 'text.primary'
            }}>
              Your Profile
            </Typography>

            {error && (
              <Alert severity="error" sx={{width: '100%', maxWidth: 500, mb: 2}}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{width: '100%', maxWidth: 500, mb: 2}}>
                Profile updated successfully!
              </Alert>
            )}

            <Box sx={{
              width: '100%',
              maxWidth: 500,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <TextField
                label="Email"
                value={userData.email}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.secondary'
                  }
                }}
              />

              <TextField
                label="Phone Number"
                value={userData.phone}
                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{
                  maxLength: 15
                }}
              />

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  alignSelf: 'flex-start'
                }}
              >
                Save Changes
              </Button>

              {isCustomer ? (
                <>
                  <Typography variant="h6" sx={{
                    mt: 4,
                    mb: 2,
                    color: 'text.secondary',
                    fontWeight: 500
                  }}>
                    ❤️ Favorite Businesses
                  </Typography>
                  {userData.favorite_businesses.length > 0 ? (
                    <List sx={{width: '100%'}}>
                      {userData.favorite_businesses.map((business) => (
                        <ListItem
                          key={business.id}
                          sx={{
                            bgcolor: 'action.hover',
                            mb: 1,
                            borderRadius: 2,
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemText
                            primary={business.name}
                            primaryTypographyProps={{fontWeight: 500}}
                            secondary={business.address}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{color: 'text.disabled'}}>
                      No favorite businesses yet
                    </Typography>
                  )}
                </>) : null}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}