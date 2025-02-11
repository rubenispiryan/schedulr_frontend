import {Box, Button, Card, CardContent, Chip, Typography} from '@mui/material';
import {Link} from 'react-router-dom';
import FavoriteButton from "./FavoriteButton.jsx";

export default function ServiceCard({service}) {
  return (
    <Card sx={{mb: 2, borderLeft: '4px solid', borderColor: 'primary.main'}}>
      <CardContent>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6">{service.name}</Typography>
          <Chip
            label={`$${service.price}`}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
          Duration: {service.duration} minutes
        </Typography>
        <Button
          component={Link}
          to={`/book/${service.id}`}
          variant="contained"
          size="small"
          sx={{mt: 2}}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}