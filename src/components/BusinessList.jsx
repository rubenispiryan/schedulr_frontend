import {Card, CardContent, CardMedia, Typography, Grid, Link} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function BusinessList({ businesses }) {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {businesses.map((business) => (
        <Grid item xs={12} sm={6} md={4} key={business.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="140"
              image={business.image || '/images/placeholder-business.jpg'}
              alt={business.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                <Link
                  component={RouterLink}
                  to={`/businesses/${business.id}`}
                  color="text.primary"
                >
                  {business.name}
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {business.address}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                Services: {business.services?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}