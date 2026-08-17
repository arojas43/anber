"""Seed: categorías + productos con imágenes Unsplash para Anber Lencería."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db
from app.models import Category, Product, User, UserRoles

app = create_app()

def img(photo_id, w=600, h=800):
    return f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&w={w}&h={h}&q=80"

CATEGORIES = [
    {
        "name": "Brasieres",
        "description": "Soporte, push-up y sin tirantes para cada ocasión.",
        "image_url": img("1616486338812-3dadae4b4f9d"),
    },
    {
        "name": "Conjuntos Íntimos",
        "description": "Conjuntos a juego que combinan elegancia y sensualidad.",
        "image_url": img("1620331311520-246422fd82f9"),
    },
    {
        "name": "Lencería Especial",
        "description": "Bodies, babydolls y corsés para momentos únicos.",
        "image_url": img("1515886657613-9f3515b0c78f"),
    },
    {
        "name": "Pijamas & Loungewear",
        "description": "Comodidad y estilo para el descanso en satín premium.",
        "image_url": img("1515886657613-9f3515b0c78f"),
    },
    {
        "name": "Ropa Interior",
        "description": "Bragas, tangas y calzones en encaje, algodón y seamless.",
        "image_url": img("1596472537366-615d7dc36435"),
    },
]

PRODUCTS = [
    # ── Brasieres ──────────────────────────────────────────────────────────
    {
        "cat": "Brasieres",
        "name": "Brasiere Push-Up Encaje Rosa",
        "description": "Realza tu figura con encaje francés. Relleno extraíble, aros de acero y ajuste perfecto. Tallas 32A–38D.",
        "price": 299.00,
        "compare_price": 399.00,
        "sku": "BRA-001",
        "stock": 40,
        "featured": True,
        "images": [
            img("1574291874209-574e8684640e"),
            img("1616486338812-3dadae4b4f9d"),
        ],
    },
    {
        "cat": "Brasieres",
        "name": "Brasiere Deportivo Seamless",
        "description": "Soporte de alto impacto sin costuras. Tela transpirable de microfiber. Ideal para yoga, gym o uso diario.",
        "price": 349.00,
        "compare_price": None,
        "sku": "BRA-002",
        "stock": 55,
        "featured": False,
        "images": [
            img("1616486338812-3dadae4b4f9d"),
            img("1574291874209-574e8684640e"),
        ],
    },
    {
        "cat": "Brasieres",
        "name": "Brasiere Sin Tirantes Multivía",
        "description": "Versátil: se usa normal, cruzado o halter. Relleno de gel, 5 posiciones. Perfecto bajo escotes pronunciados.",
        "price": 389.00,
        "compare_price": 459.00,
        "sku": "BRA-003",
        "stock": 30,
        "featured": False,
        "images": [
            img("1620331311520-246422fd82f9"),
            img("1616486338812-3dadae4b4f9d"),
        ],
    },
    {
        "cat": "Brasieres",
        "name": "Brasiere Balconet Encaje Borgoña",
        "description": "Corte balconet que realza el escote. Encaje Chantilly, tirantes ajustables, cierre de 3 ganchos. Sofisticado y cómodo.",
        "price": 329.00,
        "compare_price": None,
        "sku": "BRA-004",
        "stock": 25,
        "featured": True,
        "images": [
            img("1574291874209-574e8684640e"),
            img("1620331311520-246422fd82f9"),
        ],
    },

    # ── Conjuntos Íntimos ──────────────────────────────────────────────────
    {
        "cat": "Conjuntos Íntimos",
        "name": "Conjunto Encaje Floral Negro",
        "description": "Set de dos piezas en encaje floral negro: brasiere push-up y braga tipo bikini. Tela suave, sin costuras visibles.",
        "price": 549.00,
        "compare_price": 699.00,
        "sku": "SET-001",
        "stock": 35,
        "featured": True,
        "images": [
            img("1620331311520-246422fd82f9"),
            img("1574291874209-574e8684640e"),
        ],
    },
    {
        "cat": "Conjuntos Íntimos",
        "name": "Conjunto Satín Ivory",
        "description": "Elegancia atemporal en satín ivory. Brasiere sin aros y braga de tiro medio. Perfecto para el día a día.",
        "price": 599.00,
        "compare_price": None,
        "sku": "SET-002",
        "stock": 20,
        "featured": False,
        "images": [
            img("1515886657613-9f3515b0c78f"),
            img("1620331311520-246422fd82f9"),
        ],
    },
    {
        "cat": "Conjuntos Íntimos",
        "name": "Conjunto Mesh & Encaje Rosa Palo",
        "description": "Tela mesh transparente con encaje floral. Brasiere de copa suave y braga tipo tanga. Diseño moderno y seductor.",
        "price": 649.00,
        "compare_price": 799.00,
        "sku": "SET-003",
        "stock": 18,
        "featured": True,
        "images": [
            img("1555009365-513638104182"),
            img("1620331311520-246422fd82f9"),
        ],
    },

    # ── Lencería Especial ──────────────────────────────────────────────────
    {
        "cat": "Lencería Especial",
        "name": "Body de Encaje Seductor Negro",
        "description": "Body de encaje semi-transparente con cierre de presión. Escote profundo en V, tirantes ajustables. Tallas S–XL.",
        "price": 799.00,
        "compare_price": 999.00,
        "sku": "LEN-001",
        "stock": 15,
        "featured": True,
        "images": [
            img("1555009365-513638104182"),
            img("1515886657613-9f3515b0c78f"),
        ],
    },
    {
        "cat": "Lencería Especial",
        "name": "Babydoll Transparente Rosa Nude",
        "description": "Babydoll de gasa con borde de encaje y braga incluida. Corte suelto que favorece toda figura. Tirantes finos.",
        "price": 499.00,
        "compare_price": None,
        "sku": "LEN-002",
        "stock": 22,
        "featured": False,
        "images": [
            img("1515886657613-9f3515b0c78f"),
            img("1555009365-513638104182"),
        ],
    },
    {
        "cat": "Lencería Especial",
        "name": "Corsé Satín con Encaje Borgoña",
        "description": "Corsé estructurado en satín con ballenas flexibles. Cierre de ojetes con cinta de seda. Define la cintura hasta 10 cm.",
        "price": 749.00,
        "compare_price": 899.00,
        "sku": "LEN-003",
        "stock": 12,
        "featured": True,
        "images": [
            img("1620331311520-246422fd82f9"),
            img("1555009365-513638104182"),
        ],
    },

    # ── Pijamas & Loungewear ───────────────────────────────────────────────
    {
        "cat": "Pijamas & Loungewear",
        "name": "Pijama Satinado Nude Dos Piezas",
        "description": "Satén ligero color nude: camisola de tirantes y pantalón fluido. Ultra suave y fresco para el verano.",
        "price": 449.00,
        "compare_price": 549.00,
        "sku": "PIJ-001",
        "stock": 30,
        "featured": True,
        "images": [
            img("1515886657613-9f3515b0c78f"),
            img("1620331311520-246422fd82f9"),
        ],
    },
    {
        "cat": "Pijamas & Loungewear",
        "name": "Camisola & Shorts de Encaje",
        "description": "Camisola con bordado floral y shorts de tiro alto. Jersey suave con 8% elastano. Rosa, blanco o negro.",
        "price": 399.00,
        "compare_price": None,
        "sku": "PIJ-002",
        "stock": 25,
        "featured": False,
        "images": [
            img("1574291874209-574e8684640e"),
            img("1515886657613-9f3515b0c78f"),
        ],
    },
    {
        "cat": "Pijamas & Loungewear",
        "name": "Bata Kimono Satín con Encaje",
        "description": "Bata corta tipo kimono en satín con ribete de encaje en puños y dobladillo. Ciñe con cinto elegante.",
        "price": 549.00,
        "compare_price": 649.00,
        "sku": "PIJ-003",
        "stock": 18,
        "featured": True,
        "images": [
            img("1515886657613-9f3515b0c78f"),
            img("1574291874209-574e8684640e"),
        ],
    },

    # ── Ropa Interior ──────────────────────────────────────────────────────
    {
        "cat": "Ropa Interior",
        "name": "Pack 3 Bragas de Encaje Surtidas",
        "description": "Tres bragas de encaje floral: negro, nude y borgoña. Corte bikini, cinturilla suave. Talla única S–L.",
        "price": 249.00,
        "compare_price": 349.00,
        "sku": "INT-001",
        "stock": 60,
        "featured": True,
        "images": [
            img("1596472537366-615d7dc36435"),
            img("1574291874209-574e8684640e"),
        ],
    },
    {
        "cat": "Ropa Interior",
        "name": "Braga Seamless de Microfibra",
        "description": "Sin costuras, invisible bajo cualquier ropa. Transpirable, 8 colores. Tallas XS–XL.",
        "price": 99.00,
        "compare_price": None,
        "sku": "INT-002",
        "stock": 100,
        "featured": False,
        "images": [
            img("1596472537366-615d7dc36435"),
            img("1574291874209-574e8684640e"),
        ],
    },
    {
        "cat": "Ropa Interior",
        "name": "Tanga de Encaje Floral",
        "description": "Encaje floral con lazo en la cintura. Sin costuras laterales. Tallas S–XL en varios colores.",
        "price": 119.00,
        "compare_price": 149.00,
        "sku": "INT-003",
        "stock": 80,
        "featured": False,
        "images": [
            img("1596472537366-615d7dc36435"),
            img("1574291874209-574e8684640e"),
        ],
    },
    {
        "cat": "Ropa Interior",
        "name": "Braga Francesa Encaje Alto",
        "description": "Tiro alto con paneles de encaje en cadera. Corte francés favorecedor. Entrepierna de algodón para mayor comodidad.",
        "price": 149.00,
        "compare_price": None,
        "sku": "INT-004",
        "stock": 65,
        "featured": True,
        "images": [
            img("1596472537366-615d7dc36435"),
            img("1620331311520-246422fd82f9"),
        ],
    },
]

ADMIN = {
    "email": "admin@anber.mx",
    "password": "Admin123!",
    "first_name": "Admin",
    "last_name": "Anber",
}


def seed():
    with app.app_context():
        # Admin
        if not User.query.filter_by(email=ADMIN["email"]).first():
            admin = User(
                email=ADMIN["email"],
                first_name=ADMIN["first_name"],
                last_name=ADMIN["last_name"],
                role=UserRoles.ADMIN,
                is_active=True,
            )
            admin.set_password(ADMIN["password"])
            db.session.add(admin)
            db.session.commit()
            print(f"  ✓ Admin: {ADMIN['email']}  /  {ADMIN['password']}")
        else:
            print(f"  – Admin ya existe: {ADMIN['email']}")

        # Categories
        cat_map = {}
        for c in CATEGORIES:
            existing = Category.query.filter_by(name=c["name"]).first()
            if existing:
                cat_map[c["name"]] = existing
            else:
                cat = Category(
                    name=c["name"],
                    description=c["description"],
                    image_url=c["image_url"],
                    is_active=True,
                )
                db.session.add(cat)
                db.session.flush()
                cat_map[c["name"]] = cat
                print(f"  ✓ Categoría: {c['name']}")
        db.session.commit()

        # Products
        created = 0
        for p in PRODUCTS:
            if Product.query.filter_by(sku=p["sku"]).first():
                continue
            product = Product(
                name=p["name"],
                description=p["description"],
                price=p["price"],
                compare_price=p.get("compare_price"),
                sku=p["sku"],
                stock_quantity=p["stock"],
                is_active=True,
                is_featured=p.get("featured", False),
                category_id=cat_map[p["cat"]].id,
                image_url=p["images"][0],
                images=p["images"],
            )
            db.session.add(product)
            created += 1
        db.session.commit()

        total_cats = Category.query.count()
        total_prods = Product.query.count()
        print(f"\n  ✓ {created} productos creados")
        print(f"  Base de datos: {total_cats} categorías, {total_prods} productos.\n")


if __name__ == "__main__":
    print("\nSeeding Anber Lencería...\n")
    seed()
