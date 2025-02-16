import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, CircularProgress, Grid, Modal, TextField, Typography} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import api from "../services/api.js";

const ServiceList = ({businessId}) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    business: businessId
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get(`/services/`);
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    };
    if (businessId) fetchServices();
  }, [businessId]);

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setFormData({
      name: service?.name || '',
      duration: service?.duration || '',
      price: service?.price || '',
      business: businessId
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({name: '', duration: '', price: '', business: businessId});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        business: businessId
      };

      if (editingService) {
        const response = await api.put(
          `/services/${editingService.id}/`,
          serviceData
        );
        setServices(services.map(s => s.id === editingService.id ? response.data : s));
      } else {
        const response = await api.post(
          `/services/`,
          serviceData
        );
        setServices([...services, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Failed to save service');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${serviceId}/`);
        setServices(services.filter(s => s.id !== serviceId));
      } catch (err) {
        setError('Failed to delete service');
      }
    }
  };

  if (isLoading) return <CircularProgress/>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<Add/>}
        onClick={() => handleOpenModal()}
        sx={{mb: 2, width: '100%'}}
      >
        Add Service
      </Button>
      <Box sx={{
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        },
      }}>
        <Grid
          container
          spacing={2}
          sx={{
            flexWrap: 'nowrap', // Prevent wrapping to new line
            padding: '0 8px', // Add horizontal padding
          }}
        >
          {services.map(service => (
            <Grid
              item
              key={service.id}
              sx={{
                display: 'inline-flex', // Force horizontal layout
                flexShrink: 0, // Prevent cards from shrinking
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{service.name}</Typography>
                  <Typography>Duration: {service.duration} mins</Typography>
                  <Typography>Price: ${Number(service.price).toFixed(2)}</Typography>
                  <Box sx={{mt: 2}}>
                    <Button
                      startIcon={<Edit/>}
                      onClick={() => handleOpenModal(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Delete/>}
                      color="error"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}>
          <Typography variant="h6" sx={{mb: 2}}>
            {editingService ? 'Edit Service' : 'New Service'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Service Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              required
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              sx={{mb: 2}}
            />
            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingService ? 'Save Changes' : 'Create Service'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServiceList;