from database import SessionLocal
from models import Category

db = SessionLocal()
try:
    categories = db.query(Category).all()
    print("Current categories in database:")
    for cat in categories:
        print(f"  ID: {cat.id}, Name: {cat.name}")
finally:
    db.close()
