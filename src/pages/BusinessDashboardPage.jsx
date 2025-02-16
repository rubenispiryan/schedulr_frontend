import { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Button, Typography, TextField, Paper, Tabs, Tab } from '@mui/material';
import ServiceList from '../components/ServiceList';
import StaffList from '../components/StaffList';
import api from '../services/api';

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get('/businesses/');
        if (response.data.length === 0 || !response.data[0].id) {
          setError('No business found');
          return;
        }
        if (response.data.length !== 1) {
          setError('Failed to find unique business for the user');
          return;
        }
        response.data = response.data[0];
        setBusiness(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
          phone: response.data.phone
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateBusiness = async () => {
    try {
      const response = await api.put(`/businesses/${business.id}/`, formData);
      setBusiness(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update business');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Business Dashboard</Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Business Information" />
        <Tab label="Services" />
        <Tab label="Staff" />
      </Tabs>

      {tabValue === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Business Details</Typography>
            <Button
              variant="contained"
              onClick={editMode ? handleUpdateBusiness : () => setEditMode(true)}
            >
              {editMode ? 'Save Changes' : 'Edit'}
            </Button>
          </Box>

          {editMode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Business Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Name:</strong> {business.name}</Typography>
              <Typography><strong>Address:</strong> {business.address}</Typography>
              <Typography><strong>Phone:</strong> {business.phone}</Typography>
            </Box>
          )}
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <ServiceList businessId={business?.id} />
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <StaffList businessId={business?.id} />
        </Paper>
      )}
    </Box>
  );
}