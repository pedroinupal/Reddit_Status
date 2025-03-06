from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, String, TIMESTAMP,Float,func
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
    tiempo_extraccion = Column(Float)

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


# Endpoint para obtener métricas
@app.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    metrics = db.query(
        func.count(Resultado.post_title).label("total_posts"),
        func.max(Resultado.tiempo_extraccion).label("max_extraction_time"),
        func.min(Resultado.tiempo_extraccion).label("min_extraction_time"),
        func.avg(Resultado.tiempo_extraccion).label("avg_extraction_time"),
        func.count(func.distinct(func.date(Resultado.fecha_extraccion))).label("days_extracted")
    ).first()

    return {
        "total_posts": metrics.total_posts,
        "max_extraction_time": metrics.max_extraction_time,
        "min_extraction_time": metrics.min_extraction_time,
        "avg_extraction_time": metrics.avg_extraction_time,
        "days_extracted": metrics.days_extracted
    }
