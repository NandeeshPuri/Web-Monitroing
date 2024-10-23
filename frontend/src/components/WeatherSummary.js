import React from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { WbSunny, Cloud, Opacity } from '@mui/icons-material';
import { format } from 'date-fns';

function WeatherSummary({ data, cities, selectedCity, onCityChange }) {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <WbSunny sx={{ fontSize: 40, color: '#FFB300' }} />;
      case 'rain':
        return <Opacity sx={{ fontSize: 40, color: '#1976D2' }} />;
      default:
        return <Cloud sx={{ fontSize: 40, color: '#78909C' }} />;
    }
  };

  return (
    <div>
      <Grid container spacing={3} alignItems="center" marginBottom={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2">
            Current Weather
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select City</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              label="Select City"
            >
              <MenuItem value="">All Cities</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {data.map((weather) => (
          <Grid item xs={12} sm={6} md={4} key={weather.city}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {weather.city}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {getWeatherIcon(weather.main_condition)}
                  </Grid>
                  <Grid item>
                    <Typography variant="h3">
                      {Math.round(weather.temperature)}°C
                    </Typography>
                  </Grid>
                </Grid>
                <Typography color="textSecondary" gutterBottom>
                  Feels like: {Math.round(weather.feels_like)}°C
                </Typography>
                <Typography color="textSecondary">
                  {weather.main_condition}
                </Typography>
                <Typography variant="caption" display="block">
                  Last updated: {format(new Date(weather.timestamp), 'HH:mm:ss')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default WeatherSummary;