import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../services/api';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await api.get(`/services/${serviceId}/`);
        const staffResponse = await api.get(`/businesses/${serviceResponse.data.business}/staff/`);

        setStaffMembers(staffResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load booking data');
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId]);

  // Fetch availability when staff/date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedStaff && selectedDate) {
        try {
          const response = await api.post('/staff/availability/', {
            staff_id: selectedStaff,
            date: selectedDate.toISOString().split('T')[0]
          });
          setTimeSlots(response.data.available_slots);
        } catch (err) {
          setError('Failed to load availability');
        }
      }
    };
    fetchAvailability();
  }, [selectedStaff, selectedDate]);

  const handleSubmit = async () => {
    try {
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startTime.setHours(hours, minutes);
      await api.post('/bookings/', {
        user: userId,
        service: serviceId,
        staff: selectedStaff,
        start_time: startTime.toISOString()
      });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError('Booking failed - please try again');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 1000 }}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 2,
              boxShadow: 3
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 2,
              boxShadow: 3
            }}
          >
            Booking confirmed! Redirecting to profile...
          </Alert>
        )}
      </Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Book Service
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Staff Member</InputLabel>
        <Select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          label="Staff Member"
         >
          {staffMembers.map((staff) => (
            <MenuItem key={staff.id} value={staff.id}>
              {staff.user.first_name} ({staff.role})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Select Date</Typography>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          inline
         showMonthYearDropdown/>
      </Box>

      {timeSlots.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Available Times</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'contained' : 'outlined'}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={!selectedTime}
      >
        Confirm Booking
      </Button>
    </Box>
  );
}