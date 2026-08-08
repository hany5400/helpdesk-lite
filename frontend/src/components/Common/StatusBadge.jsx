import React from 'react';
import { Clock, PlayCircle, Eye, CheckCircle2 } from 'lucide-react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-todo';
  let Icon = Clock;

  switch (status) {
    case 'In Progress':
      badgeClass = 'badge-in-progress';
      Icon = PlayCircle;
      break;
    case 'In Review':
      badgeClass = 'badge-in-review';
      Icon = Eye;
      break;
    case 'Done':
      badgeClass = 'badge-done';
      Icon = CheckCircle2;
      break;
    case 'To Do':
    default:
      badgeClass = 'badge-todo';
      Icon = Clock;
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={13} />
      {status}
    </span>
  );
};

export default StatusBadge;
