import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Box } from '@mui/material';
import WeatherSummary from './WeatherSummary';
import AlertConfig from './AlertConfig';
import WeatherChart from './WeatherChart';
import AlertList from './AlertList';
import { weatherService } from '../services/api';

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const UPDATE_INTERVAL = parseInt(process.env.REACT_APP_WEATHER_UPDATE_INTERVAL, 10);

function Dashboard() {
  const [currentWeather, setCurrentWeather] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const fetchWeatherData = async () => {
    try {
      const weather = await weatherService.getCurrentWeather(selectedCity);
      setCurrentWeather(weather);
      
      const summaries = await weatherService.getDailySummary(selectedCity);
      setDailySummaries(summaries);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [selectedCity]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Current Weather Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <WeatherSummary 
              data={currentWeather}
              cities={CITIES}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </Paper>
        </Grid>

        {/* Weather Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <WeatherChart data={dailySummaries} />
          </Paper>
        </Grid>

        {/* Alert Configuration */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <AlertConfig 
              city={selectedCity}
              cities={CITIES}
            />
          </Paper>
        </Grid>

        {/* Alert List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <AlertList city={selectedCity} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;