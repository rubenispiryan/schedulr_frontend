import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

export default function ServiceCard({ service }) {
  return (
    <Card sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{service.name}</Typography>
          <Chip
            label={`$${service.price}`}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Duration: {service.duration} minutes
        </Typography>
      </CardContent>
    </Card>
  );
}