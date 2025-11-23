from app import create_app, db
from app.models import Product, Category, User, UserRoles
from werkzeug.security import generate_password_hash

app = create_app()

def seed_products():
    with app.app_context():
        # Create Categories
        categories = [
            {'name': 'Brasieres', 'description': 'Soporte y estilo para cada día'},
            {'name': 'Panties', 'description': 'Comodidad y sensualidad'},
            {'name': 'Lencería de Encaje', 'description': 'Detalles delicados para momentos especiales'},
            {'name': 'Pijamas', 'description': 'Para un descanso perfecto'}
        ]

        created_categories = []
        for cat_data in categories:
            category = Category.query.filter_by(name=cat_data['name']).first()
            if not category:
                category = Category(name=cat_data['name'], description=cat_data['description'])
                db.session.add(category)
            created_categories.append(category)
        
        db.session.commit()

        # Create Products
        products = [
            {
                'name': 'Set de Encaje Floral Rosa',
                'description': 'Hermoso conjunto de encaje floral en tono rosa pastel. Incluye brasier con soporte y panty a juego.',
                'price': 899.00,
                'sku': 'SET-ROSA-001',
                'category': 'Lencería de Encaje',
                'image_url': 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop'
            },
            {
                'name': 'Brasier Push-up Satinado',
                'description': 'Brasier push-up con acabado satinado suave. Realza tu figura con elegancia.',
                'price': 549.00,
                'sku': 'BRA-SATIN-002',
                'category': 'Brasieres',
                'image_url': 'https://images.unsplash.com/photo-1574291874209-574e8684640e?q=80&w=800&auto=format&fit=crop'
            },
            {
                'name': 'Panty de Seda',
                'description': 'Panty de seda ultra suave con detalles de encaje en los bordes. Máxima comodidad.',
                'price': 299.00,
                'sku': 'PANTY-SEDA-003',
                'category': 'Panties',
                'image_url': 'https://images.unsplash.com/photo-1596472537366-615d7dc36435?q=80&w=800&auto=format&fit=crop'
            },
            {
                'name': 'Bata de Dormir Kimono',
                'description': 'Bata estilo kimono ligera y fresca. Perfecta para relajarse en casa.',
                'price': 1200.00,
                'sku': 'BATA-KIM-004',
                'category': 'Pijamas',
                'image_url': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
            },
            {
                'name': 'Body de Encaje Negro',
                'description': 'Body completo de encaje negro con transparencias sutiles. Elegante y atrevido.',
                'price': 950.00,
                'sku': 'BODY-BLK-005',
                'category': 'Lencería de Encaje',
                'image_url': 'https://images.unsplash.com/photo-1555009365-513638104182?q=80&w=800&auto=format&fit=crop'
            },
            {
                'name': 'Set Bralette Triángulo',
                'description': 'Bralette sin varillas en forma de triángulo, muy cómodo para uso diario.',
                'price': 450.00,
                'sku': 'BRA-TRI-006',
                'category': 'Brasieres',
                'image_url': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=800&auto=format&fit=crop'
            }
        ]

        for prod_data in products:
            product = Product.query.filter_by(sku=prod_data['sku']).first()
            if not product:
                # Find category ID
                cat = Category.query.filter_by(name=prod_data['category']).first()
                if cat:
                    product = Product(
                        name=prod_data['name'],
                        description=prod_data['description'],
                        price=prod_data['price'],
                        sku=prod_data['sku'],
                        category_id=cat.id,
                        image_url=prod_data['image_url'],
                        stock_quantity=50,
                        is_active=True
                    )
                    db.session.add(product)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_products()
