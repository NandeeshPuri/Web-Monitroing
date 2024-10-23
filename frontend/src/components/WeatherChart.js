import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

function WeatherChart({ data }) {
  // Format the date to display as 'MMM dd' in the chart
  const formatDate = (dateStr) => format(parseISO(dateStr), 'MMM dd');

  return (
    <div style={{ margin: '20px 0' }}>
      <Typography variant="h6" gutterBottom>
        Temperature Trends
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value) => [`${value.toFixed(1)}°C`]}
          />
          <Legend />
          {/* Max Temperature Line */}
          <Line
            type="monotone"
            dataKey="max_temp"
            name="Max Temperature"
            stroke="#f44336"
            dot={false}
          />
          {/* Average Temperature Line */}
          <Line
            type="monotone"
            dataKey="avg_temp"
            name="Average Temperature"
            stroke="#2196f3"
            dot={false}
          />
          {/* Min Temperature Line */}
          <Line
            type="monotone"
            dataKey="min_temp"
            name="Min Temperature"
            stroke="#4caf50"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherChart;
