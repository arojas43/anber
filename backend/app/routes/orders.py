from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Order, OrderItem, User, Product
from app.routes import products_bp
import uuid
from datetime import datetime

@products_bp.route('/cart/add', methods=['POST'])
@jwt_required(optional=True)  # Optional because users can add to cart without being logged in
def add_to_cart():
    # This would typically be handled by frontend, but we can have an API endpoint for it
    # For now, let's just return a success message
    return jsonify({'message': 'Item added to cart'}), 200

@products_bp.route('/cart', methods=['GET'])
@jwt_required(optional=True)
def get_cart():
    # For this demo, we'll return empty cart
    # In real app, this would retrieve cart from session or database
    return jsonify({'items': []}), 200

@products_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['items', 'shipping_address']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Calculate total
    subtotal = 0
    order_items = []
    
    for item_data in data['items']:
        product = Product.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Product {item_data["product_id"]} not found'}), 404
        
        if product.stock_quantity < item_data['quantity']:
            return jsonify({'error': f'Insufficient stock for {product.name}'}), 400
        
        item_total = float(product.price) * item_data['quantity']
        subtotal += item_total
        
        order_item = OrderItem(
            product_id=item_data['product_id'],
            variant_id=item_data.get('variant_id'),
            quantity=item_data['quantity'],
            unit_price=product.price,
            total_price=item_total
        )
        order_items.append(order_item)
    
    # Calculate tax and total
    tax_rate = 0.16  # 16% VAT for Mexico
    tax = subtotal * tax_rate
    total = subtotal + tax
    
    # Generate order number
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    # Create order
    order = Order(
        order_number=order_number,
        user_id=current_user_id,
        subtotal=subtotal,
        tax=tax,
        total=total,
        shipping_address=data['shipping_address'],
        billing_address=data.get('billing_address', data['shipping_address']),
        notes=data.get('notes', ''),
        status='confirmed'
    )
    
    # Add items to order
    for item in order_items:
        order.items.append(item)
    
    # Update product stock
    for item_data in data['items']:
        product = Product.query.get(item_data['product_id'])
        product.stock_quantity -= item_data['quantity']
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order_number': order_number,
        'total': total
    }), 201

@products_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    current_user_id = int(get_jwt_identity())
    
    # Check if user is admin to view all orders
    user = User.query.get(current_user_id)
    if user.role.value == 'admin':
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=current_user_id).all()
    
    return jsonify([{
        'id': order.id,
        'order_number': order.order_number,
        'status': order.status,
        'total': float(order.total),
        'currency': order.currency,
        'created_at': order.created_at.isoformat(),
        'items': [{
            'product_id': item.product_id,
            'product_name': item.product.name,
            'quantity': item.quantity,
            'unit_price': float(item.unit_price),
            'total_price': float(item.total_price)
        } for item in order.items]
    } for order in orders]), 200

@products_bp.route('/orders/<order_number>', methods=['GET'])
@jwt_required()
def get_order(order_number):
    current_user_id = int(get_jwt_identity())
    
    order = Order.query.filter_by(order_number=order_number).first()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check if user is admin or if it's their order
    user = User.query.get(current_user_id)
    if user.role.value != 'admin' and order.user_id != current_user_id:
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify({
        'id': order.id,
        'order_number': order.order_number,
        'status': order.status,
        'subtotal': float(order.subtotal),
        'tax': float(order.tax),
        'shipping': float(order.shipping),
        'total': float(order.total),
        'currency': order.currency,
        'shipping_address': order.shipping_address,
        'billing_address': order.billing_address,
        'notes': order.notes,
        'created_at': order.created_at.isoformat(),
        'items': [{
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product.name,
            'variant_id': item.variant_id,
            'variant_name': item.variant.name if item.variant else None,
            'quantity': item.quantity,
            'unit_price': float(item.unit_price),
            'total_price': float(item.total_price)
        } for item in order.items]
    }), 200