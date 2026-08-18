from flask import request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from PIL import Image
from app import db
from app.models import User, Product, Category, ProductVariant, SiteSetting
from app.routes import admin_bp

def admin_required(fn):
    """Decorator to check if user has admin role"""
    def wrapper(*args, **kwargs):
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        if not user or user.role.value != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    
    wrapper.__name__ = fn.__name__  # Fix for Flask's endpoint naming
    return wrapper

@admin_bp.route('/products', methods=['GET'])
@jwt_required()
@admin_required
def get_all_products():
    products = Product.query.all()
    
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': float(p.price),
        'compare_price': float(p.compare_price) if p.compare_price else None,
        'sku': p.sku,
        'stock_quantity': p.stock_quantity,
        'is_active': p.is_active,
        'is_featured': p.is_featured,
        'category_id': p.category_id,
        'image_url': p.image_url,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None
    } for p in products]), 200

@admin_bp.route('/products', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'price', 'sku', 'category_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if SKU already exists
    if Product.query.filter_by(sku=data['sku']).first():
        return jsonify({'error': 'SKU already exists'}), 409
    
    # Create product
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        sku=data['sku'],
        stock_quantity=data.get('stock_quantity', 0),
        is_active=data.get('is_active', True),
        is_featured=data.get('is_featured', False),
        category_id=data['category_id'],
        image_url=data.get('image_url', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    # Create variants if provided
    if 'variants' in data:
        for variant_data in data['variants']:
            variant = ProductVariant(
                name=variant_data['name'],
                sku=variant_data['sku'],
                price=variant_data.get('price'),
                stock_quantity=variant_data.get('stock_quantity', 0),
                product_id=product.id
            )
            db.session.add(variant)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product created successfully',
        'product_id': product.id
    }), 201

@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Update product fields
    for field in ['name', 'description', 'price', 'compare_price', 'sku', 
                  'stock_quantity', 'is_active', 'is_featured', 'category_id', 'image_url']:
        if field in data:
            setattr(product, field, data[field])
    
    db.session.commit()
    
    return jsonify({'message': 'Product updated successfully'}), 200

@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product.is_active = False  # Soft delete
    db.session.commit()
    
    return jsonify({'message': 'Product deactivated successfully'}), 200

@admin_bp.route('/categories', methods=['GET'])
@jwt_required()
@admin_required
def get_all_categories():
    categories = Category.query.all()
    
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'image_url': c.image_url,
        'is_active': c.is_active,
        'created_at': c.created_at.isoformat() if c.created_at else None,
        'updated_at': c.updated_at.isoformat() if c.updated_at else None
    } for c in categories]), 200

@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    # Check if category already exists
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category already exists'}), 409
    
    category = Category(
        name=data['name'],
        description=data.get('description', ''),
        image_url=data.get('image_url', '')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category created successfully',
        'category_id': category.id
    }), 201

@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category(category_id):
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        # Check if new name conflicts with existing category
        existing = Category.query.filter_by(name=data['name']).first()
        if existing and existing.id != category_id:
            return jsonify({'error': 'Category name already exists'}), 409
        category.name = data['name']
        
    if 'description' in data:
        category.description = data['description']
    
    if 'image_url' in data:
        category.image_url = data['image_url']
        
    if 'is_active' in data:
        category.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Category updated successfully'}), 200

@admin_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    # Check if category has products
    if category.products:
        return jsonify({'error': 'Cannot delete category with associated products'}), 400
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    users = User.query.all()
    
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'role': u.role.value,
        'is_active': u.is_active,
        'created_at': u.created_at.isoformat() if u.created_at else None
    } for u in users]), 200

@admin_bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_order_status(order_id):
    from app.models import Order
    
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
        
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
        
    order.status = data['status']
    db.session.commit()
    
    return jsonify({'message': 'Order status updated successfully'}), 200

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_dashboard_stats():
    from app.models import Order, Product, User, UserRoles
    from sqlalchemy import func
    
    # Basic counts
    total_sales = db.session.query(func.sum(Order.total)).scalar() or 0
    active_orders = Order.query.filter(Order.status.in_(['pending', 'confirmed', 'shipped'])).count()
    total_products = Product.query.count()
    total_customers = User.query.filter_by(role=UserRoles.CUSTOMER).count()
    
    # Recent sales (last 5 orders)
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
    recent_sales_data = [{
        'id': o.id,
        'order_number': o.order_number,
        'customer': f"{o.customer.first_name} {o.customer.last_name}",
        'total': float(o.total),
        'status': o.status,
        'date': o.created_at.isoformat()
    } for o in recent_orders]
    
    return jsonify({
        'total_sales': float(total_sales),
        'active_orders': active_orders,
        'total_products': total_products,
        'total_customers': total_customers,
        'recent_sales': recent_sales_data
    }), 200

# Image upload configuration — env var allows overriding to a persistent volume path
UPLOADS_BASE = os.environ.get('UPLOADS_DIR', 'static/uploads')
UPLOAD_FOLDER = os.path.join(UPLOADS_BASE, 'products')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@admin_bp.route('/products/<int:product_id>/upload-images', methods=['POST'])
@jwt_required()
@admin_required
def upload_product_images(product_id):
    """Upload multiple images for a product (main + 3 additional)"""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Create product-specific directory
    product_dir = os.path.join(UPLOAD_FOLDER, str(product_id))
    os.makedirs(product_dir, exist_ok=True)
    
    uploaded_urls = []
    
    # Process up to 4 images (main + 3 additional)
    for i in range(4):
        file_key = f'image_{i}'
        if file_key not in request.files:
            continue
            
        file = request.files[file_key]
        if file.filename == '':
            continue
            
        if not allowed_file(file.filename):
            return jsonify({'error': f'Invalid file type for {file_key}'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'File {file_key} too large (max 5MB)'}), 400
        
        # Generate filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f'image_{i}.{ext}'
        filepath = os.path.join(product_dir, filename)
        
        # Save and optimize image
        try:
            img = Image.open(file)
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Resize if too large (max 1200px width)
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(filepath, quality=85, optimize=True)
            
            # Generate URL
            url = f'/api/admin/uploads/products/{product_id}/{filename}'
            uploaded_urls.append(url)
            
        except Exception as e:
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
    
    # Update product images
    product.images = uploaded_urls
    
    # Also update image_url for backward compatibility (use first image)
    if uploaded_urls:
        product.image_url = uploaded_urls[0]
    
    db.session.commit()
    
    return jsonify({
        'message': 'Images uploaded successfully',
        'images': uploaded_urls
    }), 200

@admin_bp.route('/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOADS_BASE, filename)

# Carousel image upload
@admin_bp.route('/settings/carousel/upload-image', methods=['POST'])
@jwt_required()
@admin_required
def upload_carousel_image():
    """Upload an image for carousel slide"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': 'File too large (max 5MB)'}), 400
    
    # Create carousel directory
    carousel_dir = os.path.join(UPLOADS_BASE, 'carousel')
    os.makedirs(carousel_dir, exist_ok=True)
    
    # Generate unique filename
    import uuid
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f'carousel_{uuid.uuid4().hex[:8]}.{ext}'
    filepath = os.path.join(carousel_dir, filename)
    
    # Save and optimize image
    try:
        img = Image.open(file)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        # Resize for carousel (max 1920px width)
        max_width = 1920
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Save with optimization
        img.save(filepath, quality=85, optimize=True)
        
        # Generate URL
        url = f'/api/admin/uploads/carousel/{filename}'
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'url': url
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

# About section image upload
@admin_bp.route('/settings/about/upload-image', methods=['POST'])
@jwt_required()
@admin_required
def upload_about_image():
    """Upload an image for about section"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': 'File too large (max 5MB)'}), 400
    
    # Create about directory
    about_dir = os.path.join(UPLOADS_BASE, 'about')
    os.makedirs(about_dir, exist_ok=True)
    
    # Generate unique filename
    import uuid
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f'about_{uuid.uuid4().hex[:8]}.{ext}'
    filepath = os.path.join(about_dir, filename)
    
    # Save and optimize image
    try:
        img = Image.open(file)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        # Resize (max 1200px width)
        max_width = 1200
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Save with optimization
        img.save(filepath, quality=85, optimize=True)
        
        # Generate URL
        url = f'/api/admin/uploads/about/{filename}'
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'url': url
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

# Testimonial avatar upload
@admin_bp.route('/settings/testimonials/upload-image', methods=['POST'])
@jwt_required()
@admin_required
def upload_testimonial_image():
    """Upload an avatar for testimonial"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': 'File too large (max 5MB)'}), 400
    
    # Create testimonials directory
    testimonials_dir = os.path.join(UPLOADS_BASE, 'testimonials')
    os.makedirs(testimonials_dir, exist_ok=True)
    
    # Generate unique filename
    import uuid
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f'testimonial_{uuid.uuid4().hex[:8]}.{ext}'
    filepath = os.path.join(testimonials_dir, filename)
    
    # Save and optimize image
    try:
        img = Image.open(file)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        # Resize to square avatar (150x150)
        img = img.resize((150, 150), Image.Resampling.LANCZOS)
        
        # Save with optimization
        img.save(filepath, quality=85, optimize=True)
        
        # Generate URL
        url = f'/api/admin/uploads/testimonials/{filename}'
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'url': url
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

# Site Settings Management
@admin_bp.route('/settings', methods=['GET'])
@jwt_required()
@admin_required
def get_all_settings():
    """Get all site settings"""
    settings = SiteSetting.query.all()
    return jsonify([{
        'key': s.key,
        'value': s.value,
        'updated_at': s.updated_at.isoformat() if s.updated_at else None
    } for s in settings]), 200

@admin_bp.route('/settings/<key>', methods=['GET'])
@jwt_required()
@admin_required
def get_setting(key):
    """Get a specific setting by key"""
    setting = SiteSetting.query.filter_by(key=key).first()
    if not setting:
        return jsonify({'error': 'Setting not found'}), 404
    
    return jsonify({
        'key': setting.key,
        'value': setting.value,
        'updated_at': setting.updated_at.isoformat() if setting.updated_at else None
    }), 200

@admin_bp.route('/settings/<key>', methods=['PUT'])
@jwt_required()
@admin_required
def update_setting(key):
    """Update a setting"""
    setting = SiteSetting.query.filter_by(key=key).first()
    if not setting:
        return jsonify({'error': 'Setting not found'}), 404
    
    data = request.get_json()
    if 'value' not in data:
        return jsonify({'error': 'Value is required'}), 400
    
    setting.value = data['value']
    db.session.commit()
    
    return jsonify({
        'message': 'Setting updated successfully',
        'key': setting.key,
        'value': setting.value
    }), 200