from app.models.alert_config import AlertConfig
from app.models.weather_data import WeatherData
from app.services.email_service import send_alert_email
from datetime import datetime, timedelta
from app import db

def check_alert_conditions(city, current_temp):
    alert_config = AlertConfig.query.filter_by(city=city).first()
    if not alert_config:
        return
    
    # Check recent readings
    recent_readings = WeatherData.query.filter(
        WeatherData.city == city,
        WeatherData.timestamp >= datetime.utcnow() - timedelta(minutes=30)
    ).order_by(WeatherData.timestamp.desc()).limit(alert_config.consecutive_readings).all()
    
    if len(recent_readings) >= alert_config.consecutive_readings:
        # Check if all recent readings exceed thresholds
        high_temp_breach = all(r.temperature >= alert_config.max_temp_threshold for r in recent_readings)
        low_temp_breach = all(r.temperature <= alert_config.min_temp_threshold for r in recent_readings)
        
        if high_temp_breach or low_temp_breach:
            alert_message = f"Temperature alert for {city}: Current temperature is {current_temp:.1f}°C"
            if high_temp_breach:
                alert_message += f" - Exceeding maximum threshold of {alert_config.max_temp_threshold}°C"
            else:
                alert_message += f" - Below minimum threshold of {alert_config.min_temp_threshold}°C"
            
            if alert_config.email_notification:
                send_alert_email(city, alert_message)
            
            return alert_message
    
    return None