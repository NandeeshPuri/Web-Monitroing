from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from config import Config

db = SQLAlchemy()
scheduler = BackgroundScheduler()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    from app.routes import weather_routes, alert_routes
    app.register_blueprint(weather_routes.bp)
    app.register_blueprint(alert_routes.bp)
    
    with app.app_context():
        db.create_all()
        
    from app.services.weather_service import start_weather_monitoring
    scheduler.add_job(func=start_weather_monitoring, trigger="interval", minutes=5)
    scheduler.start()
    
    return app