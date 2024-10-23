from flask_mail import Message
from app import mail, db
from app.models.email_subscription import EmailSubscription, AlertHistory
import jwt
from datetime import datetime, timedelta
from config import Config

class EmailService:
    @staticmethod
    def send_verification_email(email, token):
        try:
            msg = Message(
                'Verify your Weather Alert subscription',
                sender=Config.MAIL_DEFAULT_SENDER,
                recipients=[email]
            )
            verification_link = f"{Config.FRONTEND_URL}/verify/{token}"
            msg.body = f"""
            Thank you for subscribing to Weather Alerts!
            Please click the following link to verify your email address:
            {verification_link}
            
            If you didn't request this, please ignore this email.
            """
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Error sending verification email: {str(e)}")
            return False

    @staticmethod
    def send_weather_alert(subscription_id, alert_type, city, message):
        try:
            subscription = EmailSubscription.query.get(subscription_id)
            if not subscription or not subscription.is_verified:
                return False

            msg = Message(
                f'Weather Alert: {alert_type.replace("_", " ").title()}',
                sender=Config.MAIL_DEFAULT_SENDER,
                recipients=[subscription.email]
            )
            msg.body = f"""
            Weather Alert for {city}:
            {message}
            
            To update your alert preferences, visit: {Config.FRONTEND_URL}/preferences
            To unsubscribe, visit: {Config.FRONTEND_URL}/unsubscribe/{subscription.verification_token}
            """
            
            mail.send(msg)
            
            # Record in alert history
            alert_history = AlertHistory(
                subscription_id=subscription_id,
                alert_type=alert_type,
                city=city,
                message=message,
                delivered=True
            )
            db.session.add(alert_history)
            db.session.commit()
            
            return True
        except Exception as e:
            # Log error in alert history
            alert_history = AlertHistory(
                subscription_id=subscription_id,
                alert_type=alert_type,
                city=city,
                message=message,
                delivered=False,
                error_message=str(e)
            )
            db.session.add(alert_history)
            db.session.commit()
            return False

    @staticmethod
    def send_daily_summary(subscription_id, city_summaries):
        try:
            subscription = EmailSubscription.query.get(subscription_id)
            if not subscription or not subscription.is_verified:
                return False

            msg = Message(
                'Daily Weather Summary',
                sender=Config.MAIL_DEFAULT_SENDER,
                recipients=[subscription.email]
            )
            
            summary_text = "Daily Weather Summary:\n\n"
            for city, data in city_summaries.items():
                summary_text += f"{city}:\n"
                summary_text += f"- Average Temperature: {data['avg_temp']}°C\n"
                summary_text += f"- High: {data['max_temp']}°C\n"
                summary_text += f"- Low: {data['min_temp']}°C\n"
                summary_text += f"- Conditions: {data['conditions']}\n\n"

            msg.body = summary_text
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Error sending daily summary: {str(e)}")
            return False