from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date, time
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Helper function to convert date to datetime for MongoDB compatibility
def date_to_datetime(d):
    if isinstance(d, date) and not isinstance(d, datetime):
        return datetime.combine(d, time())
    return d

# Create the main app without a prefix
app = FastAPI(title="Gallinapp API", description="Sistema de gestión avícola integral")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class AnimalType(str, Enum):
    PONEDORA = "ponedora"
    ENGORDE = "engorde"
    REPRODUCTOR = "reproductor"

class AnimalStatus(str, Enum):
    ACTIVO = "activo"
    VENDIDO = "vendido"
    MUERTO = "muerto"
    TRANSFERIDO = "transferido"

class IncubationStatus(str, Enum):
    ACTIVO = "activo"
    ECLOSIONADO = "eclosionado"
    FALLIDO = "fallido"
    CANCELADO = "cancelado"

class EggType(str, Enum):
    COMERCIAL = "comercial"
    FERTIL = "fertil"

class TransactionType(str, Enum):
    INGRESO = "ingreso"
    EGRESO = "egreso"

# Models
class Animal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lote: str
    tipo: AnimalType
    raza: str
    cantidad: int
    fecha_ingreso: date
    edad_dias: int
    peso_promedio: float
    estado: AnimalStatus = AnimalStatus.ACTIVO
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AnimalCreate(BaseModel):
    lote: str
    tipo: AnimalType
    raza: str
    cantidad: int
    fecha_ingreso: date
    edad_dias: int
    peso_promedio: float
    observaciones: Optional[str] = None

class AnimalUpdate(BaseModel):
    cantidad: Optional[int] = None
    peso_promedio: Optional[float] = None
    estado: Optional[AnimalStatus] = None
    observaciones: Optional[str] = None

class IncubationBatch(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lote: str
    tipo_huevo: AnimalType  # ponedora o engorde
    raza: str
    cantidad_huevos: int
    fecha_incubacion: date
    fecha_eclosion_esperada: date
    temperatura: float = 37.5
    humedad: float = 60.0
    estado: IncubationStatus = IncubationStatus.ACTIVO
    pollitos_eclosionados: int = 0
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class IncubationCreate(BaseModel):
    lote: str
    tipo_huevo: AnimalType
    raza: str
    cantidad_huevos: int
    fecha_incubacion: date
    fecha_eclosion_esperada: date
    temperatura: float = 37.5
    humedad: float = 60.0
    observaciones: Optional[str] = None

class IncubationUpdate(BaseModel):
    temperatura: Optional[float] = None
    humedad: Optional[float] = None
    estado: Optional[IncubationStatus] = None
    pollitos_eclosionados: Optional[int] = None
    observaciones: Optional[str] = None

class EggCollection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fecha: date
    lote_origen: str
    tipo: EggType
    cantidad: int
    peso_total: float
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EggCollectionCreate(BaseModel):
    fecha: date
    lote_origen: str
    tipo: EggType
    cantidad: int
    peso_total: float
    observaciones: Optional[str] = None

class FeedCalculation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lote: str
    tipo_animal: AnimalType
    cantidad_animales: int
    edad_dias: int
    peso_promedio: float
    consumo_diario_kg: float
    consumo_mensual_kg: float
    costo_estimado: float
    fecha_calculo: date
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FeedCalculationCreate(BaseModel):
    lote: str
    tipo_animal: AnimalType
    cantidad_animales: int
    edad_dias: int
    peso_promedio: float
    precio_alimento_kg: float
    observaciones: Optional[str] = None

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fecha: date
    tipo: TransactionType
    concepto: str
    categoria: str
    cantidad: Optional[int] = None
    unidad: Optional[str] = None
    precio_unitario: float
    total: float
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    fecha: date
    tipo: TransactionType
    concepto: str
    categoria: str
    cantidad: Optional[int] = None
    unidad: Optional[str] = None
    precio_unitario: float
    total: float
    observaciones: Optional[str] = None

class Dashboard(BaseModel):
    total_animales: int
    total_ponedoras: int
    total_engorde: int
    total_reproductores: int
    huevos_hoy: int
    huevos_mes: int
    incubaciones_activas: int
    balance_mes: float
    ultimas_recolecciones: List[EggCollection]
    lotes_proximos_venta: List[Animal]

# Routes - Animals
@api_router.post("/animals", response_model=Animal)
async def create_animal(animal: AnimalCreate):
    animal_dict = animal.dict()
    # Convert date to datetime for MongoDB compatibility
    animal_dict["fecha_ingreso"] = date_to_datetime(animal_dict["fecha_ingreso"])
    animal_obj = Animal(**animal_dict)
    await db.animals.insert_one(animal_obj.dict())
    return animal_obj

@api_router.get("/animals", response_model=List[Animal])
async def get_animals():
    animals = await db.animals.find().to_list(1000)
    return [Animal(**animal) for animal in animals]

@api_router.get("/animals/{animal_id}", response_model=Animal)
async def get_animal(animal_id: str):
    animal = await db.animals.find_one({"id": animal_id})
    if not animal:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return Animal(**animal)

@api_router.put("/animals/{animal_id}", response_model=Animal)
async def update_animal(animal_id: str, animal_update: AnimalUpdate):
    existing_animal = await db.animals.find_one({"id": animal_id})
    if not existing_animal:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    
    update_data = animal_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.animals.update_one({"id": animal_id}, {"$set": update_data})
    updated_animal = await db.animals.find_one({"id": animal_id})
    return Animal(**updated_animal)

@api_router.delete("/animals/{animal_id}")
async def delete_animal(animal_id: str):
    result = await db.animals.delete_one({"id": animal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return {"message": "Animal eliminado exitosamente"}

# Routes - Incubation
@api_router.post("/incubation", response_model=IncubationBatch)
async def create_incubation(incubation: IncubationCreate):
    incubation_dict = incubation.dict()
    incubation_obj = IncubationBatch(**incubation_dict)
    await db.incubation_batches.insert_one(incubation_obj.dict())
    return incubation_obj

@api_router.get("/incubation", response_model=List[IncubationBatch])
async def get_incubation_batches():
    batches = await db.incubation_batches.find().to_list(1000)
    return [IncubationBatch(**batch) for batch in batches]

@api_router.put("/incubation/{batch_id}", response_model=IncubationBatch)
async def update_incubation(batch_id: str, incubation_update: IncubationUpdate):
    existing_batch = await db.incubation_batches.find_one({"id": batch_id})
    if not existing_batch:
        raise HTTPException(status_code=404, detail="Lote de incubación no encontrado")
    
    update_data = incubation_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.incubation_batches.update_one({"id": batch_id}, {"$set": update_data})
    updated_batch = await db.incubation_batches.find_one({"id": batch_id})
    return IncubationBatch(**updated_batch)

# Routes - Egg Collection
@api_router.post("/egg-collection", response_model=EggCollection)
async def create_egg_collection(egg_collection: EggCollectionCreate):
    collection_dict = egg_collection.dict()
    collection_obj = EggCollection(**collection_dict)
    await db.egg_collections.insert_one(collection_obj.dict())
    return collection_obj

@api_router.get("/egg-collection", response_model=List[EggCollection])
async def get_egg_collections():
    collections = await db.egg_collections.find().sort("fecha", -1).to_list(1000)
    return [EggCollection(**collection) for collection in collections]

@api_router.get("/egg-collection/today", response_model=List[EggCollection])
async def get_today_egg_collections():
    today = date.today()
    collections = await db.egg_collections.find({"fecha": today}).to_list(1000)
    return [EggCollection(**collection) for collection in collections]

# Routes - Feed Calculator
@api_router.post("/feed-calculator", response_model=FeedCalculation)
async def calculate_feed(feed_data: FeedCalculationCreate):
    # Cálculo de consumo basado en tipo de animal y edad
    if feed_data.tipo_animal == AnimalType.PONEDORA:
        if feed_data.edad_dias < 42:  # Pollita
            consumo_diario = feed_data.cantidad_animales * 0.030  # 30g por día
        elif feed_data.edad_dias < 140:  # Levante
            consumo_diario = feed_data.cantidad_animales * 0.080  # 80g por día
        else:  # Producción
            consumo_diario = feed_data.cantidad_animales * 0.120  # 120g por día
    elif feed_data.tipo_animal == AnimalType.ENGORDE:
        if feed_data.edad_dias < 14:  # Inicio
            consumo_diario = feed_data.cantidad_animales * 0.025  # 25g por día
        elif feed_data.edad_dias < 35:  # Crecimiento
            consumo_diario = feed_data.cantidad_animales * 0.100  # 100g por día
        else:  # Finalización
            consumo_diario = feed_data.cantidad_animales * 0.150  # 150g por día
    else:  # Reproductor
        consumo_diario = feed_data.cantidad_animales * 0.160  # 160g por día
    
    consumo_mensual = consumo_diario * 30
    costo_estimado = consumo_mensual * feed_data.precio_alimento_kg
    
    calculation_dict = feed_data.dict()
    calculation_dict.update({
        "consumo_diario_kg": consumo_diario,
        "consumo_mensual_kg": consumo_mensual,
        "costo_estimado": costo_estimado,
        "fecha_calculo": date.today()
    })
    
    calculation_obj = FeedCalculation(**calculation_dict)
    await db.feed_calculations.insert_one(calculation_obj.dict())
    return calculation_obj

@api_router.get("/feed-calculator", response_model=List[FeedCalculation])
async def get_feed_calculations():
    calculations = await db.feed_calculations.find().sort("fecha_calculo", -1).to_list(1000)
    return [FeedCalculation(**calc) for calc in calculations]

# Routes - Transactions
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    transaction_dict = transaction.dict()
    transaction_obj = Transaction(**transaction_dict)
    await db.transactions.insert_one(transaction_obj.dict())
    return transaction_obj

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions():
    transactions = await db.transactions.find().sort("fecha", -1).to_list(1000)
    return [Transaction(**transaction) for transaction in transactions]

@api_router.get("/transactions/balance")
async def get_balance():
    ingresos = await db.transactions.aggregate([
        {"$match": {"tipo": "ingreso"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]).to_list(1)
    
    egresos = await db.transactions.aggregate([
        {"$match": {"tipo": "egreso"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]).to_list(1)
    
    total_ingresos = ingresos[0]["total"] if ingresos else 0
    total_egresos = egresos[0]["total"] if egresos else 0
    
    return {
        "total_ingresos": total_ingresos,
        "total_egresos": total_egresos,
        "balance": total_ingresos - total_egresos
    }

# Routes - Dashboard
@api_router.get("/dashboard", response_model=Dashboard)
async def get_dashboard():
    # Obtener totales de animales
    total_animales = await db.animals.count_documents({"estado": "activo"})
    total_ponedoras = await db.animals.count_documents({"tipo": "ponedora", "estado": "activo"})
    total_engorde = await db.animals.count_documents({"tipo": "engorde", "estado": "activo"})
    total_reproductores = await db.animals.count_documents({"tipo": "reproductor", "estado": "activo"})
    
    # Obtener recolección de huevos
    today = date.today()
    huevos_hoy = await db.egg_collections.aggregate([
        {"$match": {"fecha": today}},
        {"$group": {"_id": None, "total": {"$sum": "$cantidad"}}}
    ]).to_list(1)
    
    # Obtener huevos del mes
    from calendar import monthrange
    start_month = today.replace(day=1)
    end_month = today.replace(day=monthrange(today.year, today.month)[1])
    
    huevos_mes = await db.egg_collections.aggregate([
        {"$match": {"fecha": {"$gte": start_month, "$lte": end_month}}},
        {"$group": {"_id": None, "total": {"$sum": "$cantidad"}}}
    ]).to_list(1)
    
    # Obtener incubaciones activas
    incubaciones_activas = await db.incubation_batches.count_documents({"estado": "activo"})
    
    # Obtener balance del mes
    balance_mes = await db.transactions.aggregate([
        {"$match": {"fecha": {"$gte": start_month, "$lte": end_month}}},
        {"$group": {
            "_id": "$tipo",
            "total": {"$sum": "$total"}
        }}
    ]).to_list(2)
    
    ingresos_mes = 0
    egresos_mes = 0
    for item in balance_mes:
        if item["_id"] == "ingreso":
            ingresos_mes = item["total"]
        elif item["_id"] == "egreso":
            egresos_mes = item["total"]
    
    # Obtener últimas recolecciones
    ultimas_recolecciones = await db.egg_collections.find().sort("fecha", -1).limit(5).to_list(5)
    
    # Obtener lotes próximos a venta (más de 35 días para engorde)
    lotes_proximos_venta = await db.animals.find({
        "tipo": "engorde",
        "edad_dias": {"$gte": 35},
        "estado": "activo"
    }).limit(5).to_list(5)
    
    return Dashboard(
        total_animales=total_animales,
        total_ponedoras=total_ponedoras,
        total_engorde=total_engorde,
        total_reproductores=total_reproductores,
        huevos_hoy=huevos_hoy[0]["total"] if huevos_hoy else 0,
        huevos_mes=huevos_mes[0]["total"] if huevos_mes else 0,
        incubaciones_activas=incubaciones_activas,
        balance_mes=ingresos_mes - egresos_mes,
        ultimas_recolecciones=[EggCollection(**col) for col in ultimas_recolecciones],
        lotes_proximos_venta=[Animal(**animal) for animal in lotes_proximos_venta]
    )

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "app": "Gallinapp", "version": "1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()