from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Product, Category, ProductVariant, User
from app.routes import products_bp

@products_bp.route('/', methods=['GET'])
def get_products():
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '')
    featured = request.args.get('featured', '').lower() in ('1', 'true', 'yes')

    # Build query
    query = Product.query.filter_by(is_active=True)

    if category_id:
        query = query.filter_by(category_id=category_id)

    if search:
        query = query.filter(Product.name.contains(search) | Product.description.contains(search))

    if featured:
        query = query.filter_by(is_featured=True)
    
    # Paginate results
    products = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'products': [{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': float(p.price),
            'compare_price': float(p.compare_price) if p.compare_price else None,
            'sku': p.sku,
            'stock_quantity': p.stock_quantity,
            'is_featured': p.is_featured,
            'category_id': p.category_id,
            'category_name': p.category.name if p.category else None,
            'image_url': p.image_url,
            'images': p.images or ([p.image_url] if p.image_url else []),
            'created_at': p.created_at.isoformat() if p.created_at else None
        } for p in products.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': products.total,
            'pages': products.pages
        }
    }), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.filter_by(id=product_id, is_active=True).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': float(product.price),
        'compare_price': float(product.compare_price) if product.compare_price else None,
        'sku': product.sku,
        'stock_quantity': product.stock_quantity,
        'is_featured': product.is_featured,
        'category_id': product.category_id,
        'category_name': product.category.name if product.category else None,
        'image_url': product.image_url,
        'variants': [{
            'id': v.id,
            'name': v.name,
            'sku': v.sku,
            'price': float(v.price) if v.price else float(product.price),
            'stock_quantity': v.stock_quantity
        } for v in product.variants if v.is_active],
        'created_at': product.created_at.isoformat() if product.created_at else None,
        'updated_at': product.updated_at.isoformat() if product.updated_at else None
    }), 200

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(is_active=True).all()
    
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'image_url': c.image_url
    } for c in categories]), 200