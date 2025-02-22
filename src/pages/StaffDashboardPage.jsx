import {useRef, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {format, isSameDay} from 'date-fns';
import {styled} from '@mui/material/styles';

const StyledCalendar = styled(Paper)(({theme}) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  width: '100%',
  minWidth: '300px', // Minimum mobile width
  maxWidth: '1200px', // Maximum desktop width
  margin: '0 auto',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    minWidth: '800px' // Fixed width for desktop
  },
  '& .fc': {
    '& .fc-toolbar': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        flexWrap: 'nowrap',
        padding: theme.spacing(2),
        gap: theme.spacing(2)
      },
      '& .fc-toolbar-chunk': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 auto',
        minWidth: 'fit-content',
        '&:first-of-type': {order: 1}, // Prev/Next
        '&:nth-of-type(2)': { // Title
          order: 3,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            order: 2,
            width: 'auto'
          }
        },
        '&:last-of-type': {order: 2} // View buttons
      },
      '& .fc-toolbar-title': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: '1rem',
        width: '100%',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1.25rem',
          width: '220px',
          margin: '0 20px'
        }
      },
      '& .fc-button-group': {
        gap: theme.spacing(0.5),
        '& .fc-button': {
          padding: '6px 8px',
          fontSize: '0.75rem',
          [theme.breakpoints.up('sm')]: {
            padding: '8px 12px',
            fontSize: '0.875rem'
          }
        }
      }
    },
    '& .fc-view-harness': {
      minHeight: '400px',
      [theme.breakpoints.up('sm')]: {
        minHeight: '600px'
      }
    }
  }
}));

const HighlightedDay = styled('div')(({theme, hasEvents}) => ({
  position: 'absolute',
  top: 2,
  right: 2,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: hasEvents ? theme.palette.secondary.main : 'transparent'
}));

export default function StaffDashboardPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [visibleHours, setVisibleHours] = useState({start: '08:00', end: '18:00'}); // Default hours
  const calendarRef = useRef(null);

  // Temporary data - replace with API calls
  const appointments = [
    {
      id: 1,
      title: 'John Doe - Haircut',
      start: '2025-03-15T10:00:00',
      end: '2025-03-15T10:30:00',
      status: 'confirmed',
      notes: 'Wants skin fade with beard trim'
    },
    {
      id: 2,
      title: 'Jane Smith - Coloring',
      start: '2025-03-15T18:00:00',
      end: '2025-03-15T20:00:00',
      status: 'pending',
      notes: 'All-over color with highlights'
    }
  ];

  // Calculate visible hours based on appointments for the selected day
  const calculateVisibleHours = (date) => {
    const appointmentsForDay = appointments.filter(appt =>
      isSameDay(new Date(appt.start), date)
    );

    if (appointmentsForDay.length === 0) {
      // Default hours if no appointments
      return {start: '08:00', end: '18:00'};
    }

    // Find the earliest start time and latest end time
    const startTimes = appointmentsForDay.map(appt => new Date(appt.start).getHours());
    const endTimes = appointmentsForDay.map(appt => new Date(appt.end).getHours());

    const earliestStart = Math.min(...startTimes);
    const latestEnd = Math.max(...endTimes);

    // Add buffer hours
    const startHour = Math.max(earliestStart - 1, 8); // Don't start earlier than 8 AM
    const endHour = Math.min(latestEnd + 1, 20); // Don't end later than 8 PM

    return {
      start: `${String(startHour).padStart(2, '0')}:00`,
      end: `${String(endHour).padStart(2, '0')}:00`
    };
  };

  const handleDateClick = (arg) => {
    const hours = calculateVisibleHours(arg.date);
    setVisibleHours(hours);
    calendarRef.current.getApi().changeView('timeGridDay', arg.date);
  };

  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  const handleEventClick = (info) => {
    if (info.event.start && info.event.end) {
      const startDate = new Date(info.event.start);
      const endDate = new Date(info.event.end);

      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        console.error("Attempted to set an appointment with invalid date:", info.event);
        return;
      }

      setSelectedAppointment({
        title: info.event.title,  // Extract title
        start: info.event.start.toISOString(),  // Ensure proper format
        end: info.event.end.toISOString(),
        status: info.event.extendedProps?.status ?? 'unknown',  // Default value if missing
        notes: info.event.extendedProps?.notes ?? 'No additional notes'
      });
    } else {
      console.error("Missing event start/end time:", info.event);
    }
  };

  const renderDayCell = (cellInfo) => {
    const hasEvents = appointments.some(appt =>
      format(new Date(appt.start), 'yyyy-MM-dd') === cellInfo.date.toISOString().split('T')[0]
    );

    return (
      <div style={{position: 'relative'}}>
        {cellInfo.dayNumberText}
        <HighlightedDay hasEvents={hasEvents}/>
      </div>
    );
  };

  return (
    <Box sx={{
      p: 3,
      paddingTop: '80px',
      height: 'calc(100vh - 64px)',
    }}>
      <Typography variant="h4" sx={{mb: 3, color: 'primary.main'}}>
        Appointment Calendar
      </Typography>

      <StyledCalendar elevation={3}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          views={{
            dayGridMonth: {
              titleFormat: {year: 'numeric', month: 'long'}
            },
            timeGridWeek: {
              titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
            },
            timeGridDay: {
              titleFormat: {year: 'numeric', month: 'long', day: 'numeric'}
            }
          }}
          events={appointments}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayCellContent={renderDayCell}
          nowIndicator
          editable
          selectable
          height="auto"
          contentHeight="auto"
          aspectRatio={1.2}
          dayMaxEventRows={2}
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: true,
            meridiem: 'short'
          }}
          slotMinTime={visibleHours.start} // Dynamic start time
          slotMaxTime={visibleHours.end} // Dynamic end time
          allDaySlot={false} // Hide all-day slot
          slotDuration="00:30:00" // 30-minute slots
          slotLabelInterval="01:00" // Show labels every hour
        />
      </StyledCalendar>

      <AppointmentDialog
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </Box>
  );
}

const AppointmentDialog = ({open, onClose, appointment}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>
      Manage Appointment
      <Chip
        label={appointment?.status}
        color={appointment?.status === 'confirmed' ? 'success' : 'warning'}
        sx={{ml: 2}}
      />
    </DialogTitle>

    <DialogContent dividers>
      {appointment && (
        <>
          <Typography variant="h6" gutterBottom>
            {appointment.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {appointment?.start && appointment?.end ? (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {format(new Date(appointment.start), 'MMM d, yyyy h:mm a')} -{' '}
                {format(new Date(appointment.end), 'h:mm a')}
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                Error: Invalid appointment date
              </Typography>
            )}
          </Typography>
          <Divider sx={{my: 2}}/>
          <Typography variant="body1">
            {appointment.notes}
          </Typography>
        </>
      )}
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Close
      </Button>
      <Button variant="contained" color="error">
        Cancel
      </Button>
      <Button variant="contained">
        Reschedule
      </Button>
      <Button variant="contained" color="success">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);