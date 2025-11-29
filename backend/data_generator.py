# data_generator.py
import json
import time
import random
import uuid
from datetime import datetime
from faker import Faker
from confluent_kafka import Producer
from products import PRODUCTS
from config import config

# ================= CONFIGURATION =================
# Configuration depuis .env via config.py
NUM_MESSAGES = 2000  # Nombre d'avis à générer
# =================================================

fake = Faker('fr_FR')

# DATES : 27 Oct au 27 Nov 2025
DATE_DEBUT = datetime(2025, 10, 27)
DATE_FIN = datetime(2025, 11, 27)

# PRODUCTS importé depuis products.py (20 produits centralisés)

TEMPLATES_NEGATIF = [
    "La livraison de mon {product} a pris trop de temps.",
    "Le {product} est arrivé avec un défaut de fabrication.",
    "Service client inutile concernant mon {product}.",
    "Qualité décevante pour le prix du {product}.",
    "Je n'arrive pas à allumer le {product}.",
    "Le {product} ne fonctionne pas comme prévu.",
    "Déçu par le {product}, ne correspond pas à la description.",
    "Le {product} est tombé en panne après une semaine.",
    "Emballage du {product} complètement abîmé.",
    "Le {product} fait trop de bruit.",
    "Mauvaise ergonomie pour le {product}.",
    "Le {product} chauffe énormément.",
    "Rapport qualité-prix médiocre pour le {product}.",
    "Le {product} ne vaut pas son prix.",
    "Problème de compatibilité avec mon {product}."
]

TEMPLATES_POSITIF = [
    "J'adore ce {product}, il change la vie !",
    "Reçu le {product} en 24h, impressionnant.",
    "Super qualité pour ce {product}, je recommande.",
    "Le support m'a bien aidé avec mon {product}.",
    "C'est mon deuxième achat de {product}, toujours top.",
    "Excellent {product}, conforme à mes attentes.",
    "Le {product} est magnifique et fonctionne parfaitement.",
    "Très satisfait de mon {product}, qualité au rendez-vous.",
    "Le {product} dépasse mes espérances.",
    "Incroyable {product}, je le recommande à tous.",
    "Le meilleur {product} que j'ai jamais acheté.",
    "Livraison rapide et {product} impeccable.",
    "Le {product} est exactement ce que je cherchais.",
    "Rapport qualité-prix imbattable pour ce {product}.",
    "Je suis ravi de mon achat de {product}."
]

TEMPLATES_NEUTRE = [
    "Le {product} fait le job.",
    "Rien de spécial à dire sur le {product}.",
    "Le {product} est correct pour le prix.",
    "Pas mal ce {product}, sans plus.",
    "Le {product} répond aux attentes basiques."
]

def generate_dated_feedback():
    prod_name, prod_cat = random.choice(PRODUCTS)
    event_time = fake.date_time_between(start_date=DATE_DEBUT, end_date=DATE_FIN)
    
    rand = random.random()
    
    if rand > 0.6:  # 40% positif
        sentiment = "positif"
        rating = random.randint(4, 5)
        text_template = random.choice(TEMPLATES_POSITIF)
    elif rand > 0.3:  # 30% neutre
        sentiment = "neutre"
        rating = 3
        text_template = random.choice(TEMPLATES_NEUTRE)
    else:  # 30% négatif
        sentiment = "negatif"
        rating = random.randint(1, 2)
        text_template = random.choice(TEMPLATES_NEGATIF)
        
    review_text = text_template.format(product=prod_name)

    return {
        "event_id": str(uuid.uuid4()),
        "timestamp": event_time.isoformat(),
        "user_id": f"user_{random.randint(1000, 9999)}",
        "product": prod_name,
        "category": prod_cat,
        "rating": rating,
        "sentiment": sentiment,
        "text": review_text,
        "source": "data_generator"  # Identifie les données générées vs soumissions web
    }

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 GÉNÉRATEUR D'AVIS CLIENTS - VERSION ÉTENDUE")
    print("=" * 70)
    print(f"\n📊 Configuration:")
    print(f"   - Kafka: {config.KAFKA_BOOTSTRAP}")
    print(f"   - Topic: {config.KAFKA_TOPIC}")
    print(f"   - Messages à générer: {NUM_MESSAGES}")
    print(f"   - Période: {DATE_DEBUT.date()} → {DATE_FIN.date()}")
    print(f"   - Produits: {len(PRODUCTS)} différents")
    print(f"   - Templates: {len(TEMPLATES_POSITIF)} positifs, {len(TEMPLATES_NEGATIF)} négatifs, {len(TEMPLATES_NEUTRE)} neutres")
    print("\n" + "=" * 70)

    conf = {
        'bootstrap.servers': config.KAFKA_BOOTSTRAP,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': config.KAFKA_KEY,
        'sasl.password': config.KAFKA_SECRET,
        'client.id': 'python-producer-script'
    }

    producer = Producer(conf)

    print(f"\n📨 Génération et envoi de {NUM_MESSAGES} avis clients...")
    print("⏳ Cela peut prendre 2-3 minutes...\n")

    start_time = time.time()

    for i in range(NUM_MESSAGES):
        data = generate_dated_feedback()
        producer.produce(config.KAFKA_TOPIC, key=data['user_id'], value=json.dumps(data))
        
        # Flush tous les 100 messages pour éviter de surcharger la mémoire
        if (i + 1) % 100 == 0:
            producer.poll(0)
            producer.flush()
            elapsed = time.time() - start_time
            rate = (i + 1) / elapsed
            remaining = (NUM_MESSAGES - (i + 1)) / rate
            print(f"   ✓ {i + 1}/{NUM_MESSAGES} messages envoyés ({rate:.1f} msg/s) - Temps restant: ~{int(remaining)}s")
    
    # Flush final
    producer.flush()
    
    total_time = time.time() - start_time
    
    print("\n" + "=" * 70)
    print(f"✅ {NUM_MESSAGES} nouveaux messages envoyés vers Kafka !")
    print("=" * 70)
    print(f"\n⏱️  Statistiques:")
    print(f"   - Temps total: {int(total_time)}s ({int(total_time/60)}min {int(total_time%60)}s)")
    print(f"   - Vitesse moyenne: {NUM_MESSAGES/total_time:.1f} messages/seconde")
    print(f"\n💡 Prochaines étapes:")
    print(f"   1. Lancez Streamlit: streamlit run app.py")
    print(f"   2. Allez dans '⚙️ Sync Backend'")
    print(f"   3. Paramètres recommandés:")
    print(f"      - Nombre max de messages: 100 (pour tester)")
    print(f"      - Timeout: 30 secondes")
    print(f"   4. Pour tout indexer, lancez plusieurs fois la synchronisation")
    print(f"      ou augmentez les paramètres (500 messages, 60 secondes)")
    print("\n")