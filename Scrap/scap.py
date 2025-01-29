import requests
from PIL import Image
from io import BytesIO
import os

# Votre clé API Pexels
API_KEY = 'fSewTCXk1Qy2XrFRknwz9GWeQfXx7vH4Qo9gQAHei0ATQDIgopE9pHtL'  # Remplacez par votre clé API Pexels

# Crée un dossier pour sauvegarder les images si il n'existe pas
output_folder = 'product_image'
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Fonction pour récupérer l'image à partir de Pexels
def fetch_product_image(product_name):
    url = f'https://api.pexels.com/v1/search'
    headers = {
        'Authorization': API_KEY,
    }
    params = {
        'query': product_name,
        'per_page': 1,  # Limiter le nombre d'images à 1 pour chaque produit
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data['photos']:
            image_url = data['photos'][0]['src']['original']  # L'URL de l'image haute qualité
            return image_url
    return None

# Fonction pour télécharger et sauvegarder l'image
def download_image(image_url, product_name):
    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))
        image_path = os.path.join(output_folder, f'{product_name}.jpg')
        image.save(image_path)
        print(f"Image pour '{product_name}' sauvegardée à {image_path}")
    except Exception as e:
        print(f"Erreur lors du téléchargement de l'image pour '{product_name}': {e}")

# Lire la liste de produits à partir du fichier
def process_products_from_file(file_path):
    with open(file_path, 'r') as file:
        products = file.readlines()

    for product in products:
        product_name = product.strip()  # Supprimer les espaces et sauts de ligne
        print(f"Recherche d'image pour: {product_name}")
        image_url = fetch_product_image(product_name)
        if image_url:
            download_image(image_url, product_name)
        else:
            print(f"Aucune image trouvée pour '{product_name}'.")

# Exemple d'utilisation
process_products_from_file('product_list.txt')  # Remplacez par le chemin de votre fichier
