import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import { ShieldCheck, UserCheck, LifeBuoy } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LifeBuoy size={20} style={{ color: 'var(--accent-cyan)' }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Enterprise Ticket Desk
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--priority-low)' }} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
