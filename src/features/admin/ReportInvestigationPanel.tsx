import React, { useState } from 'react';
import {
  FiAlertTriangle, FiFile, FiCheck, FiX, FiSearch,
  FiFilter, FiMessageSquare, FiUser, FiClock
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../../components/ui';

export interface Report {
  id: string;
  reporter: {
    id: string;
    name: string;
    avatar: string;
  };
  reported: {
    id: string;
    name: string;
    type: 'agent' | 'client';
  };
  chatExcerpt: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  timestamp: string;
  attachments: string[];
}

const ReportInvestigationPanel = ({ data }: { data: Report[] }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = data?.filter(report => {
    const matchesSearch = report.reported.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || report.status === 'pending';
    return matchesSearch && matchesTab;
  });

  const severityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  const handleResolve = (action: 'resolve' | 'dismiss') => {
    console.log(`Report ${selectedReport?.id} ${action}d with note: ${resolutionNote}`);
    setSelectedReport(null);
    setResolutionNote('');
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Center</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            data?.filter(r => r.status === 'pending').length > 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {data?.filter(r => r.status === 'pending').length} Urgent
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['pending', 'all'].map(tab => (
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
      </div>

      {/* Report List */}
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredReports?.map(report => (
          <div 
            key={report.id} 
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${severityColors[report.severity]}`}>
                  {report.severity.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    {report.reported.name}
                    <span className="text-xs font-normal text-gray-500">({report.reported.type})</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{report.reason}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiClock size={12} /> {report.timestamp}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      Reported by: {report.reporter.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {report.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">
                  Report #{selectedReport.id} - {selectedReport.severity.toUpperCase()}
                </h3>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Report Details</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{selectedReport.reason}</p>
                        <p className="text-sm text-gray-600 mt-2">{selectedReport.chatExcerpt}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Chat Context</h4>
                      <div className="bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto">
                        {/* Chat history would be rendered here */}
                        <div className="text-center text-gray-400 py-8">
                          <FiMessageSquare className="mx-auto text-2xl mb-2" />
                          <p>Full chat history would appear here</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Resolution Notes</h4>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Add notes about your investigation..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Parties Involved</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar src={selectedReport.reporter.avatar} alt={selectedReport.reporter.name} size="sm" />
                          <div>
                            <p className="font-medium">Reporter</p>
                            <p className="text-sm text-gray-600">{selectedReport.reporter.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Reported {selectedReport.reported.type}</p>
                            <p className="text-sm text-gray-600">{selectedReport.reported.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReport.attachments?.length > 0 ? (
                          selectedReport.attachments?.map((att, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                              <div className="text-center">
                                <FiFile className="mx-auto text-gray-400" />
                                <span className="text-xs text-gray-600 truncate">Evidence_{i+1}.png</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 col-span-2">No attachments</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleResolve('resolve')}
                          className="flex items-center justify-center gap-2 p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                        >
                          <FiCheck /> Resolve
                        </button>
                        <button
                          onClick={() => handleResolve('dismiss')}
                          className="flex items-center justify-center gap-2 p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                        >
                          <FiX /> Dismiss
                        </button>
                        <button className="col-span-2 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">
                          Escalate to Senior Admin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportInvestigationPanel;