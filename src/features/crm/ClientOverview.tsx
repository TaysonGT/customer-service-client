import { FiMail, FiPhone, FiMapPin, FiCreditCard } from 'react-icons/fi';

import {IUser} from '../../types/types'

const ClientOverview = ({ client }: {client:IUser}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-400" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-gray-400" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-400" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Account Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member Since:</span>
            <span>Jan 12, 2022</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Plan:</span>
            <span>Premium</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h4>
        <div className="flex items-center gap-3">
          <FiCreditCard className="text-gray-400" />
          <div>
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-gray-500">Expires 12/2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;