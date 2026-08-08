import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color = 'var(--accent-indigo)' }) => {
  return (
    <div className="glass-card stat-card">
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
        <p className="stat-value">{value}</p>
      </div>
      <div
        className="stat-icon"
        style={{ color: color, background: `${color}18` }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
