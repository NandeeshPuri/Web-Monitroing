import pytest
from app import create_app, db
from app.models.alert_config import AlertConfig
from app.models.weather_data import WeatherData
from app.services.alert_service import check_alert_conditions
from datetime import datetime, timedelta

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

def test_check_alert_conditions(app):
    with app.app_context():
        # Create test alert config
        config = AlertConfig(
            city='Delhi',
            max_temp_threshold=35,
            min_temp_threshold=10,
            consecutive_readings=2,
            email_notification=False
        )
        db.session.add(config)
        
        # Create test weather data
        now = datetime.utcnow()
        weather_data = [
            WeatherData(
                city='Delhi',
                temperature=36,
                feels_like=38,
                main_condition='Clear',
                timestamp=now - timedelta(minutes=i * 5)
            )
            for i in range(3)
        ]
        
        for data in weather_data:
            db.session.add(data)
        db.session.commit()
        
        # Test alert condition
        alert_message = check_alert_conditions('Delhi', 36)
        assert alert_message is not None
        assert 'Temperature alert for Delhi' in alert_message
        assert 'Exceeding maximum threshold' in alert_message