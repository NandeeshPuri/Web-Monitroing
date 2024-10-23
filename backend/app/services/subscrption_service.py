from app import db
from app.models.email_subscription import EmailSubscription, AlertPreference
from app.services.email_service import EmailService
import jwt
from datetime import datetime, timedelta
from config import Config
import secrets

class SubscriptionService:
    @staticmethod
    def create_subscription(email, cities=None):
        try:
            # Generate verification token
            verification_token = secrets.token_urlsafe(32)
            
            # Create subscription
            subscription = EmailSubscription(
                email=email,
                verification_token=verification_token
            )
            db.session.add(subscription)
            db.session.flush()  # Get the ID without committing
            
            # Create default alert preferences for selected cities
            cities = cities or ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']
            for city in cities:
                preference = AlertPreference(
                    subscription_id=subscription.id,
                    city=city,
                    min_temperature=10,
                    max_temperature=35,
                    rain_alert=True,
                    extreme_weather_alert=True,
                    daily_summary=True
                )
                db.session.add(preference)
            
            db.session.commit()
            
            # Send verification email
            EmailService.send_verification_email(email, verification_token)
            
            return subscription
            
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def verify_subscription(token):
        try:
            subscription = EmailSubscription.query.filter_by(
                verification_token=token,
                is_verified=False
            ).first()
            
            if subscription:
                subscription.is_verified = True
                subscription.verification_token = None  # Clear token after verification
                db.session.commit()
                return True
            return False
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_preferences(subscription_id, preferences):
        try:
            # Update existing preferences
            for city, prefs in preferences.items():
                AlertPreference.query.filter_by(
                    subscription_id=subscription_id,
                    city=city
                ).update({
                    'min_temperature': prefs.get('min_temperature'),
                    'max_temperature': prefs.get('max_temperature'),
                    'rain_alert': prefs.get('rain_alert'),
                    'extreme_weather_alert': prefs.get('extreme_weather_alert'),
                    'daily_summary': prefs.get('daily_summary'),
                    'alert_frequency': prefs.get('alert_frequency', 'immediate')
                })
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def unsubscribe(token):
        try:
            subscription = EmailSubscription.query.filter_by(
                verification_token=token,
                is_active=True
            ).first()
            
            if subscription:
                subscription.is_active = False
                db.session.commit()
                return True
            return False
        except Exception as e:
            db.session.rollback()
            raise e