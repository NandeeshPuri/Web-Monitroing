import React, { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  WbSunny,
  Notifications,
  Timeline,
  LocationOn
} from '@mui/icons-material';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      // await axios.post('/api/subscribe', { email });
      setShowSuccess(true);
      setEmail('');
      setError('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Container maxWidth="lg" className="py-8">
        {/* Hero Section */}
        <Box className="text-center mb-12">
          <Typography variant="h2" className="mb-4 font-bold text-blue-900">
            Real-Time Weather Alerts
          </Typography>
          <Typography variant="h5" className="mb-8 text-gray-600">
            Stay informed about weather conditions in major Indian metros
          </Typography>
          
          {/* Email Signup Form */}
          <Paper elevation={3} className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="email"
                label="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                className="mb-4"
              />
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Weather Alerts
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} className="mt-12">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <WbSunny className="text-6xl mb-4 text-yellow-500" />
                <Typography variant="h6" className="mb-2">
                  Real-Time Updates
                </Typography>
                <Typography color="textSecondary">
                  Get instant weather updates for major Indian metros
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <Notifications className="text-6xl mb-4 text-red-500" />
                <Typography variant="h6" className="mb-2">
                  Custom Alerts
                </Typography>
                <Typography color="textSecondary">
                  Set your own temperature and weather condition thresholds
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <Timeline className="text-6xl mb-4 text-green-500" />
                <Typography variant="h6" className="mb-2">
                  Daily Summaries
                </Typography>
                <Typography color="textSecondary">
                  Receive detailed daily weather summaries and trends
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <LocationOn className="text-6xl mb-4 text-blue-500" />
                <Typography variant="h6" className="mb-2">
                  Multi-City Coverage
                </Typography>
                <Typography color="textSecondary">
                  Track weather across Delhi, Mumbai, Chennai, and more
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Notification */}
        <Snackbar 
          open={showSuccess} 
          autoHideDuration={6000} 
          onClose={() => setShowSuccess(false)}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            Successfully subscribed to weather alerts!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default LandingPage;