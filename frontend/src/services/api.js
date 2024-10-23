import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherService = {
  getCurrentWeather: async (city) => {
    const params = city ? { city } : {};
    const response = await api.get('/weather/current', { params });
    return response.data;
  },

  getDailySummary: async (city, days = 7) => {
    const params = { days };
    if (city) params.city = city;
    const response = await api.get('/weather/summary/daily', { params });
    return response.data;
  },
};

export const alertService = {
  getAlertConfigs: async (city) => {
    const params = city ? { city } : {};
    const response = await api.get('/alerts/config', { params });
    return response.data;
  },

  createAlertConfig: async (config) => {
    const response = await api.post('/alerts/config', config);
    return response.data;
  },

  updateAlertConfig: async (configId, config) => {
    const response = await api.put(`/alerts/config/${configId}`, config);
    return response.data;
  },

  deleteAlertConfig: async (configId) => {
    await api.delete(`/alerts/config/${configId}`);
  },
};

export default api;