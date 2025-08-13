import React from 'react';
import { 
  FiBarChart2, FiTrendingUp, FiTrendingDown, FiUsers, 
  FiMessageSquare, FiClock, FiPieChart 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-lg shadow-xs border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} {isPositive ? '↑' : '↓'} from last week
      </p>
    </motion.div>
  );
};

const AnalyticsDashboard = ({ metrics }: { metrics?: any }) => {
  // Mock data - in a real app this would come from props
  const data = metrics || {
    totalUsers: { value: '12,458', change: '+8%' },
    activeAgents: { value: '243', change: '+3%' },
    chatVolume: { value: '1,892', change: '+15%' },
    resolutionRate: { value: '89%', change: '+2%' },
    avgResponseTime: { value: '2m 14s', change: '-12%' },
    satisfactionScore: { value: '4.6/5', change: '+0.2' }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Users" 
          value={data.totalUsers.value} 
          change={data.totalUsers.change} 
          icon={<FiUsers />} 
        />
        <MetricCard 
          title="Active Agents" 
          value={data.activeAgents.value} 
          change={data.activeAgents.change} 
          icon={<FiUsers />} 
        />
        <MetricCard 
          title="Chat Volume" 
          value={data.chatVolume.value} 
          change={data.chatVolume.change} 
          icon={<FiMessageSquare />} 
        />
        <MetricCard 
          title="Resolution Rate" 
          value={data.resolutionRate.value} 
          change={data.resolutionRate.change} 
          icon={<FiPieChart />} 
        />
        <MetricCard 
          title="Avg Response Time" 
          value={data.avgResponseTime.value} 
          change={data.avgResponseTime.change} 
          icon={<FiClock />} 
        />
        <MetricCard 
          title="Satisfaction Score"
          value={data.satisfactionScore.value} 
          change={data.satisfactionScore.change} 
          icon={<FiTrendingUp />} 
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Activity Trends</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">Week</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Month</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Year</button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiBarChart2 className="mx-auto text-3xl mb-2" />
            <p>Chart visualization would appear here</p>
            <p className="text-sm">Showing trends over time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiPieChart className="mx-auto text-3xl mb-2" />
              <p>Pie chart would appear here</p>
              <p className="text-sm">Showing user types distribution</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiClock className="mx-auto text-3xl mb-2" />
              <p>Heatmap would appear here</p>
              <p className="text-sm">Showing activity by time of day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;