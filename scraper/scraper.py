import os
import requests
import psycopg2
from bs4 import BeautifulSoup
from datetime import datetime

# Configuración de la base de datos
DB_HOST = os.getenv("DB_HOST", "db_container")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "scraper_db")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# Conectar a PostgreSQL
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cursor = conn.cursor()

# Crear tabla si no existe
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Resultados (
        fecha_extraccion TIMESTAMP,
        subreddit TEXT,
        post_title TEXT,
        url TEXT,
        tiempo_extraccion float
    );
''')
conn.commit()

# Configuración de scraping

subreddit_list = ["technology","Music","funfact"]

for subreddit in subreddit_list:
    url = f"https://www.reddit.com/r/{subreddit}/hot/"
    headers = {"User-Agent": "Mozilla/5.0"}

    # Obtener la página
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Error al obtener la página: {response.status_code}")
        continue  # Skip to the next subreddit if there's an error
    
    elapsed_time = float(response.elapsed.total_seconds())

    # Analizar HTML
    soup = BeautifulSoup(response.text, "html.parser")
    posts = soup.find_all("a", id=lambda x: x and "post-title" in x)

    # Insertar datos en PostgreSQL
    for post in posts[:10]:
        title = post.text.strip()
        link = "https://www.reddit.com" + post["href"]
        cursor.execute("INSERT INTO Resultados (FECHA_EXTRACCION, SUBREDDIT, POST_TITLE, URL, TIEMPO_EXTRACCION) VALUES (%s, %s, %s, %s, %s)", (datetime.now(), subreddit, title, link,elapsed_time))

conn.commit()
cursor.close()
conn.close()
print("Datos insertados correctamente en PostgreSQL.")

