import {useEffect, useState} from 'react';
import {Alert, Box, Button, Chip, CircularProgress, List, ListItem, ListItemText, Typography} from '@mui/material';
import api from '../services/api';
import {format, parseISO} from 'date-fns';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffNames, setStaffNames] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/history/');

        setBookings(response.data);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    // Fetch staff names for each booking
    const fetchStaffNames = async () => {
      const names = {};
      for (const booking of bookings) {
        try {
          names[booking.id] = await getCurrentStaffName(booking.id);
        } catch (err) {
          setError('Failed to load staff name');
        }
      }
      setStaffNames(names);
    };

    if (bookings.length > 0) {
      fetchStaffNames();
    }
  }, [bookings]);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}/`);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const getCurrentStaffName = async (bookingId) => {
    const bookingResponse = await api.get(`/bookings/${bookingId}/`);
    const staffId = bookingResponse.data.staff;
    const staffResponse = await api.get(`/staff/${staffId}/`);
    const userId = staffResponse.data.user;
    const userResponse = await api.get(`/users/${userId}/`);
    return userResponse.data.first_name;
  };

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Booking History
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {bookings.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No bookings found
        </Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem
              key={booking.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { boxShadow: 3 }
              }}
            >
              <ListItemText
                primary={booking.service.name}
                secondary={
                  <>
                    {format(parseISO(booking.start_time), 'EEE, MMM d · h:mm a')}
                    <br />
                    With {staffNames[booking.id] || 'Loading...'}
                  </>
                }
              />
              <Chip
                label={new Date(booking.start_time) > new Date() ? 'Upcoming' : 'Completed'}
                color={new Date(booking.start_time) > new Date() ? 'primary' : 'default'}
                sx={{ mr: 2 }}
              />
              {new Date(booking.start_time) > new Date() && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}