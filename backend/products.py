"""
Liste centralisée des produits et catégories
Source unique de vérité pour tout le backend
"""

# Liste complète des produits avec leurs catégories
PRODUCTS = [
    ("Smartphone Galaxy X", "Electronics"),
    ("Laptop Pro 15", "Electronics"),
    ("Casque NoiseCancel", "Electronics"),
    ("Montre Connectée", "Electronics"),
    ("Télévision 4K", "Electronics"),
    ("Console de Jeux", "Electronics"),
    ("Clavier Mécanique", "Electronics"),
    ("Souris Gaming", "Electronics"),
    ("Écouteurs Bluetooth", "Electronics"),
    ("Chaussures Running", "Fashion"),
    ("Jean Vintage", "Fashion"),
    ("Sac à dos", "Fashion"),
    ("Lunettes de soleil", "Fashion"),
    ("Chemise", "Fashion"),
    ("Pantalon", "Fashion"),
    ("Machine Espresso", "Home"),
    ("Robot Cuisine", "Home"),
    ("Cafetière", "Home"),
    ("Mixeur", "Home"),
    ("Aspirateur", "Home"),
]

# Dictionnaire produit -> catégorie pour lookup rapide
PRODUCT_CATEGORIES = {name: category for name, category in PRODUCTS}

# Liste des noms de produits uniquement
PRODUCT_NAMES = [name for name, _ in PRODUCTS]
