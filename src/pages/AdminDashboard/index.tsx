import { useState, useEffect } from 'react';
import { 
  FiUsers, FiMessageSquare, FiAlertTriangle, FiActivity, 
  FiShield, FiRefreshCw, FiSearch, FiSliders,
  FiBarChart2, FiUserX, FiClock, FiTrendingUp 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStatsOverview from '../../features/admin/AdminStatsOverview';
import UserManagementTable from '../../features/admin/UserManagementTable';
import LiveChatMonitor from '../../features/admin/LiveChatMonitor';
import BanManagementConsole from '../../features/admin/BanManagementConsole';
import ReportInvestigationPanel from '../../features/admin/ReportInvestigationPanel';
import { useAuth } from '../../context/AuthContext';
import AnalyticsDashboard from '../../features/admin/AnalyticsDashboard';
import AdminActionLog from '../../features/admin/AdminActionLog';
import SystemHealthMonitor from '../../features/admin/SystemHealthMonitor';
// import { fetchAdminData } from '../../api/adminAPI';
import mockData from '../../assets/adminMockData.json';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(mockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    timeRange: '24h',
    userType: 'all',
    severity: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
            console.log('Test')
        }, 500)
        // const data = await fetchAdminData(filters);
        // setDashboardData(data);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 300000); // Auto-refresh every 5 mins
    
    return () => clearInterval(interval);
  }, [filters]);

  const modules = [
    { id: 'overview', icon: <FiActivity />, label: 'Overview' },
    { id: 'users', icon: <FiUsers />, label: 'User Management' },
    { id: 'chats', icon: <FiMessageSquare />, label: 'Live Chats' },
    { id: 'reports', icon: <FiAlertTriangle />, label: 'Reports' },
    { id: 'bans', icon: <FiShield />, label: 'Ban Center' },
    { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { id: 'actions', icon: <FiClock />, label: 'Action Log' },
    { id: 'system', icon: <FiTrendingUp />, label: 'System Health' }
  ];

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Admin Navigation Sidebar */}
      <div className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center md:justify-start">
          <FiShield className="text-2xl text-blue-600 mr-2" />
          <span className="hidden md:block text-xl font-bold">Admin Console</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors
                ${activeModule === module.id 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="text-lg mr-3">{module.icon}</span>
              <span className="hidden md:block">{module.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <FiUserX className="text-blue-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{currentUser?.firstname}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {modules.find(m => m.id === activeModule)?.icon}
            {modules.find(m => m.id === activeModule)?.label}
          </h1>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <FiSliders className="text-gray-600" />
            </button>
            
            <button className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100">
              <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grow overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <FiRefreshCw className="animate-spin text-4xl text-blue-600 mb-4" />
                <p className="text-gray-600">Loading admin data...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeModule === 'overview' && <AdminStatsOverview data={dashboardData} />}
                {activeModule === 'users' && <UserManagementTable data={dashboardData?.users} />}
                {activeModule === 'chats' && <LiveChatMonitor data={dashboardData?.activeChats} />}
                {activeModule === 'reports' && <ReportInvestigationPanel data={dashboardData?.reports} />}
                {activeModule === 'bans' && <BanManagementConsole data={dashboardData?.banRecords} />}
                {activeModule === 'analytics' && <AnalyticsDashboard metrics={dashboardData?.metrics} />}
                {activeModule === 'actions' && <AdminActionLog logs={dashboardData?.actionLogs} />}
                {activeModule === 'system' && <SystemHealthMonitor stats={dashboardData?.systemStats} />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;