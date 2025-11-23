from flask import Blueprint

# Create blueprints for different parts of the application
main_bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)
products_bp = Blueprint('products', __name__)
admin_bp = Blueprint('admin', __name__)

# Import routes to register them
from app.routes import main, auth, products, admin, orders