from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class UserRoles(enum.Enum):
    CUSTOMER = 'customer'
    ADMIN = 'admin'

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum(UserRoles), default=UserRoles.CUSTOMER, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='customer', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)  # Price in Mexican Pesos
    compare_price = db.Column(db.Numeric(precision=10, scale=2))  # Original price if on sale
    sku = db.Column(db.String(100), unique=True, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    image_url = db.Column(db.String(255))  # Deprecated: use images instead
    images = db.Column(db.JSON, default=list)  # List of image URLs: [main, additional1, additional2, additional3]
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    variants = db.relationship('ProductVariant', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

class ProductVariant(db.Model):
    __tablename__ = 'product_variants'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g. "Red / Large"
    sku = db.Column(db.String(100), unique=True, nullable=False)
    price = db.Column(db.Numeric(precision=10, scale=2))  # Optional: different price for variants
    stock_quantity = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, shipped, delivered, cancelled
    subtotal = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    tax = db.Column(db.Numeric(precision=10, scale=2), default=0)
    shipping = db.Column(db.Numeric(precision=10, scale=2), default=0)
    total = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    currency = db.Column(db.String(3), default='MXN')  # Mexican Pesos
    shipping_address = db.Column(db.Text)
    billing_address = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.id'))  # Optional
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)  # Price at time of order
    total_price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    variant = db.relationship('ProductVariant', backref='order_items')
class SiteSetting(db.Model):
    """Store site-wide settings like carousel, about section, etc."""
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.JSON)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
