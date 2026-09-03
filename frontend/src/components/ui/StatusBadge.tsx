import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';
import Badge, { type BadgeVariant } from './Badge';

export type OperationalStatus = 
  | 'READY' 
  | 'IN_PROGRESS' 
  | 'DELAYED' 
  | 'CRITICAL' 
  | 'AVAILABLE' 
  | 'CLEANING' 
  | 'OCCUPIED' 
  | 'COMPLETED'
  | 'PENDING';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const normalized = status.toUpperCase().replace(' ', '_') as OperationalStatus | string;

  let variant: BadgeVariant = 'default';
  let Icon = Clock;
  let label = status.toUpperCase();

  switch (normalized) {
    case 'READY':
    case 'COMPLETED':
    case 'AVAILABLE':
    case 'SAFE':
      variant = 'success';
      Icon = CheckCircle2;
      break;
    case 'IN_PROGRESS':
    case 'CLEANING':
    case 'ACTIVE':
      variant = 'info';
      Icon = PlayCircle;
      break;
    case 'DELAYED':
    case 'WARNING':
    case 'MAINTENANCE':
    case 'OVERDUE':
      variant = 'warning';
      Icon = AlertTriangle;
      break;
    case 'CRITICAL':
    case 'OCCUPIED':
    case 'FAILED':
    case 'BLOCKER':
      variant = 'danger';
      Icon = AlertCircle;
      break;
    case 'PENDING':
    case 'QUEUED':
      variant = 'default';
      Icon = Clock;
      break;
    default:
      variant = 'default';
      Icon = Loader2;
  }

  return (
    <Badge variant={variant} className={className}>
      {showIcon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
      {label}
    </Badge>
  );
};
