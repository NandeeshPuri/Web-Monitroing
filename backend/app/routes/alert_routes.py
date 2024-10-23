from flask import Blueprint, jsonify, request
from app.models.alert_config import AlertConfig
from app import db

bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

@bp.route('/config', methods=['GET'])
def get_alert_configs():
    city = request.args.get('city')
    query = AlertConfig.query
    
    if city:
        query = query.filter_by(city=city)
    
    configs = query.all()
    return jsonify([{
        'id': config.id,
        'city': config.city,
        'max_temp_threshold': config.max_temp_threshold,
        'min_temp_threshold': config.min_temp_threshold,
        'consecutive_readings': config.consecutive_readings,
        'email_notification': config.email_notification
    } for config in configs])

@bp.route('/config', methods=['POST'])
def create_alert_config():
    data = request.json
    
    config = AlertConfig(
        city=data['city'],
        max_temp_threshold=data['max_temp_threshold'],
        min_temp_threshold=data['min_temp_threshold'],
        consecutive_readings=data.get('consecutive_readings', 2),
        email_notification=data.get('email_notification', True)
    )
    
    db.session.add(config)
    db.session.commit()
    
    return jsonify({
        'id': config.id,
        'city': config.city,
        'max_temp_threshold': config.max_temp_threshold,
        'min_temp_threshold': config.min_temp_threshold,
        'consecutive_readings': config.consecutive_readings,
        'email_notification': config.email_notification
    }), 201

@bp.route('/config/<int:config_id>', methods=['PUT'])
def update_alert_config(config_id):
    config = AlertConfig.query.get_or_404(config_id)
    data = request.json
    
    config.max_temp_threshold = data.get('max_temp_threshold', config.max_temp_threshold)
    config.min_temp_threshold = data.get('min_temp_threshold', config.min_temp_threshold)
    config.consecutive_readings = data.get('consecutive_readings', config.consecutive_readings)
    config.email_notification = data.get('email_notification', config.email_notification)
    
    db.session.commit()
    
    return jsonify({
        'id': config.id,
        'city': config.city,
        'max_temp_threshold': config.max_temp_threshold,
        'min_temp_threshold': config.min_temp_threshold,
        'consecutive_readings': config.consecutive_readings,
        'email_notification': config.email_notification
    })

@bp.route('/config/<int:config_id>', methods=['DELETE'])
def delete_alert_config(config_id):
    config = AlertConfig.query.get_or_404(config_id)
    db.session.delete(config)
    db.session.commit()
    return '', 204