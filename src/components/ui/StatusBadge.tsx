// File: src/components/ui/StatusBadge.tsx
import React from 'react';
import { Badge, BadgeVariant } from './Badge';
import { TicketStatus, TicketPriority } from '../../types/types';

interface StatusBadgeProps {
  status: TicketStatus;
  priority?: TicketPriority;
  className?: string;
}

const statusVariantMap: Record<TicketStatus, BadgeVariant> = {
  [TicketStatus.OPEN]: 'default',
  [TicketStatus.IN_PROGRESS]: 'primary',
  [TicketStatus.ON_HOLD]: 'warning',
  [TicketStatus.RESOLVED]: 'success',
  [TicketStatus.CLOSED]: 'outline'
};

const priorityVariantMap: Record<TicketPriority, BadgeVariant> = {
  [TicketPriority.LOW]: 'default',
  [TicketPriority.MEDIUM]: 'primary',
  [TicketPriority.HIGH]: 'warning',
  [TicketPriority.CRITICAL]: 'danger'
};

const statusTextMap: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'Open',
  [TicketStatus.IN_PROGRESS]: 'In Progress',
  [TicketStatus.ON_HOLD]: 'On Hold',
  [TicketStatus.RESOLVED]: 'Resolved',
  [TicketStatus.CLOSED]: 'Closed'
};

const priorityTextMap: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'Low',
  [TicketPriority.MEDIUM]: 'Medium',
  [TicketPriority.HIGH]: 'High',
  [TicketPriority.CRITICAL]: 'Critical'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  priority,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Badge variant={statusVariantMap[status]} size="sm">
        {statusTextMap[status]}
      </Badge>
      {priority && (
        <Badge variant={priorityVariantMap[priority]} size="sm">
          {priorityTextMap[priority]}
        </Badge>
      )}
    </div>
  );
};