import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import api from "../services/api.js";

const StaffList = ({businessId}) => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [staffDetails, setStaffDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    services: [],
    role: '',
    business: businessId
  });

  const ROLE_CHOICES = {
    BARBER: "Barber",
    GARDENER: "Gardener",
    PLUMBER: "Plumber",
    ELECTRICIAN: "Electrician",
    MECHANIC: "Mechanic",
    ADMIN: "Admin"
  };


  useEffect(() => {
    const fetchStaffDetails = async (staff) => {
      try {
        if (!staffDetails[staff.id]) {
          const response = await api.get(`/users/${staff.user}/`);
          const servicesResponse = await Promise.all(
            staff.services.map(async (serviceId) =>
              (await api.get(`/services/${serviceId}/`)).data));
          setStaffDetails((prevState) => ({
            ...prevState,
            [staff.id]: {
              name: response.data.first_name,
              services: servicesResponse,
            }, // Store name for each staff using staff.id as the key
          }));
        }
      } catch (err) {
        console.error('Error fetching staff details:', err);
      }
    };

    // Fetch details for all staff members
    staffMembers.forEach((staff) => {
      if (!staffDetails[staff.id]) {
        console.log(staffDetails[staff.id]);
        console.log(!staffDetails[staff.id]);
        fetchStaffDetails(staff);
      }
    });
  }, [staffMembers, staffDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, servicesRes] = await Promise.all([
          api.get(`/staff/`),
          api.get('/services/')
        ]);
        setStaffMembers(staffRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    if (businessId) fetchData();
  }, [businessId]);

  const handleOpenModal = (staff = null) => {
    setEditingStaff(staff);
    setFormData({
      email: staff?.user?.email || '',
      password: '',
      confirmPassword: '',
      name: staff?.name || '',
      services: staff?.services?.map(s => s.id) || [],
      role: staff?.role || '',
      business: businessId
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      services: [],
      role: '',
      business: businessId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userData = {
        email: formData.email,
        password1: formData.password,
        password2: formData.password,
        role: 'STAFF',
        first_name: formData.name,
      };

      // First create the user
      const userResponse = await api.post('/auth/registration/', userData);

      // Temporarily change token
      const token = localStorage.getItem('token');
      localStorage.setItem('token', userResponse.data.key);

      // Fetch user details
      const userDetailsResponse = await api.get('/users/me/');
      localStorage.setItem('token', token);

      // Then create the staff member
      const staffData = {
        services: formData.services,
        business: businessId,
        user: userDetailsResponse.data.id,
        role: formData.role
      };

      const endpoint = editingStaff ? `/staff/${editingStaff.id}/` : '/staff/';
      const method = editingStaff ? 'put' : 'post';

      const staffResponse = await api[method](endpoint, staffData);

      // Update state
      if (editingStaff) {
        setStaffMembers(staffMembers.map(s => s.id === editingStaff.id ? staffResponse.data : s));
      } else {
        setStaffMembers([...staffMembers, staffResponse.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to save staff member');
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${staffId}/`);
        setStaffMembers(staffMembers.filter(s => s.id !== staffId));
      } catch (err) {
        setError('Failed to delete staff member');
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
        Add Staff Member
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
          {staffMembers.map(staff => (
            <Grid
              item
              key={staff.id}
              sx={{
                display: 'inline-flex', // Force horizontal layout
                flexShrink: 0, // Prevent cards from shrinking
              }}
            >
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography variant="h6">{staffDetails[staff.id]?.name || 'Loading...'}</Typography>
                  <Typography variant="body2">
                    {ROLE_CHOICES[staff.role]}
                  </Typography>
                  <Typography
                    variant="body2" sx={{mt: 1}}>
                    {console.log(staffDetails)}
                    Assigned Services: {staffDetails[staff.id]?.services.map(s => s.name).join(', ') || 'None'}
                  </Typography>
                  <Box sx={{mt: 2}}>
                    <Button
                      startIcon={<Edit/>}
                      onClick={() => handleOpenModal(staff)}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Delete/>}
                      color="error"
                      onClick={() => handleDelete(staff.id)}
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
            {editingStaff ? 'Edit Staff Member' : 'New Staff Member'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              label="Password"
              fullWidth
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              label="Confirm Password"
              fullWidth
              required
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              label="Staff Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{mb: 2}}
            />
            <FormControl fullWidth sx={{mb: 2}}>
              <InputLabel>Assigned Services</InputLabel>
              <Select
                multiple
                value={formData.services}
                onChange={(e) => setFormData({...formData, services: e.target.value})}
                label="Assigned Services"
                variant="outlined"
              >
                {services.map(service => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{mb: 2}}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                label="Role"
                variant="outlined"
              >
                {Object.entries(ROLE_CHOICES).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingStaff ? 'Save Changes' : 'Create Staff'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default StaffList;