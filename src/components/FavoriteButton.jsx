import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../services/api';

export default function FavoriteButton({ businessId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await api.get(`/businesses/${businessId}/favorite/`);
        setIsFavorite(response.data.is_favorite === true);
      } catch {
        setIsFavorite(false);
      } finally {
        setLoading(false);
      }
    };
    checkFavorite();
  }, [businessId]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/businesses/${businessId}/favorite/`);
      } else {
        await api.post(`/businesses/${businessId}/favorite/`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to update favorite:', err);
    }
  };

  if (loading) return null;

  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton onClick={handleToggleFavorite} color="error">
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}