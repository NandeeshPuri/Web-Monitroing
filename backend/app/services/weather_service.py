import requests
from datetime import datetime, timedelta
from app import db
from app.models.weather_data import WeatherData, DailySummary
from app.services.alert_service import check_alert_conditions
from flask import current_app
from collections import Counter

CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']

def kelvin_to_celsius(kelvin):
    return kelvin - 273.15

def fetch_weather_data(city):
    api_key = current_app.config['OPENWEATHERMAP_API_KEY']
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={api_key}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if response.status_code == 200:
            return {
                'city': city,
                'temperature': kelvin_to_celsius(data['main']['temp']),
                'feels_like': kelvin_to_celsius(data['main']['feels_like']),
                'main_condition': data['weather'][0]['main']
            }
    except Exception as e:
        current_app.logger.error(f"Error fetching weather data for {city}: {str(e)}")
    return None

def calculate_daily_summary(city, date):
    daily_data = WeatherData.query.filter(
        WeatherData.city == city,
        WeatherData.timestamp >= date,
        WeatherData.timestamp < date + timedelta(days=1)
    ).all()
    
    if not daily_data:
        return None
        
    temperatures = [d.temperature for d in daily_data]
    conditions = [d.main_condition for d in daily_data]
    
    # Get dominant condition by most frequent occurrence
    dominant_condition = Counter(conditions).most_common(1)[0][0]
    
    return DailySummary(
        city=city,
        date=date.date(),
        avg_temp=sum(temperatures) / len(temperatures),
        max_temp=max(temperatures),
        min_temp=min(temperatures),
        dominant_condition=dominant_condition
    )

def start_weather_monitoring():
    with current_app.app_context():
        for city in CITIES:
            weather_data = fetch_weather_data(city)
            
            if weather_data:
                # Save current weather data
                data = WeatherData(
                    city=weather_data['city'],
                    temperature=weather_data['temperature'],
                    feels_like=weather_data['feels_like'],
                    main_condition=weather_data['main_condition']
                )
                db.session.add(data)
                
                # Calculate and save daily summary
                today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
                existing_summary = DailySummary.query.filter_by(
                    city=city,
                    date=today.date()
                ).first()
                
                if existing_summary:
                    db.session.delete(existing_summary)
                
                new_summary = calculate_daily_summary(city, today)
                if new_summary:
                    db.session.add(new_summary)
                
                db.session.commit()
                
                # Check alert conditions
                check_alert_conditions(city, weather_data['temperature'])