import pytest
from app import create_app, db
from app.models.weather_data import WeatherData, DailySummary
from app.services.weather_service import kelvin_to_celsius, calculate_daily_summary
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

@pytest.fixture
def client(app):
    return app.test_client()

def test_kelvin_to_celsius():
    assert kelvin_to_celsius(273.15) == 0
    assert kelvin_to_celsius(283.15) == 10
    assert kelvin_to_celsius(293.15) == 20

def test_calculate_daily_summary(app):
    with app.app_context():
        # Create test data
        date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        weather_data = [
            WeatherData(
                city='Delhi',
                temperature=30 + i,
                feels_like=32 + i,
                main_condition='Clear' if i % 2 == 0 else 'Clouds',
                timestamp=date + timedelta(hours=i)
            )
            for i in range(24)
        ]
        
        for data in weather_data:
            db.session.add(data)
        db.session.commit()
        
        # Calculate daily summary
        summary = calculate_daily_summary('Delhi', date)
        
        assert summary is not None
        assert summary.city == 'Delhi'
        assert summary.date == date.date()
        assert 41.5 <= summary.avg_temp <= 42.5  # Average of 30 through 53
        assert summary.max_temp == 53  # Highest temperature in the test data
        assert summary.min_temp == 30  # Lowest temperature in the test data
        assert summary.dominant_condition in ['Clear', 'Clouds']

def test_empty_daily_summary(app):
    with app.app_context():
        date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        summary = calculate_daily_summary('Delhi', date)
        assert summary is None

