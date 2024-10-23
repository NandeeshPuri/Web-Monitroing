// frontend/src/components/AlertConfig.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { alertService } from '../services/api';

function AlertConfig({ city, cities }) {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newConfig, setNewConfig] = useState({
    city: '',
    max_temp_threshold: 35,
    min_temp_threshold: 10,
    consecutive_readings: 2,
    email_notification: true,
  });

  useEffect(() => {
    fetchAlertConfigs();
  }, [city]);

  const fetchAlertConfigs = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAlertConfigs(city);
      setConfigs(data);
      setError(null);
    } catch (err) {
      //setError('Failed to load alert configurations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setNewConfig((prev) => ({
      ...prev,
      [name]: name === 'email_notification' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await alertService.createAlertConfig(newConfig);
      setNewConfig({
        city: '',
        max_temp_threshold: 35,
        min_temp_threshold: 10,
        consecutive_readings: 2,
        email_notification: true,
      });
      await fetchAlertConfigs();
      setError(null);
    } catch (err) {
      setError('Failed to create alert configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (configId) => {
    try {
      setLoading(true);
      await alertService.deleteAlertConfig(configId);
      await fetchAlertConfigs();
      setError(null);
    } catch (err) {
      setError('Failed to delete alert configuration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Alert Configurations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                name="city"
                value={newConfig.city}
                onChange={handleInputChange}
                label="City"
                required
              >
                {cities.map((cityOption) => (
                  <MenuItem key={cityOption} value={cityOption}>
                    {cityOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Temperature (°C)"
              type="number"
              name="max_temp_threshold"
              value={newConfig.max_temp_threshold}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Min Temperature (°C)"
              type="number"
              name="min_temp_threshold"
              value={newConfig.min_temp_threshold}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Consecutive Readings"
              type="number"
              name="consecutive_readings"
              value={newConfig.consecutive_readings}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={newConfig.email_notification}
                  onChange={handleInputChange}
                  name="email_notification"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Add Alert Configuration
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Existing Configurations
        </Typography>
        {configs.map((config) => (
          <Box
            key={config.id}
            sx={{
              border: 1,
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {config.city}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Max Temp: {config.max_temp_threshold}°C
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Min Temp: {config.min_temp_threshold}°C
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Consecutive Readings: {config.consecutive_readings}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email Notifications: {config.email_notification ? 'Yes' : 'No'}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(config.id)}
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default AlertConfig;