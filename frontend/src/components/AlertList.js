import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Warning, Notifications, Error } from '@mui/icons-material';
import { format } from 'date-fns';

// Constants for WebSocket states
const WS_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

function AlertList({ city }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  // Function to fetch initial alerts
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alerts${city ? `?city=${city}` : ''}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch alerts. Please try again later.');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle WebSocket connection
  const connectWebSocket = useCallback(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/alerts${city ? `?city=${city}` : ''}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket Connected');
      setError(null);
    };

    websocket.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        setAlerts(prevAlerts => {
          // Add new alert and sort by timestamp
          const updatedAlerts = [...prevAlerts, newAlert]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50); // Keep only the 50 most recent alerts
          return updatedAlerts;
        });
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error. Attempting to reconnect...');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    setWs(websocket);

    // Cleanup function
    return () => {
      if (websocket.readyState === WS_STATES.OPEN) {
        websocket.close();
      }
    };
  }, [city]);

  // Initial data fetch and WebSocket setup
  useEffect(() => {
    fetchAlerts();
    const cleanup = connectWebSocket();

    // Cleanup function
    return () => {
      cleanup();
      if (ws && ws.readyState === WS_STATES.OPEN) {
        ws.close();
      }
    };
  }, [city, connectWebSocket]);

  // Function to get appropriate icon based on alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'high_temperature':
        return <Warning color="error" />;
      case 'low_temperature':
        return <Warning color="primary" />;
      case 'equipment_failure':
        return <Error color="error" />;
      default:
        return <Notifications color="action" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Alerts
        {ws?.readyState === WS_STATES.OPEN && (
          <Typography component="span" variant="caption" color="success.main" sx={{ ml: 2 }}>
            (Live)
          </Typography>
        )}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {alerts.length === 0 ? (
        <Typography color="textSecondary">
          No alerts to display
        </Typography>
      ) : (
        <List>
          {alerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  {getAlertIcon(alert.type)}
                </ListItemIcon>
                <ListItemText
                  primary={alert.message}
                  secondary={`${alert.city} - ${format(
                    new Date(alert.timestamp),
                    'MMM dd, yyyy HH:mm'
                  )}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default AlertList;