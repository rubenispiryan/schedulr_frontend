import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import {LocalizationProvider, TimePicker} from '@mui/x-date-pickers';
import {Delete as DeleteIcon} from '@mui/icons-material';
import api from '../services/api';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SetWorkingHoursPage() {
  const [schedules, setSchedules] = useState([]);
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [error, setError] = useState(null);

  // Fetch existing schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/staff/working-hours/');
        setSchedules(response.data || []);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        setError('Failed to load schedules');
      }
    };
    fetchSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Validate inputs
      if (!startTime || !endTime) {
        throw new Error('Please select both start and end times');
      }

      if (startTime >= endTime) {
        throw new Error('End time must be after start time');
      }
      console.log(startTime);
      console.log(endTime);
      await api.post('/staff/working-hours/', {
        day_of_week: day,
        start_time: startTime.toISOString().split('T')[1].slice(0, 5),
        end_time: endTime.toISOString().split('T')[1].slice(0, 5),
      });
      // Refresh schedules after submission
      const response = await api.get('/staff/working-hours/');
      setSchedules(response.data);
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError(error.response?.data?.start_time || error.response?.data?.detail || error.message)
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/working-hours/${id}/`);
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const formatTime = (time) =>
  new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{p: 3, maxWidth: 800, mx: 'auto'}}>
        <Typography variant="h4" sx={{mb: 3, color: 'primary.main'}}>
          Set Working Hours
        </Typography>

        {error && (
          <Alert severity="error" sx={{mb: 3}}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{p: 3, mb: 3}}>
          <Typography variant="h6" sx={{mb: 2}}>
            Add Working Hours
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{mb: 2}}>
              <InputLabel>Day</InputLabel>
              <Select value={day} onChange={(e) => setDay(e.target.value)}>
                {daysOfWeek.map((day, index) => (
                  <MenuItem key={index} value={index}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              sx={{mr: 2, mb: 2}}
            />

            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              sx={{mb: 2}}
            />

            <Button type="submit" variant="contained">
              Save Schedule
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{p: 3}}>
          <Typography variant="h6" sx={{mb: 2}}>
            Your Weekly Schedule
          </Typography>
          {schedules.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No working hours set yet. Add your availability using the form above.
            </Typography>
          ) : (
            <List>
              {schedules.map((schedule) => (
                <ListItem
                  key={schedule.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setScheduleToDelete(schedule.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={daysOfWeek[schedule.day_of_week]}
                    secondary={`${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Schedule</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this schedule?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => handleDelete(scheduleToDelete)}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}