import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ServiceCard from '../components/ServiceCard';
import api from '../services/api';
import FavoriteButton from "../components/FavoriteButton.jsx";

export default function BusinessPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get(`/businesses/${id}/`);
        setBusiness(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load business details');
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: 150,
        overflow: 'hidden',
        mb: 3
      }}>
        <img
          src={business.image || '/images/placeholder-business.jpg'}
          alt={business.name}
          style={{
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '8px',
        }}
        />
      </Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {business.name}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {business.address}
      </Typography>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Available Services
      </Typography>

      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography gutterBottom variant="h6" component="div">
          {business.name}
        </Typography>
        <FavoriteButton businessId={business.id}/>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {business.address}
      </Typography>
      {business.services?.map(service => (
        <ServiceCard key={service.id} service={{ ...service, id: service.id }} />
      ))}
    </Box>
  );
}