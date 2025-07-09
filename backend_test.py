#!/usr/bin/env python3
import requests
import json
from datetime import datetime, date, timedelta
import uuid
import time
import os

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test data
test_data = {
    "animal_ponedora": {
        "lote": "Lote-P1",
        "tipo": "ponedora",
        "raza": "Isa Brown",
        "cantidad": 100,
        "fecha_ingreso": date.today().isoformat(),
        "edad_dias": 120,
        "peso_promedio": 1.8,
        "observaciones": "Lote de prueba ponedoras"
    },
    "animal_engorde": {
        "lote": "Lote-E1",
        "tipo": "engorde",
        "raza": "Ross 308",
        "cantidad": 200,
        "fecha_ingreso": date.today().isoformat(),
        "edad_dias": 25,
        "peso_promedio": 1.2,
        "observaciones": "Lote de prueba engorde"
    },
    "animal_reproductor": {
        "lote": "Lote-R1",
        "tipo": "reproductor",
        "raza": "Plymouth Rock",
        "cantidad": 50,
        "fecha_ingreso": date.today().isoformat(),
        "edad_dias": 180,
        "peso_promedio": 2.5,
        "observaciones": "Lote de prueba reproductores"
    },
    "incubation": {
        "lote": "Inc-1",
        "tipo_huevo": "ponedora",
        "raza": "Isa Brown",
        "cantidad_huevos": 120,
        "fecha_incubacion": date.today().isoformat(),
        "fecha_eclosion_esperada": (date.today() + timedelta(days=21)).isoformat(),
        "temperatura": 37.8,
        "humedad": 65.0,
        "observaciones": "Incubación de prueba"
    },
    "egg_collection_comercial": {
        "fecha": date.today().isoformat(),
        "lote_origen": "Lote-P1",
        "tipo": "comercial",
        "cantidad": 80,
        "peso_total": 4.8,
        "observaciones": "Recolección comercial de prueba"
    },
    "egg_collection_fertil": {
        "fecha": date.today().isoformat(),
        "lote_origen": "Lote-R1",
        "tipo": "fertil",
        "cantidad": 30,
        "peso_total": 1.8,
        "observaciones": "Recolección fértil de prueba"
    },
    "feed_calculation_ponedora": {
        "lote": "Lote-P1",
        "tipo_animal": "ponedora",
        "cantidad_animales": 100,
        "edad_dias": 120,
        "peso_promedio": 1.8,
        "precio_alimento_kg": 0.5,
        "observaciones": "Cálculo de alimento ponedoras"
    },
    "feed_calculation_engorde": {
        "lote": "Lote-E1",
        "tipo_animal": "engorde",
        "cantidad_animales": 200,
        "edad_dias": 25,
        "peso_promedio": 1.2,
        "precio_alimento_kg": 0.6,
        "observaciones": "Cálculo de alimento engorde"
    },
    "transaction_ingreso": {
        "fecha": date.today().isoformat(),
        "tipo": "ingreso",
        "concepto": "Venta de huevos",
        "categoria": "Ventas",
        "cantidad": 100,
        "unidad": "docenas",
        "precio_unitario": 3.5,
        "total": 350.0,
        "observaciones": "Ingreso de prueba"
    },
    "transaction_egreso": {
        "fecha": date.today().isoformat(),
        "tipo": "egreso",
        "concepto": "Compra de alimento",
        "categoria": "Insumos",
        "cantidad": 500,
        "unidad": "kg",
        "precio_unitario": 0.5,
        "total": 250.0,
        "observaciones": "Egreso de prueba"
    }
}

# Store created IDs
created_ids = {}

def print_separator(title):
    print("\n" + "="*80)
    print(f" {title} ".center(80, "="))
    print("="*80 + "\n")

def test_health_check():
    print_separator("Testing Health Check")
    response = requests.get(f"{API_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["app"] == "Gallinapp"
    
    print("✅ Health check passed")
    return True

def test_animals_crud():
    print_separator("Testing Animals CRUD Operations")
    
    # Create animals
    animal_types = ["ponedora", "engorde", "reproductor"]
    for animal_type in animal_types:
        print(f"\n--- Creating {animal_type} ---")
        response = requests.post(f"{API_URL}/animals", json=test_data[f"animal_{animal_type}"])
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        created_ids[f"animal_{animal_type}"] = response.json()["id"]
    
    # Get all animals
    print("\n--- Getting all animals ---")
    response = requests.get(f"{API_URL}/animals")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} animals")
    
    assert response.status_code == 200
    assert len(response.json()) >= 3
    
    # Get specific animal
    print("\n--- Getting specific animal ---")
    animal_id = created_ids["animal_ponedora"]
    response = requests.get(f"{API_URL}/animals/{animal_id}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["id"] == animal_id
    
    # Update animal
    print("\n--- Updating animal ---")
    update_data = {
        "cantidad": 95,
        "peso_promedio": 1.9,
        "observaciones": "Lote actualizado"
    }
    response = requests.put(f"{API_URL}/animals/{animal_id}", json=update_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["cantidad"] == 95
    assert response.json()["peso_promedio"] == 1.9
    assert response.json()["observaciones"] == "Lote actualizado"
    
    # Test non-existent animal
    print("\n--- Testing non-existent animal ---")
    fake_id = str(uuid.uuid4())
    response = requests.get(f"{API_URL}/animals/{fake_id}")
    print(f"Status Code: {response.status_code}")
    
    assert response.status_code == 404
    
    print("✅ Animals CRUD operations passed")
    return True

def test_incubation_system():
    print_separator("Testing Incubation System")
    
    # Create incubation batch
    print("\n--- Creating incubation batch ---")
    response = requests.post(f"{API_URL}/incubation", json=test_data["incubation"])
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    created_ids["incubation"] = response.json()["id"]
    
    # Get all incubation batches
    print("\n--- Getting all incubation batches ---")
    response = requests.get(f"{API_URL}/incubation")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} incubation batches")
    
    assert response.status_code == 200
    assert len(response.json()) >= 1
    
    # Update incubation batch
    print("\n--- Updating incubation batch ---")
    batch_id = created_ids["incubation"]
    update_data = {
        "temperatura": 38.0,
        "humedad": 67.0,
        "pollitos_eclosionados": 10,
        "observaciones": "Actualización de prueba"
    }
    response = requests.put(f"{API_URL}/incubation/{batch_id}", json=update_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["temperatura"] == 38.0
    assert response.json()["humedad"] == 67.0
    assert response.json()["pollitos_eclosionados"] == 10
    
    print("✅ Incubation system tests passed")
    return True

def test_egg_collection():
    print_separator("Testing Egg Collection")
    
    # Create egg collections
    collection_types = ["comercial", "fertil"]
    for collection_type in collection_types:
        print(f"\n--- Creating {collection_type} egg collection ---")
        response = requests.post(f"{API_URL}/egg-collection", json=test_data[f"egg_collection_{collection_type}"])
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        created_ids[f"egg_collection_{collection_type}"] = response.json()["id"]
    
    # Get all egg collections
    print("\n--- Getting all egg collections ---")
    response = requests.get(f"{API_URL}/egg-collection")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} egg collections")
    
    assert response.status_code == 200
    assert len(response.json()) >= 2
    
    # Get today's egg collections
    print("\n--- Getting today's egg collections ---")
    response = requests.get(f"{API_URL}/egg-collection/today")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} egg collections for today")
    
    assert response.status_code == 200
    assert len(response.json()) >= 2
    
    print("✅ Egg collection tests passed")
    return True

def test_feed_calculator():
    print_separator("Testing Feed Calculator")
    
    # Calculate feed for ponedoras
    print("\n--- Calculating feed for ponedoras ---")
    response = requests.post(f"{API_URL}/feed-calculator", json=test_data["feed_calculation_ponedora"])
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    created_ids["feed_calculation_ponedora"] = response.json()["id"]
    
    # Verify calculations for ponedoras
    result = response.json()
    # For ponedoras with age 120 days (levante), consumption should be 80g per day
    expected_daily = 100 * 0.080  # 100 animals * 80g
    expected_monthly = expected_daily * 30
    expected_cost = expected_monthly * 0.5  # price per kg
    
    assert abs(result["consumo_diario_kg"] - expected_daily) < 0.01
    assert abs(result["consumo_mensual_kg"] - expected_monthly) < 0.01
    assert abs(result["costo_estimado"] - expected_cost) < 0.01
    
    # Calculate feed for engorde
    print("\n--- Calculating feed for engorde ---")
    response = requests.post(f"{API_URL}/feed-calculator", json=test_data["feed_calculation_engorde"])
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    created_ids["feed_calculation_engorde"] = response.json()["id"]
    
    # Verify calculations for engorde
    result = response.json()
    # For engorde with age 25 days (crecimiento), consumption should be 100g per day
    expected_daily = 200 * 0.100  # 200 animals * 100g
    expected_monthly = expected_daily * 30
    expected_cost = expected_monthly * 0.6  # price per kg
    
    assert abs(result["consumo_diario_kg"] - expected_daily) < 0.01
    assert abs(result["consumo_mensual_kg"] - expected_monthly) < 0.01
    assert abs(result["costo_estimado"] - expected_cost) < 0.01
    
    # Get all feed calculations
    print("\n--- Getting all feed calculations ---")
    response = requests.get(f"{API_URL}/feed-calculator")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} feed calculations")
    
    assert response.status_code == 200
    assert len(response.json()) >= 2
    
    print("✅ Feed calculator tests passed")
    return True

def test_financial_transactions():
    print_separator("Testing Financial Transactions")
    
    # Create transactions
    transaction_types = ["ingreso", "egreso"]
    for transaction_type in transaction_types:
        print(f"\n--- Creating {transaction_type} transaction ---")
        response = requests.post(f"{API_URL}/transactions", json=test_data[f"transaction_{transaction_type}"])
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        created_ids[f"transaction_{transaction_type}"] = response.json()["id"]
    
    # Get all transactions
    print("\n--- Getting all transactions ---")
    response = requests.get(f"{API_URL}/transactions")
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} transactions")
    
    assert response.status_code == 200
    assert len(response.json()) >= 2
    
    # Get balance
    print("\n--- Getting balance ---")
    response = requests.get(f"{API_URL}/transactions/balance")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    
    # Verify balance calculation
    result = response.json()
    expected_income = 350.0  # From test data
    expected_expense = 250.0  # From test data
    expected_balance = expected_income - expected_expense
    
    # Note: There might be other transactions in the database, so we can't assert exact values
    assert result["total_ingresos"] >= expected_income
    assert result["total_egresos"] >= expected_expense
    
    print("✅ Financial transactions tests passed")
    return True

def test_dashboard():
    print_separator("Testing Dashboard")
    
    # Get dashboard data
    response = requests.get(f"{API_URL}/dashboard")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200
    
    # Verify dashboard data structure
    result = response.json()
    assert "total_animales" in result
    assert "total_ponedoras" in result
    assert "total_engorde" in result
    assert "total_reproductores" in result
    assert "huevos_hoy" in result
    assert "huevos_mes" in result
    assert "incubaciones_activas" in result
    assert "balance_mes" in result
    assert "ultimas_recolecciones" in result
    assert "lotes_proximos_venta" in result
    
    # Verify counts match our test data
    assert result["total_animales"] >= 3  # We created 3 animals
    assert result["total_ponedoras"] >= 1
    assert result["total_engorde"] >= 1
    assert result["total_reproductores"] >= 1
    assert result["huevos_hoy"] >= 110  # 80 commercial + 30 fertile
    assert result["incubaciones_activas"] >= 1
    
    print("✅ Dashboard tests passed")
    return True

def run_all_tests():
    tests = [
        test_health_check,
        test_animals_crud,
        test_incubation_system,
        test_egg_collection,
        test_feed_calculator,
        test_financial_transactions,
        test_dashboard
    ]
    
    results = {}
    all_passed = True
    
    for test in tests:
        try:
            result = test()
            results[test.__name__] = "PASSED" if result else "FAILED"
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ Error in {test.__name__}: {str(e)}")
            results[test.__name__] = f"ERROR: {str(e)}"
            all_passed = False
    
    print_separator("Test Results Summary")
    for test_name, result in results.items():
        print(f"{test_name}: {result}")
    
    if all_passed:
        print("\n✅ All tests passed successfully!")
    else:
        print("\n❌ Some tests failed. Check the logs above for details.")
    
    return all_passed

if __name__ == "__main__":
    run_all_tests()