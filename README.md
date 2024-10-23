# Real-Time Weather Monitoring System

This project is a real-time weather monitoring system that retrieves weather data for various metro cities in India, provides daily rollups and aggregates, and generates alerts when weather thresholds are breached. It includes a **Flask** backend that handles data retrieval and storage, and a **React** frontend for data visualization.

## Features

- Retrieves real-time weather data from the OpenWeatherMap API.
- Processes weather data for metro cities in India (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad).
- Displays daily weather summaries with average, max, and min temperatures, and dominant weather conditions.
- Allows user-configurable alert thresholds (e.g., trigger alerts if temperature exceeds 35°C for two consecutive updates).
- Visualizes historical weather data and alerts.
  
## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: React (JavaScript)
- **Database**: SQLite / any preferred persistent storage
- **API**: OpenWeatherMap API

## Prerequisites

- Docker
- Node.js (for local React development)
- Python (for local Flask development)
- OpenWeatherMap API Key (sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/))

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-monitoring-app.git
cd weather-monitoring-app
```

### 2. Backend (Flask)

#### Running Locally

1. Create and activate a virtual environment (optional):
   
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   ```

2. Install the required Python packages:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Set your OpenWeatherMap API key:

   In `app.py`, replace `YOUR_API_KEY` with your OpenWeatherMap API key.

4. Run the Flask app:

   ```bash
   flask run
   ```

   Flask will start the backend on [http://localhost:5000](http://localhost:5000).

#### Running with Docker

1. Build the Docker image for the backend:

   ```bash
   docker build -t weather-monitor-backend ./backend
   ```

2. Run the Docker container:

   ```bash
   docker run -p 5000:5000 weather-monitor-backend
   ```

### 3. Frontend (React)

#### Running Locally

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required Node.js packages:

   ```bash
   npm install
   ```

3. Run the React development server:

   ```bash
   npm start
   ```

   The React app will start on [http://localhost:3000](http://localhost:3000).

#### Running with Docker

1. Build the Docker image for the frontend:

   ```bash
   docker build -t weather-monitor-frontend ./frontend
   ```

2. Run the Docker container:

   ```bash
   docker run -p 80:80 weather-monitor-frontend
   ```

   The React app will be available at [http://localhost](http://localhost).

---

## API Endpoints

- **GET** `/weather/<city>`: Retrieves weather data for the specified city.
- **GET** `/summary`: Provides a daily summary of the weather conditions.
- **POST** `/alert`: Sets user-configurable alert thresholds.

---

## Customization

- Modify `config.json` to set your preferred cities or polling interval.
- Adjust alert thresholds in `app.py` based on your requirements.

---

