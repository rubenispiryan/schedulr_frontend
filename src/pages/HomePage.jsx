import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to the Booking System!
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/profile')}
      >
        View Profile
      </Button>
    </div>
  );
}