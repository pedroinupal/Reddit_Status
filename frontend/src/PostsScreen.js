import React, { useState } from 'react';

function PostsScreen({ posts }) {
  const [dateFilter, setDateFilter] = useState('all');
  const [subredditFilter, setSubredditFilter] = useState('all');

  // Filter posts based on selected filters
  const filterPosts = () => {
    // Filtra solo por la fecha (sin hora) y subreddit
    return posts.filter(post => {
      const postDate = post.fecha_extraccion.split('T')[0]; // Extraer solo la fecha
      const matchesDate = dateFilter === 'all' || postDate === dateFilter;
      const matchesSubreddit = subredditFilter === 'all' || post.subreddit === subredditFilter;
      return matchesDate && matchesSubreddit;
    });
  };

  // Get unique values for dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(posts.map(post => post[key]))].sort();
  };

  // Get unique dates
  const getUniqueDates = () => {
    const uniqueDates = [...new Set(posts.map(post => post.fecha_extraccion.split('T')[0]))];
    return uniqueDates.sort();
  };

  return (
    <div className="p-6">
      <div className="flex justify-center items-center mb-6 space-x-4">
        <select 
          id="dateFilter" 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)} 
          className="px-4 py-2 border-2 border-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Todas las fechas</option>
          {getUniqueDates().map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>

        <select 
          id="subredditFilter" 
          value={subredditFilter} 
          onChange={(e) => setSubredditFilter(e.target.value)} 
          className="px-4 py-2 border-2 border-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Todos los subreddits</option>
          {getUniqueValues('subreddit').map(subreddit => (
            <option key={subreddit} value={subreddit}>{subreddit}</option>
          ))}
        </select>

        <button 
          id="clearFilters" 
          onClick={() => {
            setDateFilter('all');
            setSubredditFilter('all');
          }} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200"
        >
          Limpiar filtros
        </button>
      </div>

      <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-gray-700 font-medium">Fecha</th>
            <th className="px-6 py-3 text-left text-gray-700 font-medium">Hora</th>
            <th className="px-6 py-3 text-left text-gray-700 font-medium">Subreddit</th>
            <th className="px-6 py-3 text-left text-gray-700 font-medium">Post</th>
          </tr>
        </thead>
        <tbody>
          {filterPosts().map((post, index) => {
            const [postDate, postTime] = post.fecha_extraccion.split('T');  // Split date and time
            const time = postTime.split('.')[0];  // Get time without microseconds

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-3 border-b border-gray-200">{postDate}</td>
                <td className="px-6 py-3 border-b border-gray-200">{time}</td>
                <td className="px-6 py-3 border-b border-gray-200">{post.subreddit}</td>
                <td className="px-6 py-3 border-b border-gray-200">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-red-500"
                  >
                    {post.post_title}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PostsScreen;