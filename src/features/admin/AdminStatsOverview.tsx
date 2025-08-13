import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const statCards = [
  { title: 'Total Users', value: '2,458', change: '+12%', trend: 'up' },
  { title: 'Active Agents', value: '156', change: '+3%', trend: 'up' },
  { title: 'Live Chats', value: '89', change: '-5%', trend: 'down' },
  { title: 'Pending Reports', value: '24', change: '+18%', trend: 'up' },
  { title: 'Resolved Today', value: '42', change: '+7%', trend: 'up' },
  { title: 'Banned Users', value: '15', change: '0%', trend: 'neutral' }
];

const AdminStatsOverview = ({ data }: {data:any}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="bg-white p-6 rounded-xl shadow-xs border border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <div className={`inline-flex items-center mt-3 text-sm ${
              stat.trend === 'up' ? 'text-green-600' : 
              stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {stat.trend === 'up' ? <FiArrowUp className="mr-1" /> : 
               stat.trend === 'down' ? <FiArrowDown className="mr-1" /> : null}
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional overview components would go here */}
    </div>
  );
};

export default AdminStatsOverview