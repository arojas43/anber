import os
from app import create_app, db
from app.models import User, UserRoles

app = create_app()

# Create tables if they don't exist
with app.app_context():
    db.create_all()

    # Create a default admin user if none exists
    admin_user = User.query.filter_by(role=UserRoles.ADMIN).first()
    if not admin_user:
        try:
            admin = User(
                email='admin@example.com',
                first_name='Admin',
                last_name='User',
                role=UserRoles.ADMIN
            )
            admin.set_password('admin123')  # Change this in production!
            db.session.add(admin)
            db.session.commit()
            print("Default admin user created: admin@example.com / admin123")
        except Exception as e:
            # Rollback in case of error
            db.session.rollback()
            # Check if it's a duplicate key error, and if so, continue without error
            if "UNIQUE constraint failed" in str(e):
                print("Admin user already exists")
            else:
                print(f"Error creating admin user: {e}")
    else:
        print("Admin user already exists")
    
    # Initialize site settings if they don't exist
    from app.models import SiteSetting
    
    # Carousel settings
    carousel_setting = SiteSetting.query.filter_by(key='home_carousel').first()
    if not carousel_setting:
        carousel_data = [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1619784299414-f5c8e8d4e3e5?q=80&w=1920&auto=format&fit=crop",
                "title": "Elegancia Femenina",
                "subtitle": "Descubre piezas únicas que realzan tu belleza natural con nuestra nueva colección de temporada.",
                "link": "/products",
                "cta": "Explorar Colección"
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=1920&auto=format&fit=crop",
                "title": "Comodidad y Estilo",
                "subtitle": "Lencería diseñada para acompañarte en cada momento de tu día.",
                "link": "/products",
                "cta": "Ver Novedades"
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=1920&auto=format&fit=crop",
                "title": "Detalles que Enamoran",
                "subtitle": "Encajes premium y acabados delicados para una experiencia inolvidable.",
                "link": "/products",
                "cta": "Comprar Ahora"
            }
        ]
        carousel = SiteSetting(key='home_carousel', value=carousel_data)
        db.session.add(carousel)
        print("Default carousel settings created")
    
    # About section settings
    about_setting = SiteSetting.query.filter_by(key='home_about').first()
    if not about_setting:
        about_data = {
            "title": "Nuestra Historia",
            "subtitle": "Elegancia que Empodera",
            "text": "Desde 2020, nos dedicamos a ofrecer lencería de la más alta calidad, combinando elegancia, comodidad y estilo. Cada pieza es cuidadosamente seleccionada para que te sientas hermosa y segura en cada momento de tu día.",
            "image": "https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop"
        }
        about = SiteSetting(key='home_about', value=about_data)
        db.session.add(about)
        print("Default about section settings created")
    
    # Testimonials settings
    testimonials_setting = SiteSetting.query.filter_by(key='home_testimonials').first()
    if not testimonials_setting:
        testimonials_data = [
            {
                "id": 1,
                "name": "Sofía Martínez",
                "text": "La calidad es increíble. Cada pieza es elegante y cómoda.",
                "rating": 5,
                "image": "https://i.pravatar.cc/150?img=5"
            },
            {
                "id": 2,
                "name": "Valentina Rodríguez",
                "text": "El envío fue rápido y el empaque es hermoso. Totalmente recomendado.",
                "rating": 5,
                "image": "https://i.pravatar.cc/150?img=9"
            },
            {
                "id": 3,
                "name": "Camila González",
                "text": "Mi tienda favorita para lencería. Diseños únicos y atemporales.",
                "rating": 5,
                "image": "https://i.pravatar.cc/150?img=10"
            }
        ]
        testimonials = SiteSetting(key='home_testimonials', value=testimonials_data)
        db.session.add(testimonials)
        print("Default testimonials settings created")
    
    db.session.commit()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=os.environ.get('FLASK_ENV') == 'development',
            host='0.0.0.0', port=port)