// File: src/features/analytics/ClientInsights.tsx
import React from 'react';
import { FiUsers, FiActivity, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ClientInsights = () => {
  const stats = [
    { title: 'Total Customers', value: '1,248', change: '+12%', icon: <FiUsers /> },
    { title: 'Active Customers', value: '892', change: '+8%', icon: <FiActivity /> },
    { title: 'Avg. Satisfaction', value: '4.6/5', change: '+0.2', icon: <FiTrendingUp /> },
    { title: 'Retention Rate', value: '87%', change: '+3%', icon: <FiBarChart2 /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-xs border border-gray-200"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-2">{stat.change}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiBarChart2 className="mx-auto text-3xl mb-2" />
            <p>Customer growth chart visualization</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiUsers className="mx-auto text-3xl mb-2" />
              <p>Customer segmentation visualization</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Satisfaction Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiTrendingUp className="mx-auto text-3xl mb-2" />
              <p>Satisfaction trend visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInsights;