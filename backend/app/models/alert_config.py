from app import db
class AlertConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    max_temp_threshold = db.Column(db.Float, nullable=False)
    min_temp_threshold = db.Column(db.Float, nullable=False)
    consecutive_readings = db.Column(db.Integer, default=2)
    email_notification = db.Column(db.Boolean, default=True)