from datetime import datetime
from app import db

class EmailSubscription(db.Model):
    __tablename__ = 'email_subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_alert_sent = db.Column(db.DateTime)
    verification_token = db.Column(db.String(100), unique=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Relationship with alert preferences
    alert_preferences = db.relationship('AlertPreference', backref='subscription', lazy=True)
    # Relationship with alert history
    alert_history = db.relationship('AlertHistory', backref='subscription', lazy=True)

class AlertPreference(db.Model):
    __tablename__ = 'alert_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('email_subscriptions.id'), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    min_temperature = db.Column(db.Float)
    max_temperature = db.Column(db.Float)
    rain_alert = db.Column(db.Boolean, default=True)
    extreme_weather_alert = db.Column(db.Boolean, default=True)
    daily_summary = db.Column(db.Boolean, default=True)
    alert_frequency = db.Column(db.String(20), default='immediate')  # immediate, hourly, daily
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AlertHistory(db.Model):
    __tablename__ = 'alert_history'
    
    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('email_subscriptions.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # temperature, rain, extreme_weather, daily_summary
    city = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    delivered = db.Column(db.Boolean, default=False)
    error_message = db.Column(db.Text)