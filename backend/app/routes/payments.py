import os
import mercadopago
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Order, OrderItem, Product, User
from app.routes import main_bp


def get_sdk():
    access_token = os.environ.get('MP_ACCESS_TOKEN', '')
    return mercadopago.SDK(access_token)


@main_bp.route('/payments/create-preference', methods=['POST'])
@jwt_required()
def create_payment_preference():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    items = data.get('items', [])
    shipping_address = data.get('shipping_address', '')

    if not items:
        return jsonify({'error': 'El carrito está vacío'}), 400

    app_url = os.environ.get('APP_URL', 'http://localhost:5173')

    preference_items = []
    for item in items:
        product = Product.query.get(item.get('product_id'))
        if not product:
            return jsonify({'error': f'Producto {item.get("product_id")} no encontrado'}), 404
        preference_items.append({
            'id': str(product.id),
            'title': product.name,
            'quantity': int(item.get('quantity', 1)),
            'unit_price': float(product.price),
            'currency_id': 'MXN',
        })

    preference_data = {
        'items': preference_items,
        'payer': {
            'name': user.first_name,
            'surname': user.last_name,
            'email': user.email,
        },
        'back_urls': {
            'success': f'{app_url}/checkout/success',
            'failure': f'{app_url}/checkout/failure',
            'pending': f'{app_url}/checkout/pending',
        },
        'auto_return': 'approved',
        'notification_url': f'{os.environ.get("BACKEND_URL", app_url)}/api/payments/webhook',
        'metadata': {
            'user_id': current_user_id,
            'shipping_address': shipping_address,
        },
        'statement_descriptor': 'Anber Lencería',
    }

    try:
        sdk = get_sdk()
        result = sdk.preference().create(preference_data)
        preference = result.get('response', {})

        if result.get('status') not in (200, 201):
            return jsonify({'error': 'Error al crear preferencia de pago', 'detail': preference}), 502

        return jsonify({
            'preference_id': preference.get('id'),
            'init_point': preference.get('init_point'),
            'sandbox_init_point': preference.get('sandbox_init_point'),
        }), 200

    except Exception as e:
        return jsonify({'error': f'Error al conectar con Mercado Pago: {str(e)}'}), 502


@main_bp.route('/payments/webhook', methods=['POST'])
def payment_webhook():
    """Recibe notificaciones de Mercado Pago y actualiza el estado del pedido."""
    try:
        data = request.get_json(silent=True) or {}
        topic = data.get('type') or request.args.get('topic', '')
        resource_id = data.get('data', {}).get('id') or request.args.get('id')

        if topic == 'payment' and resource_id:
            sdk = get_sdk()
            payment_info = sdk.payment().get(resource_id)
            payment = payment_info.get('response', {})
            status = payment.get('status')
            metadata = payment.get('metadata', {})
            user_id = metadata.get('user_id')

            order_status_map = {
                'approved': 'confirmed',
                'pending': 'pending',
                'in_process': 'pending',
                'rejected': 'cancelled',
                'cancelled': 'cancelled',
                'refunded': 'cancelled',
            }
            new_status = order_status_map.get(status, 'pending')

            # Update the most recent pending order for this user
            if user_id:
                order = Order.query.filter_by(
                    user_id=user_id, status='pending'
                ).order_by(Order.created_at.desc()).first()

                if order:
                    order.status = new_status
                    db.session.commit()

    except Exception as e:
        print(f'Webhook error: {e}')

    return jsonify({'status': 'ok'}), 200


@main_bp.route('/payments/status/<payment_id>', methods=['GET'])
@jwt_required()
def get_payment_status(payment_id):
    try:
        sdk = get_sdk()
        result = sdk.payment().get(payment_id)
        payment = result.get('response', {})
        return jsonify({
            'status': payment.get('status'),
            'status_detail': payment.get('status_detail'),
            'amount': payment.get('transaction_amount'),
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 502
