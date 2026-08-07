import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/Common/StatCard';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import { Headphones, Clock, PlayCircle, CheckCircle2, Search, Filter, Eye, UserCheck, Shield, PlusCircle } from 'lucide-react';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'In Review', 'Done'];

const SupportDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSupportTickets = async () => {
    try {
      const res = await axiosInstance.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      showToast('Failed to load support tickets queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      const res = await axiosInstance.put(`/support/tickets/${ticketId}/status`, {
        status: newStatus
      });

      if (res.data.success) {
        showToast(`Ticket #${ticketId} status changed to '${newStatus}'`, 'success');
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? res.data.ticket : t))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update ticket status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClaimTicket = async (ticketId) => {
    setUpdatingId(ticketId);
    try {
      const res = await axiosInstance.put(`/support/tickets/${ticketId}/assign`, {
        assigned_to: user?.id
      });

      if (res.data.success) {
        showToast(`Ticket #${ticketId} assigned to you!`, 'success');
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? res.data.ticket : t))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to claim ticket', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const myAssignedCount = tickets.filter((t) => t.assigned_to === user?.id).length;
  const toDoCount = tickets.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'In Review').length;
  const doneCount = tickets.filter((t) => t.status === 'Done').length;

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      `#${t.id}`.includes(search);

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Spinner fullPage />;

  return (
    <div>
      {/* Header with Create Ticket Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Support Staff Workspace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage incoming support requests, claim unassigned tickets, and update resolution statuses.
          </p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Create Ticket</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-stats">
        <StatCard
          title="Assigned to Me"
          value={myAssignedCount}
          icon={Headphones}
          color="var(--accent-indigo)"
        />
        <StatCard
          title="Unassigned (To Do)"
          value={toDoCount}
          icon={Clock}
          color="var(--status-todo)"
        />
        <StatCard
          title="Active (In Progress)"
          value={inProgressCount}
          icon={PlayCircle}
          color="var(--status-in-progress)"
        />
        <StatCard
          title="Resolved (Done)"
          value={doneCount}
          icon={CheckCircle2}
          color="var(--status-done)"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by requester name, title, category or #ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ticket Queue Table */}
      <div className="glass-card">
        {filteredTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Headphones size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No support tickets match the current criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th>Assigned Support</th>
                  <th>Update Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>#{t.id}</td>
                    <td style={{ fontWeight: 600, maxWidth: '220px' }}>{t.title}</td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.employee_name}</p>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>{t.employee_email}</p>
                      </div>
                    </td>
                    <td>{t.category}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      {updatingId === t.id ? (
                        <Spinner size={16} />
                      ) : t.assigned_to === user?.id ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--accent-cyan)',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          <Shield size={14} /> Assigned to Me
                        </span>
                      ) : !t.assigned_to ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleClaimTicket(t.id)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem', gap: '0.35rem', whiteSpace: 'nowrap' }}
                        >
                          <UserCheck size={14} /> Claim Ticket
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {t.assigned_to_name}
                        </span>
                      )}
                    </td>
                    <td>
                      {updatingId === t.id ? (
                        <Spinner size={16} />
                      ) : (
                        <select
                          className="form-select"
                          value={t.status}
                          onChange={(e) => handleStatusUpdate(t.id, e.target.value)}
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      )}
                    </td>
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
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
