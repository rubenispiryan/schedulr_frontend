import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import BusinessList from '../components/BusinessList';
import api from '../services/api';

export default function HomePage() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get('/businesses/');
        setBusinesses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load businesses');
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Filter businesses based on search
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Local Businesses
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Search businesses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      <BusinessList businesses={filteredBusinesses} />
    </Box>
  );
}