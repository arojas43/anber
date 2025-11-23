from app import create_app, db
from app.models import User, UserRoles

app = create_app()

with app.app_context():
    # Find the admin user
    admin = User.query.filter_by(email='admin@example.com').first()
    
    if admin:
        print(f"Found admin user: {admin.email}")
        admin.set_password('admin123')
        admin.role = UserRoles.ADMIN # Ensure role is admin
        admin.is_active = True
        db.session.commit()
        print("Password reset to 'admin123'")
    else:
        print("Admin user not found. Creating new one...")
        admin = User(
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            role=UserRoles.ADMIN,
            is_active=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Created new admin user: admin@example.com / admin123")
