import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  CircularProgress,
  Alert, Box
} from '@mui/material';
import api from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/users/favorites/');
        setFavorites(response.data);
      } catch (err) {
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (businessId) => {
    try {
      await api.delete(`/businesses/${businessId}/favorite/`);
      setFavorites(favorites.filter(b => b.id !== businessId));
    } catch (err) {
      setError('Failed to remove favorite');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Favorite Businesses
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {favorites.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No favorite businesses yet
        </Typography>
      ) : (
        <List>
          {favorites.map((business) => (
            <ListItem
              key={business.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { boxShadow: 3 }
              }}
            >
              <ListItemText
                primary={business.name}
                secondary={business.address}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveFavorite(business.id)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}