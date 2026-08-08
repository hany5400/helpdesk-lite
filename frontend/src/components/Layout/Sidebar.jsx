import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket, 
  Headphones, 
  BarChart3, 
  LogOut, 
  ShieldCheck, 
  User 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <Headphones size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HelpDesk <span style={{ color: 'var(--accent-cyan)', WebkitTextFillColor: 'var(--accent-cyan)' }}>Lite</span>
          </h2>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Support System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1.25rem 1rem' }}>
        {user?.role === 'employee' && (
          <>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0 0.5rem 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
              Employee Workspace
            </div>
            <NavLink to="/tickets/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={18} />
              <span>Create Ticket</span>
            </NavLink>
            <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Ticket size={18} />
              <span>My Tickets</span>
            </NavLink>
          </>
        )}

        {user?.role === 'support' && (
          <>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0 0.5rem 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
              Support Desk
            </div>
            <NavLink to="/support" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Headphones size={18} />
              <span>Ticket Queue</span>
            </NavLink>
          </>
        )}

        {user?.role === 'manager' && (
          <>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0 0.5rem 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
              Management Portal
            </div>
            <NavLink to="/manager" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>Analytics Dashboard</span>
            </NavLink>
            <NavLink to="/manager/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Ticket size={18} />
              <span>All System Tickets</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <User size={18} />
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <span className="badge badge-role" style={{ fontSize: '0.675rem', padding: '0.1rem 0.5rem' }}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.825rem', padding: '0.5rem' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
