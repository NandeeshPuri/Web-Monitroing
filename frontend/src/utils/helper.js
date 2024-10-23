// frontend/src/utils/helpers.js
export const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`;
  };
  
  export const getWeatherIcon = (condition) => {
    const icons = {
      clear: '☀️',
      clouds: '☁️',
      rain: '🌧️',
      snow: '❄️',
      thunderstorm: '⛈️',
      drizzle: '🌦️',
      mist: '🌫️',
    };
    return icons[condition.toLowerCase()] || '🌡️';
  };
  
  export const getTemperatureColor = (temp) => {
    if (temp >= 35) return '#ff4444';
    if (temp >= 25) return '#ff8800';
    if (temp >= 15) return '#00C851';
    if (temp >= 5) return '#33b5e5';
    return '#4285f4';
  };
  
  export const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };
  
  export const calculateTrend = (current, previous) => {
    if (!previous) return 'stable';
    const diff = current - previous;
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };