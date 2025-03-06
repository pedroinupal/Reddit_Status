import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PostsScreen from './PostsScreen';
import MetricsScreen from './MetricsScreen';

// Componente de navegación separado para manejar la recarga de datos
function Navigation({ onNavigate }) {
  const location = useLocation();
  const isPostsPage = location.pathname === '/posts';

  return (
    <div className="flex justify-end mb-4">
      {isPostsPage ? (
        <Link to="/metrics">
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
            onClick={() => onNavigate('metrics')}
          >
            Métricas
          </button>
        </Link>
      ) : (
        <Link to="/posts">
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
            onClick={() => onNavigate('posts')}
          >
            Posts
          </button>
        </Link>
      )}
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Consultas
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Error al cargar los posts: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics from the API
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/metrics`);
      setMetrics(response.data);
    } catch (err) {
      setError('Error al cargar las métricas: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la navegación y actualizar datos
  const handleNavigate = (destination) => {
    if (destination === 'posts') {
      fetchPosts();
    } else if (destination === 'metrics') {
      fetchMetrics();
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchPosts();
    fetchMetrics();
  }, []);

  return (
    <BrowserRouter>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <img src="/reddit-logo.svg" alt="Reddit icon" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-800">Registro de posts más relevantes</h1>
        </div>

        {loading && <div id="loading" className="text-center text-blue-500">Cargando...</div>}
        {error && <div id="error" className="text-center text-red-500">{error}</div>}

        {/* Navegacion con el componente que maneja la recarga */}
        <Routes>
          <Route path="*" element={<Navigation onNavigate={handleNavigate} />} />
        </Routes>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsScreen posts={posts} />} />
          <Route path="/metrics" element={<MetricsScreen metrics={metrics} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;