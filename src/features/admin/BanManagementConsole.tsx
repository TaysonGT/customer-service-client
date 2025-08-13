import React, { useState } from 'react';
import {
  FiUserX, FiUser, FiUserCheck, FiSearch, 
  FiFilter, FiClock, FiAlertTriangle, FiTrash2
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar} from '../../components/ui';

interface BanRecord {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  admin: {
    id: string;
    name: string;
  };
  reason: string;
  evidence: string[];
  issuedAt: string;
  expiresAt: string | 'permanent';
  status: 'active' | 'expired' | 'revoked';
}

const BanManagementConsole = ({ data }: { data: BanRecord[] }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BanRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = data?.filter(record => {
    const matchesSearch = record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'active' ? record.status === 'active' : true;
    return matchesSearch && matchesTab;
  });

  const handleRevokeBan = (banId: string) => {
    console.log(`Revoking ban ${banId}`);
  };

  const handleDeleteRecord = (banId: string) => {
    console.log(`Deleting ban record ${banId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Ban Management</h2>
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {data?.filter(b => b.status === 'active').length} Active Bans
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bans..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['active', 'history'].map(tab => (
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
          
          <button 
            onClick={() => setShowBanDialog(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FiUserX /> New Ban
          </button>
        </div>
      </div>

      {/* Ban Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords?.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar src={record.user.avatar} alt={record.user.name} size="sm" className="mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.user.name}</div>
                      <div className="text-sm text-gray-500">{record.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.admin.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    <div>{new Date(record.issuedAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1 text-xs">
                      <FiClock size={12} />
                      {record.expiresAt === 'permanent' ? 'Permanent' : `Expires: ${new Date(record.expiresAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'active' ? 'bg-red-100 text-red-800' :
                    record.status === 'revoked' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {record.status === 'active' && (
                      <button
                        onClick={() => handleRevokeBan(record.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                        title="Revoke ban"
                      >
                        <FiUserCheck />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      title="View details"
                    >
                      <FiAlertTriangle />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      title="Delete record"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ban Details Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">
                  Ban Details #{selectedRecord.id}
                </h3>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Ban Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reason:</span>
                          <span className="font-medium">{selectedRecord.reason}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issued At:</span>
                          <span>{new Date(selectedRecord.issuedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires:</span>
                          <span className={selectedRecord.expiresAt === 'permanent' ? 'text-red-600 font-medium' : ''}>
                            {selectedRecord.expiresAt === 'permanent' ? 'PERMANENT' : new Date(selectedRecord.expiresAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            selectedRecord.status === 'active' ? 'text-red-600' :
                            selectedRecord.status === 'revoked' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            {selectedRecord.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Evidence</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRecord.evidence.length > 0 ? (
                          selectedRecord.evidence?.map((item, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                              <div className="text-center">
                                <FiAlertTriangle className="mx-auto text-gray-400" />
                                <span className="text-xs text-gray-600 truncate">Evidence_{i+1}.png</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 col-span-2">No evidence attached</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Banned User</h4>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar src={selectedRecord.user.avatar} alt={selectedRecord.user.name} size="md" />
                        <div>
                          <p className="font-medium">{selectedRecord.user.name}</p>
                          <p className="text-sm text-gray-600">{selectedRecord.user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Issuing Admin</h4>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {selectedRecord?.admin?.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{selectedRecord.admin.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRecord.status === 'active' ? (
                          <button
                            onClick={() => {
                              handleRevokeBan(selectedRecord.id);
                              setSelectedRecord(null);
                            }}
                            className="col-span-2 p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2"
                          >
                            <FiUserCheck /> Revoke Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              console.log(`Reinstating ban ${selectedRecord.id}`);
                              setSelectedRecord(null);
                            }}
                            className="col-span-2 p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
                          >
                            <FiUserX /> Reinstate Ban
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDeleteRecord(selectedRecord.id);
                            setSelectedRecord(null);
                          }}
                          className="col-span-2 p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                          <FiTrash2 /> Delete Record
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

      {/* New Ban Modal */}
      <AnimatePresence>
        {showBanDialog && (
          <NewBanModal 
            onClose={() => setShowBanDialog(false)}
            onBanSuccess={(banData) => {
              console.log('New ban created:', banData);
              setShowBanDialog(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Additional component for the new ban modal
const NewBanModal = ({ onClose, onBanSuccess }: { onClose: () => void, onBanSuccess: (data: any) => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'24h' | '7d' | '30d' | 'permanent'>('7d');
  const [banEvidence, setBanEvidence] = useState<string[]>([]);
  const [banNotes, setBanNotes] = useState('');

  const handleCreateBan = () => {
    const banData = {
      userId: selectedUser.id,
      reason: banReason,
      duration: banDuration,
      evidence: banEvidence,
      notes: banNotes
    };
    onBanSuccess(banData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">
            {step === 1 ? 'Select User to Ban' : 'Configure Ban Details'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* User search results would be rendered here */}
                <div className="p-4 hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedUser({
                      id: 'user123',
                      name: 'John Doe',
                      email: 'john@example.com',
                      avatar: ''
                    });
                    setStep(2);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-600">john@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center text-gray-400">
                  {userSearch ? 'No more results' : 'Search for users to ban'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="md" />
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ban Reason</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Abusive Behavior">Abusive Behavior</option>
                  <option value="Spam">Spam</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Impersonation">Impersonation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ban Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setBanDuration('24h')}
                    className={`p-2 border rounded-lg ${banDuration === '24h' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300'}`}
                  >
                    24 Hours
                  </button>
                  <button
                    onClick={() => setBanDuration('7d')}
                    className={`p-2 border rounded-lg ${banDuration === '7d' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300'}`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setBanDuration('30d')}
                    className={`p-2 border rounded-lg ${banDuration === '30d' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300'}`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setBanDuration('permanent')}
                    className={`p-2 border rounded-lg ${banDuration === 'permanent' ? 'bg-red-50 border-red-500 text-red-600' : 'border-gray-300'}`}
                  >
                    Permanent
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Drag & drop files here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF (max 5MB each)</p>
                </div>
                {banEvidence?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {banEvidence?.map((item, i) => (
                      <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        <span>evidence_{i+1}.jpg</span>
                        <button onClick={() => setBanEvidence(banEvidence?.filter((_, idx) => idx !== i))}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add any additional context or details..."
                  value={banNotes}
                  onChange={(e) => setBanNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          {step === 1 ? (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
          )}
          
          {step === 1 ? (
            <button
              onClick={() => selectedUser && setStep(2)}
              disabled={!selectedUser}
              className={`px-4 py-2 rounded-lg ${selectedUser ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreateBan}
              disabled={!banReason}
              className={`px-4 py-2 rounded-lg ${banReason ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Confirm Ban
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BanManagementConsole;