import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <ShieldAlert size={32} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-dim)', maxWidth: '400px', marginBottom: '2rem' }}>
        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      <Link to="/dashboard" className="btn btn-primary">
        <Home size={18} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
