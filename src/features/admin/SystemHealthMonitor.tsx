import React, { useState } from 'react';
import { 
  FiServer, FiDatabase, FiCpu, FiWifi, 
  FiAlertCircle, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface SystemMetric {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  value: string;
  trend: 'up' | 'down' | 'stable';
  lastChecked: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${
      status === 'operational' ? 'bg-green-100 text-green-800' :
      status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {status.toUpperCase()}
    </span>
  );
};

const SystemHealthMonitor = ({ stats }: { stats?: any }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'resources'>('overview');
  
  // Mock data - in a real app this would come from props
  const data = stats || {
    systemStatus: 'operational',
    uptime: '99.98%',
    responseTime: '142ms',
    services: [
      { name: 'API Service', status: 'operational', value: '100%', trend: 'stable', lastChecked: '1 min ago' },
      { name: 'Database', status: 'operational', value: '98%', trend: 'up', lastChecked: '1 min ago' },
      { name: 'Web Server', status: 'degraded', value: '89%', trend: 'down', lastChecked: '2 mins ago' },
      { name: 'Chat Service', status: 'operational', value: '100%', trend: 'stable', lastChecked: '30 secs ago' },
      { name: 'Auth Service', status: 'operational', value: '100%', trend: 'stable', lastChecked: '45 secs ago' }
    ],
    resources: [
      { name: 'CPU Usage', status: 'operational', value: '42%', trend: 'down', lastChecked: 'Now' },
      { name: 'Memory', status: 'operational', value: '68%', trend: 'up', lastChecked: 'Now' },
      { name: 'Disk Space', status: 'degraded', value: '92%', trend: 'up', lastChecked: 'Now' },
      { name: 'Network', status: 'operational', value: '24%', trend: 'stable', lastChecked: 'Now' }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          <StatusBadge status={data.systemStatus} />
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['overview', 'services', 'resources'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <FiServer />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">System Uptime</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.uptime}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg Response</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.responseTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <FiDatabase />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Services</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data?.services?.filter((s: any) => s.status === 'operational').length}/{data.services.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Service Status Timeline</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FiServer className="mx-auto text-3xl mb-2" />
                  <p>Timeline visualization would appear here</p>
                  <p className="text-sm">Showing system events over time</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div className="space-y-4">
            {data.services?.map((service: any) => (
              <motion.div 
                key={service.name}
                whileHover={{ y: -2 }}
                className="bg-white p-4 rounded-lg shadow-xs border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {service.status === 'operational' ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiAlertCircle className="text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Value:</span> {service.value} • 
                        <span className="font-medium ml-2">Trend:</span> {service.trend} • 
                        <span className="font-medium ml-2">Checked:</span> {service.lastChecked}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.resources?.map((resource: any) => (
                <motion.div 
                  key={resource.name}
                  whileHover={{ y: -2 }}
                  className="bg-white p-4 rounded-lg shadow-xs border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <FiCpu />
                      </div>
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Status:</span> {resource.status} • 
                          <span className="font-medium ml-2">Value:</span> {resource.value}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {resource.lastChecked}
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        resource.status === 'operational' ? 'bg-green-500' :
                        resource.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: resource.value }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Resource Usage History</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FiCpu className="mx-auto text-3xl mb-2" />
                  <p>Resource usage charts would appear here</p>
                  <p className="text-sm">Showing metrics over time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthMonitor;