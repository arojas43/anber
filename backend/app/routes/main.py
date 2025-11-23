from flask import jsonify
from app.routes import main_bp

@main_bp.route('/')
def index():
    return jsonify({"message": "Welcome to the E-commerce API!"})

@main_bp.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

# Public endpoint for site settings
@main_bp.route('/settings/<key>')
def get_public_setting(key):
    """Get a specific setting by key (public access)"""
    from app.models import SiteSetting
    
    setting = SiteSetting.query.filter_by(key=key).first()
    if not setting:
        return jsonify({'error': 'Setting not found'}), 404
    
    return jsonify({
        'key': setting.key,
        'value': setting.value
    }), 200