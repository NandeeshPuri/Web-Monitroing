from flask import Blueprint, request, jsonify
from app.services.subscription_service import SubscriptionService
from app.models.email_subscription import EmailSubscription, AlertPreference

subscription_routes = Blueprint('subscription_routes', __name__)

@subscription_routes.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        cities = data.get('cities')  # Optional
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        # Check if already subscribed
        existing = EmailSubscription.query.filter_by(email=email, is_active=True).first()
        if existing:
            return jsonify({'error': 'Email already subscribed'}), 400
            
        subscription = SubscriptionService.create_subscription(email, cities)
        return jsonify({
            'message': 'Please check your email to verify your subscription',
            'subscription_id': subscription.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_routes.route('/api/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        if SubscriptionService.verify_subscription(token):
            return jsonify({'message': 'Email verified successfully'}), 200
        return jsonify({'error': 'Invalid or expired token'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_routes.route('/api/preferences/<int:subscription_id>', methods=['PUT'])
def update_preferences(subscription_id):
    try:
        data = request.get_json()
        if SubscriptionService.update_preferences(subscription_id, data):
            return jsonify({'message': 'Preferences updated successfully'}), 200
        return jsonify({'error': 'Failed to update preferences'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_routes.route('/api/unsubscribe/<token>', methods=['POST'])
def unsubscribe(token):
    try:
        if SubscriptionService.unsubscribe(token):
            return jsonify({'message': 'Successfully unsubscribed'}), 200
        return jsonify({'error': 'Invalid token or already unsubscribed'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscription_routes.route('/api/preferences/<int:subscription_id>', methods=['GET'])
def get_preferences(subscription_id):
    try:
        preferences = AlertPreference.query.filter_by(subscription_id=subscription_id).all()
        return jsonify({
            'preferences': [{
                'city': pref.city,
                'min_temperature': pref.min_temperature,
                'max_temperature': pref.max_temperature,
                'rain_alert': pref.rain_alert,
                'extreme_weather_alert': pref.extreme_weather_alert,
                'daily_summary': pref.daily_summary,
                'alert_frequency': pref.alert_frequency
            } for pref in preferences]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500