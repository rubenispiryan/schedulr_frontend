import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    favorite_businesses: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data from Django endpoint
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        });
        setUserData({
          email: response.data.email,
          phone: response.data.phone || '',
          favorite_businesses: response.data.favorite_businesses
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <PersonOutlineOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Your Profile
          </Typography>

          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <TextField
              label="Email"
              value={userData.email}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
            />

            <TextField
              label="Phone Number"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ mt: 3, px: 4, py: 1.5 }}
            >
              Save Changes
            </Button>

            <Typography variant="h6" sx={{ mt: 6, mb: 2, color: 'text.secondary' }}>
              ❤️ Favorite Businesses
            </Typography>

            <List sx={{ width: '100%' }}>
              {userData.favorite_businesses.map((business) => (
                <ListItem
                  key={business.id}
                  sx={{
                    bgcolor: 'action.hover',
                    mb: 1,
                    borderRadius: 1
                  }}
                >
                  <ListItemText
                    primary={business.name}
                    secondary={business.address}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}