// File: src/components/ui/UserInfo.tsx
import React from 'react';
import { Avatar } from './Avatar';
import { IUser } from '../../types/types';

interface UserInfoProps {
  user: IUser;
  label?: string;
  className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  user,
  label,
  className = ''
}) => {
  const fullName = `${user.firstname} ${user.lastname}`;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar src={user.avatarUrl} alt={fullName} size="sm" />
      <div className="min-w-0">
        {label && <p className="text-xs text-gray-500">{label}</p>}
        <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
    </div>
  );
};