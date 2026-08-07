import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import StatCard from '../components/Common/StatCard';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import { 
  BarChart3, 
  Ticket, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  PieChart, 
  Layers, 
  ArrowRight,
  Eye
} from 'lucide-react';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/manager/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load manager dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner fullPage />;

  const { total, open, in_progress, closed, byStatus, byPriority, byCategory, recentTickets } = stats || {};

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Executive Manager Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Overview of ticket volume, status distributions, priority metrics, and system performance.
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid-stats">
        <StatCard
          title="Total Tickets"
          value={total || 0}
          icon={Ticket}
          color="var(--accent-indigo)"
        />
        <StatCard
          title="Open Tickets (To Do)"
          value={open || 0}
          icon={Clock}
          color="var(--status-todo)"
        />
        <StatCard
          title="In Progress / Review"
          value={in_progress || 0}
          icon={PlayCircle}
          color="var(--status-in-progress)"
        />
        <StatCard
          title="Closed (Done)"
          value={closed || 0}
          icon={CheckCircle2}
          color="var(--status-done)"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid-two-col" style={{ marginBottom: '2rem' }}>
        {/* Tickets by Status */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tickets by Status</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {byStatus && byStatus.map((item) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={item.status} />
                    </div>
                    <span style={{ fontWeight: 700 }}>
                      {item.count} ticket{item.count > 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: item.status === 'Done' ? 'var(--status-done)' :
                                  item.status === 'In Progress' ? 'var(--status-in-progress)' :
                                  item.status === 'In Review' ? 'var(--status-in-review)' : 'var(--status-todo)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tickets by Priority */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-indigo)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tickets by Priority</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {byPriority && byPriority.map((item) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.priority}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                    <PriorityBadge priority={item.priority} />
                    <span style={{ fontWeight: 700 }}>
                      {item.count} ticket{item.count > 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: item.priority === 'High' ? 'var(--priority-high)' :
                                  item.priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Activity */}
      <div className="grid-two-col">
        {/* Tickets by Category */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={20} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Breakdown</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {byCategory && byCategory.map((item) => (
              <div
                key={item.category}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.category}</span>
                <span style={{
                  padding: '0.2rem 0.65rem',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: 'var(--accent-indigo)',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets Table */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent System Activity</h2>
            <Link to="/support" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Full Log <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Requester</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets && recentTickets.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>#{t.id}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.title}</td>
                    <td style={{ fontSize: '0.85rem' }}>{t.employee_name}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <Link to={`/tickets/${t.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
