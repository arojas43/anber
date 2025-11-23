from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecommerce.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    # CORS configuration
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    jwt.init_app(app)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"Invalid token error: {error}")
        return {"message": "Invalid token", "error": error}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"Missing token error: {error}")
        return {"message": "Request does not contain an access token", "error": error}, 401
    
    # Register blueprints
    from app.routes import main_bp, auth_bp, products_bp, admin_bp
    app.register_blueprint(main_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    return app