// File: src/pages/DataManagementPage.tsx
import { useState } from 'react';
import { Tabs, Tab, Button, Input } from '../../components/ui';
import { 
  FiFile, FiUsers, FiDatabase, 
  FiPlus, FiSearch, FiShare 
} from 'react-icons/fi';
import ClientInsights from '../../features/analytics/ClientInsights';
import DataIntegrations from '../../features/integrations/DataIntegrations';
import ClientDatabase from '../../features/crm/ClientDatabase';
import FileDisplay from '../../features/files/FileDisplay';

const DataManagementPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Hub</h1>
          <p className="text-sm text-gray-500">
            Central repository for all client-related information
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button icon={<FiPlus />} variant="primary">
            Add Data
          </Button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search across all data..."
            icon={<FiSearch />}
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.currentTarget.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="files" icon={<FiFile />} label="Files" />
            <Tab value="customers" icon={<FiUsers />} label="Customers" />
            <Tab value="insights" icon={<FiDatabase />} label="Insights" />
            <Tab value="integrations" icon={<FiShare />} label="Integrations" />
          </Tabs>
          
          <div className="flex bg-gray-100 rounded-lg p-1 ml-2">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('grid')}
              icon={<FiDatabase />}
            />
            <Button 
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('table')}
              icon={<FiFile />}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'files' && (
          <FileDisplay />
        )}
        
        {activeTab === 'customers' && (
          <ClientDatabase viewMode={viewMode} />
        )}
        
        {activeTab === 'insights' && (
          <ClientInsights />
        )}
        
        {activeTab === 'integrations' && (
          <DataIntegrations />
        )}
      </div>
    </div>
  );
};

export default DataManagementPage;