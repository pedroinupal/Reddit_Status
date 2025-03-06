import React from 'react';

function MetricsScreen({ metrics }) {
  if (!metrics) {
    return <div className="text-center">No hay datos de métricas disponibles</div>;
  }

  // Format number with up to 4 decimal places
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return typeof num === 'number' ? num.toFixed(4).replace(/\.?0+$/, '') : num;
  };

  const metricCards = [
    {
      title: 'Total de Posts',
      value: metrics.total_posts,
      icon: '📊',
      color: 'bg-blue-100 text-blue-800',
      unit: 'posts'
    },
    {
      title: 'Tiempo Máximo de Extracción',
      value: formatNumber(metrics.max_extraction_time),
      icon: '⏱️',
      color: 'bg-red-100 text-red-800',
      unit: 'segundos'
    },
    {
      title: 'Tiempo Mínimo de Extracción',
      value: formatNumber(metrics.min_extraction_time),
      icon: '⚡',
      color: 'bg-green-100 text-green-800',
      unit: 'segundos'
    },
    {
      title: 'Tiempo Promedio de Extracción',
      value: formatNumber(metrics.avg_extraction_time),
      icon: '⏳',
      color: 'bg-purple-100 text-purple-800',
      unit: 'segundos'
    },
    {
      title: 'Días Extraídos',
      value: metrics.days_extracted,
      icon: '📅',
      color: 'bg-yellow-100 text-yellow-800',
      unit: 'días'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Métricas de la Aplicación</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.color} rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-sm opacity-75">{card.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricsScreen;