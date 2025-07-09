import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Componente principal
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={dashboardData} loading={loading} />;
      case 'animals':
        return <Animals />;
      case 'incubation':
        return <Incubation />;
      case 'eggs':
        return <EggCollection />;
      case 'feed':
        return <FeedCalculator />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Dashboard data={dashboardData} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-2">
                <div className="text-green-600 font-bold text-xl">🏡</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gallinapp</h1>
                <p className="text-green-100 text-sm">GRANJAS NG - Del Consejo de Productores y Técnicos la Virtud</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'dashboard' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('animals')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'animals' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🐓</span>
                  <span>Inventario Animales</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('incubation')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'incubation' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🥚</span>
                  <span>Incubación</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('eggs')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'eggs' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🧺</span>
                  <span>Recolección Huevos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('feed')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'feed' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🌾</span>
                  <span>Calculadora Alimento</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('transactions')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    currentView === 'transactions' 
                      ? 'bg-green-100 text-green-700 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">💰</span>
                  <span>Ingresos/Egresos</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Componente Dashboard
function Dashboard({ data, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se pudieron cargar los datos del dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard General</h2>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🐓"
          title="Total Animales"
          value={data.total_animales}
          color="bg-blue-500"
        />
        <StatCard
          icon="🧺"
          title="Huevos Hoy"
          value={data.huevos_hoy}
          color="bg-yellow-500"
        />
        <StatCard
          icon="📈"
          title="Huevos Mes"
          value={data.huevos_mes}
          color="bg-orange-500"
        />
        <StatCard
          icon="💵"
          title="Balance Mes"
          value={`$${data.balance_mes.toLocaleString()}`}
          color="bg-green-500"
        />
      </div>

      {/* Desglose de animales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="🐔"
          title="Ponedoras"
          value={data.total_ponedoras}
          color="bg-pink-500"
        />
        <StatCard
          icon="🍗"
          title="Engorde"
          value={data.total_engorde}
          color="bg-red-500"
        />
        <StatCard
          icon="👨‍👩‍👧‍👦"
          title="Reproductores"
          value={data.total_reproductores}
          color="bg-purple-500"
        />
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">🥚</span>
            Incubaciones Activas
          </h3>
          <div className="text-3xl font-bold text-green-600">{data.incubaciones_activas}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">🧺</span>
            Últimas Recolecciones
          </h3>
          <div className="space-y-2">
            {data.ultimas_recolecciones.slice(0, 3).map((collection, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{collection.fecha}</span>
                <span className="font-semibold">{collection.cantidad} huevos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para tarjetas estadísticas
function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`${color} text-white p-3 rounded-full text-xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Componente Inventario de Animales
function Animals() {
  const [animals, setAnimals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lote: '',
    tipo: 'ponedora',
    raza: '',
    cantidad: '',
    fecha_ingreso: '',
    edad_dias: '',
    peso_promedio: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${API}/animals`);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/animals`, {
        ...formData,
        cantidad: parseInt(formData.cantidad),
        edad_dias: parseInt(formData.edad_dias),
        peso_promedio: parseFloat(formData.peso_promedio)
      });
      setShowForm(false);
      setFormData({
        lote: '', tipo: 'ponedora', raza: '', cantidad: '', fecha_ingreso: '', edad_dias: '', peso_promedio: '', observaciones: ''
      });
      fetchAnimals();
    } catch (error) {
      console.error('Error creating animal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Inventario de Animales</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">➕</span>
          <span>Agregar Lote</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nuevo Lote de Animales</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Lote"
              value={formData.lote}
              onChange={(e) => setFormData({...formData, lote: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ponedora">Ponedora</option>
              <option value="engorde">Engorde</option>
              <option value="reproductor">Reproductor</option>
            </select>
            <input
              type="text"
              placeholder="Raza"
              value={formData.raza}
              onChange={(e) => setFormData({...formData, raza: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="date"
              value={formData.fecha_ingreso}
              onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Edad (días)"
              value={formData.edad_dias}
              onChange={(e) => setFormData({...formData, edad_dias: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Peso promedio (kg)"
              value={formData.peso_promedio}
              onChange={(e) => setFormData({...formData, peso_promedio: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows="3"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Prom.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {animals.map((animal) => (
              <tr key={animal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{animal.lote}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    animal.tipo === 'ponedora' ? 'bg-pink-100 text-pink-800' :
                    animal.tipo === 'engorde' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {animal.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{animal.raza}</td>
                <td className="px-6 py-4 whitespace-nowrap">{animal.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{animal.edad_dias} días</td>
                <td className="px-6 py-4 whitespace-nowrap">{animal.peso_promedio} kg</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    animal.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    animal.estado === 'vendido' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {animal.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Incubación
function Incubation() {
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lote: '',
    tipo_huevo: 'ponedora',
    raza: '',
    cantidad_huevos: '',
    fecha_incubacion: '',
    fecha_eclosion_esperada: '',
    temperatura: '37.5',
    humedad: '60.0',
    observaciones: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API}/incubation`);
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching incubation batches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/incubation`, {
        ...formData,
        cantidad_huevos: parseInt(formData.cantidad_huevos),
        temperatura: parseFloat(formData.temperatura),
        humedad: parseFloat(formData.humedad)
      });
      setShowForm(false);
      setFormData({
        lote: '', tipo_huevo: 'ponedora', raza: '', cantidad_huevos: '', fecha_incubacion: '', fecha_eclosion_esperada: '', temperatura: '37.5', humedad: '60.0', observaciones: ''
      });
      fetchBatches();
    } catch (error) {
      console.error('Error creating incubation batch:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Incubación</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">➕</span>
          <span>Nuevo Lote Incubación</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nuevo Lote de Incubación</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Lote"
              value={formData.lote}
              onChange={(e) => setFormData({...formData, lote: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <select
              value={formData.tipo_huevo}
              onChange={(e) => setFormData({...formData, tipo_huevo: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ponedora">Ponedora</option>
              <option value="engorde">Engorde</option>
            </select>
            <input
              type="text"
              placeholder="Raza"
              value={formData.raza}
              onChange={(e) => setFormData({...formData, raza: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Cantidad de huevos"
              value={formData.cantidad_huevos}
              onChange={(e) => setFormData({...formData, cantidad_huevos: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="date"
              placeholder="Fecha incubación"
              value={formData.fecha_incubacion}
              onChange={(e) => setFormData({...formData, fecha_incubacion: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="date"
              placeholder="Fecha eclosión esperada"
              value={formData.fecha_eclosion_esperada}
              onChange={(e) => setFormData({...formData, fecha_eclosion_esperada: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.1"
              placeholder="Temperatura (°C)"
              value={formData.temperatura}
              onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Humedad (%)"
              value={formData.humedad}
              onChange={(e) => setFormData({...formData, humedad: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows="3"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huevos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Incubación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Eclosión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pollitos</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batches.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{batch.lote}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    batch.tipo_huevo === 'ponedora' ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {batch.tipo_huevo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.raza}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.cantidad_huevos}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.fecha_incubacion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.fecha_eclosion_esperada}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    batch.estado === 'activo' ? 'bg-blue-100 text-blue-800' :
                    batch.estado === 'eclosionado' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {batch.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.pollitos_eclosionados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Recolección de Huevos
function EggCollection() {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lote_origen: '',
    tipo: 'comercial',
    cantidad: '',
    peso_total: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API}/egg-collection`);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching egg collections:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/egg-collection`, {
        ...formData,
        cantidad: parseInt(formData.cantidad),
        peso_total: parseFloat(formData.peso_total)
      });
      setShowForm(false);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        lote_origen: '',
        tipo: 'comercial',
        cantidad: '',
        peso_total: '',
        observaciones: ''
      });
      fetchCollections();
    } catch (error) {
      console.error('Error creating egg collection:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Recolección de Huevos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">➕</span>
          <span>Registrar Recolección</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nueva Recolección</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Lote de origen"
              value={formData.lote_origen}
              onChange={(e) => setFormData({...formData, lote_origen: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="comercial">Comercial</option>
              <option value="fertil">Fértil</option>
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Peso total (kg)"
              value={formData.peso_total}
              onChange={(e) => setFormData({...formData, peso_total: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="border rounded-lg px-3 py-2"
              rows="3"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collections.map((collection) => (
              <tr key={collection.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{collection.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">{collection.lote_origen}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    collection.tipo === 'comercial' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {collection.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{collection.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{collection.peso_total} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collection.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Calculadora de Alimento
function FeedCalculator() {
  const [calculations, setCalculations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lote: '',
    tipo_animal: 'ponedora',
    cantidad_animales: '',
    edad_dias: '',
    peso_promedio: '',
    precio_alimento_kg: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      const response = await axios.get(`${API}/feed-calculator`);
      setCalculations(response.data);
    } catch (error) {
      console.error('Error fetching feed calculations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/feed-calculator`, {
        ...formData,
        cantidad_animales: parseInt(formData.cantidad_animales),
        edad_dias: parseInt(formData.edad_dias),
        peso_promedio: parseFloat(formData.peso_promedio),
        precio_alimento_kg: parseFloat(formData.precio_alimento_kg)
      });
      setShowForm(false);
      setFormData({
        lote: '',
        tipo_animal: 'ponedora',
        cantidad_animales: '',
        edad_dias: '',
        peso_promedio: '',
        precio_alimento_kg: '',
        observaciones: ''
      });
      fetchCalculations();
    } catch (error) {
      console.error('Error creating feed calculation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Calculadora de Alimento</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">🧮</span>
          <span>Nuevo Cálculo</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nuevo Cálculo de Alimento</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Lote"
              value={formData.lote}
              onChange={(e) => setFormData({...formData, lote: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <select
              value={formData.tipo_animal}
              onChange={(e) => setFormData({...formData, tipo_animal: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ponedora">Ponedora</option>
              <option value="engorde">Engorde</option>
              <option value="reproductor">Reproductor</option>
            </select>
            <input
              type="number"
              placeholder="Cantidad de animales"
              value={formData.cantidad_animales}
              onChange={(e) => setFormData({...formData, cantidad_animales: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Edad (días)"
              value={formData.edad_dias}
              onChange={(e) => setFormData({...formData, edad_dias: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Peso promedio (kg)"
              value={formData.peso_promedio}
              onChange={(e) => setFormData({...formData, peso_promedio: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio alimento por kg"
              value={formData.precio_alimento_kg}
              onChange={(e) => setFormData({...formData, precio_alimento_kg: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows="3"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Calcular
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Diario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Mensual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calculations.map((calc) => (
              <tr key={calc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{calc.lote}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    calc.tipo_animal === 'ponedora' ? 'bg-pink-100 text-pink-800' :
                    calc.tipo_animal === 'engorde' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {calc.tipo_animal}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{calc.cantidad_animales}</td>
                <td className="px-6 py-4 whitespace-nowrap">{calc.edad_dias} días</td>
                <td className="px-6 py-4 whitespace-nowrap">{calc.consumo_diario_kg.toFixed(2)} kg</td>
                <td className="px-6 py-4 whitespace-nowrap">{calc.consumo_mensual_kg.toFixed(2)} kg</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">${calc.costo_estimado.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Transacciones
function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'ingreso',
    concepto: '',
    categoria: '',
    cantidad: '',
    unidad: '',
    precio_unitario: '',
    total: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API}/transactions/balance`);
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/transactions`, {
        ...formData,
        cantidad: formData.cantidad ? parseInt(formData.cantidad) : null,
        precio_unitario: parseFloat(formData.precio_unitario),
        total: parseFloat(formData.total)
      });
      setShowForm(false);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'ingreso',
        concepto: '',
        categoria: '',
        cantidad: '',
        unidad: '',
        precio_unitario: '',
        total: '',
        observaciones: ''
      });
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handlePrecioChange = (e) => {
    const precio = parseFloat(e.target.value) || 0;
    const cantidad = parseInt(formData.cantidad) || 1;
    const total = precio * cantidad;
    setFormData({
      ...formData,
      precio_unitario: e.target.value,
      total: total.toString()
    });
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 1;
    const precio = parseFloat(formData.precio_unitario) || 0;
    const total = precio * cantidad;
    setFormData({
      ...formData,
      cantidad: e.target.value,
      total: total.toString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Ingresos y Egresos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">➕</span>
          <span>Nueva Transacción</span>
        </button>
      </div>

      {/* Balance */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              <span className="text-xl mr-2">📈</span>
              Total Ingresos
            </h3>
            <p className="text-2xl font-bold text-green-600">${balance.total_ingresos.toLocaleString()}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <span className="text-xl mr-2">📉</span>
              Total Egresos
            </h3>
            <p className="text-2xl font-bold text-red-600">${balance.total_egresos.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center">
              <span className="text-xl mr-2">💵</span>
              Balance
            </h3>
            <p className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nueva Transacción</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
            <input
              type="text"
              placeholder="Concepto"
              value={formData.concepto}
              onChange={(e) => setFormData({...formData, concepto: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Categoría"
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={formData.cantidad}
              onChange={handleCantidadChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Unidad"
              value={formData.unidad}
              onChange={(e) => setFormData({...formData, unidad: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio unitario"
              value={formData.precio_unitario}
              onChange={handlePrecioChange}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Total"
              value={formData.total}
              onChange={(e) => setFormData({...formData, total: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows="3"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{transaction.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.concepto}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.cantidad && transaction.unidad 
                    ? `${transaction.cantidad} ${transaction.unidad}`
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                  <span className={transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                    ${transaction.total.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;