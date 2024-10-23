from flask import Blueprint, jsonify, request
from app.models.weather_data import WeatherData, DailySummary
from datetime import datetime, timedelta
import summary
bp = Blueprint('weather', __name__, url_prefix='/api/weather')

@bp.route('/current', methods=['GET'])
def get_current_weather():
    city = request.args.get('city')
    query = WeatherData.query.order_by(WeatherData.timestamp.desc())
    
    if city:
        query = query.filter_by(city=city)
    
    latest_readings = query.group_by(WeatherData.city).all()
    
    return jsonify([{
        'city': reading.city,
        'temperature': reading.temperature,
        'feels_like': reading.feels_like,
        'main_condition': reading.main_condition,
        'timestamp': reading.timestamp.isoformat()
    } for reading in latest_readings])

@bp.route('/summary/daily', methods=['GET'])
def get_daily_summary():
    city = request.args.get('city')
    days = int(request.args.get('days', 7))
    
    start_date = datetime.utcnow().date() - timedelta(days=days-1)
    query = DailySummary.query.filter(DailySummary.date >= start_date)
    
    if city:
        query = query.filter_by(city=city)
    
    summaries = query.order_by(DailySummary.date.desc()).all()
    
    return jsonify([{
        'city': summary.city,
        'date': summary.date.isoformat(),
        'avg_temp': summary.avg_temp,
        'max_temp': summary.max_temp,
        'min_temp' : summary.min_temp,
    }])