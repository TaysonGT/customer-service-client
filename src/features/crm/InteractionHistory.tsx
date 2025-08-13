import { FiMessageSquare, FiPhone, FiMail, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {IUser} from '../../types/types'

const InteractionHistory = ({ client }:{client:IUser}) => {
  const interactions = [
    { id: 1, type: 'chat', date: '2023-06-15 14:30', duration: '22 mins', agent: 'Lisa Anderson', status: 'completed' },
    { id: 2, type: 'call', date: '2023-06-12 10:15', duration: '8 mins', agent: 'Tom Harrison', status: 'completed' },
    { id: 3, type: 'email', date: '2023-06-10 09:45', subject: 'Order confirmation', status: 'completed' },
    { id: 4, type: 'purchase', date: '2023-06-08', amount: '$124.99', items: 3, status: 'completed' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'chat': return <FiMessageSquare className="text-blue-500" />;
      case 'call': return <FiPhone className="text-green-500" />;
      case 'email': return <FiMail className="text-purple-500" />;
      case 'purchase': return <FiShoppingBag className="text-yellow-500" />;
      default: return <FiMessageSquare />;
    }
  };

  return (
    <div className="space-y-4">
      {interactions.map(interaction => (
        <motion.div
          key={interaction.id}
          whileHover={{ x: 5 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              {getIcon(interaction.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium capitalize">{interaction.type}</h4>
                <span className="text-sm text-gray-500">{interaction.date}</span>
              </div>
              
              {interaction.type === 'chat' || interaction.type === 'call' ? (
                <div className="text-sm text-gray-600 mt-1">
                  <p>Duration: {interaction.duration}</p>
                  <p>Agent: {interaction.agent}</p>
                </div>
              ) : interaction.type === 'email' ? (
                <div className="text-sm text-gray-600 mt-1">
                  <p>Subject: {interaction.subject}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-600 mt-1">
                  <p>Amount: {interaction.amount}</p>
                  <p>Items: {interaction.items}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <FiCheckCircle />
              <span className="text-xs capitalize">{interaction.status}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractionHistory;