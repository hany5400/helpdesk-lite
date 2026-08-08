import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/Common/StatCard';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import { Ticket, PlusCircle, Clock, CheckCircle2, PlayCircle, Eye, ArrowRight } from 'lucide-react';
import './TicketQueue.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axiosInstance.get('/tickets');
        if (res.data.success) {
          setTickets(res.data.tickets);
        }
      } catch (err) {
        console.error('Failed to fetch employee tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'To Do').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'In Progress' || t.status === 'In Review').length;
  const doneTickets = tickets.filter((t) => t.status === 'Done').length;

  if (loading) return <Spinner fullPage />;

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome, {user?.name} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track and manage your submitted IT support tickets.
          </p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>New Support Ticket</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid-stats">
        <StatCard
          title="Total Submitted"
          value={totalTickets}
          icon={Ticket}
          color="var(--accent-indigo)"
        />
        <StatCard
          title="Pending (To Do)"
          value={openTickets}
          icon={Clock}
          color="var(--status-todo)"
        />
        <StatCard
          title="In Progress / Review"
          value={inProgressTickets}
          icon={PlayCircle}
          color="var(--status-in-progress)"
        />
        <StatCard
          title="Resolved"
          value={doneTickets}
          icon={CheckCircle2}
          color="var(--status-done)"
        />
      </div>

      {/* Recent Tickets Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Tickets</h2>
          <Link to="/tickets" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            View All ({totalTickets}) <ArrowRight size={14} />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Ticket size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No support tickets created yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Click below to submit your first issue.</p>
            <Link to="/tickets/new" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Create Ticket
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>#{t.id}</td>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.category}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/tickets/${t.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
