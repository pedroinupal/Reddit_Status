from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, String, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from fastapi.middleware.cors import CORSMiddleware  # Importar CORS

# Configurar la base de datos
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de resultados
class Resultado(Base):
    __tablename__ = "resultados"
    fecha_extraccion = Column(TIMESTAMP, primary_key=True)
    subreddit = Column(String, primary_key=True)
    post_title = Column(String, primary_key=True)
    url = Column(String)

# Crear la aplicación FastAPI
app = FastAPI()

# Configuración del middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes, puedes especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Dependencia para obtener la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para obtener los posts
@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    return db.query(Resultado).all()

# Endpoint de salud
@app.get("/health")
def health_check():
    return {"status": "ok"}

