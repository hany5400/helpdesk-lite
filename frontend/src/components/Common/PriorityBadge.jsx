import React from 'react';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';
import './PriorityBadge.css';

const PriorityBadge = ({ priority }) => {
  let badgeClass = 'badge-medium';
  let Icon = Minus;

  switch (priority) {
    case 'High':
      badgeClass = 'badge-high';
      Icon = ArrowUp;
      break;
    case 'Low':
      badgeClass = 'badge-low';
      Icon = ArrowDown;
      break;
    case 'Medium':
    default:
      badgeClass = 'badge-medium';
      Icon = Minus;
      break;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={13} />
      {priority}
    </span>
  );
};

export default PriorityBadge;
