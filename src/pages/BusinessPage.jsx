import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ServiceCard from '../components/ServiceCard';
import api from '../services/api';

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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {business.name}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {business.address}
      </Typography>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Available Services
      </Typography>

      {business.services?.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </Box>
  );
}