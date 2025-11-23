import sqlite3
from werkzeug.security import generate_password_hash

# Connect to the database directly
conn = sqlite3.connect('instance/ecommerce.db')
cursor = conn.cursor()

email = 'admin@example.com'
password = 'admin123'
password_hash = generate_password_hash(password)

# Check if user exists
cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
user = cursor.fetchone()

if user:
    print(f"Found user {email}. Updating password...")
    # Update password and ensure role is 'admin' (or 'ADMIN' depending on what's expected)
    # We'll try to set it to 'ADMIN' which matches the Enum name, just in case
    # But wait, the model defined values as 'admin'. 
    # Let's check what's currently there.
    cursor.execute("SELECT role FROM users WHERE email = ?", (email,))
    role = cursor.fetchone()[0]
    print(f"Current role: {role}")
    
    # Update
    cursor.execute("UPDATE users SET password_hash = ?, role = 'ADMIN', is_active = 1 WHERE email = ?", (password_hash, email))
    print("Password updated.")
else:
    print(f"User {email} not found. Creating...")
    # Insert new admin
    cursor.execute("""
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
        VALUES (?, ?, 'Admin', 'User', 'ADMIN', 1, datetime('now'), datetime('now'))
    """, (email, password_hash))
    print("User created.")

conn.commit()
conn.close()
