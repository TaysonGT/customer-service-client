import React from 'react';
import { Badge, Button } from '../../components/ui';
import { IChat } from '../../types/types';
import { useNavigate } from 'react-router';

interface ChatStatusProps {
  chat?: IChat;
  ticketId: string;
  className?: string;
}

export const ChatStatus: React.FC<ChatStatusProps> = ({
  chat,
  ticketId,
  className = ''
}) => {
  const nav = useNavigate()
  const getChatStatusVariant = (status?: IChat['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'waiting':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getChatStatusText = (status?: IChat['status']|'none') => {
    switch (status) {
      case 'active':
        return 'Active Chat';
      case 'waiting':
        return 'Waiting for Response';
      default:
        return 'Not Started Yet';
    }
  };

  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 text-lg">Chat Status</h3>
        <Badge variant={getChatStatusVariant(chat?.status)} size="sm">
          {getChatStatusText(chat?.status)}
        </Badge>
      </div>

      {!chat?
        <p className='text-sm text-gray-500 mt-2'>Chat hasn't started Yet</p>
      :
        <div className="space-y-3 mt-3">
          <div>
            <p className="text-xs text-gray-500">Participants</p>
            <p className="text-sm text-gray-900">
              {chat.users.length} person(s) in chat
            </p>
          </div>

          {chat.lastMessage && (
            <div>
              <p className="text-xs text-gray-500">Last Activity</p>
              <p className="text-sm text-gray-900">
                {new Date(chat.updatedAt).toLocaleString()}
              </p>
            </div>
          )}

          {chat.unread_messages && chat.unread_messages.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">Unread Messages</p>
              <p className="text-sm text-gray-900">
                {chat.unread_messages.length} unread message(s)
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => nav(`/tickets/${ticketId}/chat`)}
          >
            Go to Chat Room
          </Button>
        </div>
      }

    </div>
  );
};