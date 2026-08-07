import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import { ArrowLeft, User, Calendar, Tag, Shield, Headphones, CheckCircle2, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'In Review', 'Done'];

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchTicket = async () => {
    try {
      const res = await axiosInstance.get(`/tickets/${id}`);
      if (res.data.success) {
        setTicket(res.data.ticket);
        setSelectedStatus(res.data.ticket.status);
      }
    } catch (err) {
      showToast('Failed to load ticket details or access denied.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === ticket.status) return;

    setUpdating(true);
    try {
      const res = await axiosInstance.put(`/support/tickets/${ticket.id}/status`, {
        status: selectedStatus
      });

      if (res.data.success) {
        showToast(`Status updated to '${selectedStatus}'`, 'success');
        setTicket(res.data.ticket);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update ticket status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Ticket Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The ticket you are looking for does not exist or you do not have permission to view it.</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const isSupportOrManager = user?.role === 'support' || user?.role === 'manager';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Ticket Header Card */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                Ticket #{ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>{ticket.title}</h1>
          </div>
        </div>

        {/* Support Status Update Bar (if Support / Manager) */}
        {isSupportOrManager && (
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'rgba(99, 102, 241, 0.06)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Headphones size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Support Management: Update Status</span>
            </div>

            <form onSubmit={handleStatusChange} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '160px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={updating || selectedStatus === ticket.status}
              >
                {updating ? <Spinner size={14} /> : <><RefreshCw size={14} /> Update</>}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Grid: Description & Metadata */}
      <div className="grid-two-col">
        {/* Left: Description */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Problem Description
          </h3>
          <div style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            {ticket.description}
          </div>
        </div>

        {/* Right: Ticket Attributes */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Ticket Overview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Tag size={18} style={{ color: 'var(--accent-indigo)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</p>
                <p style={{ fontWeight: 600 }}>{ticket.category}</p>
              </div>
            </div>

            {/* Created By */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={18} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employee (Requester)</p>
                <p style={{ fontWeight: 600 }}>{ticket.employee_name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ticket.employee_email}</p>
              </div>
            </div>

            {/* Assigned To */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={18} style={{ color: 'var(--priority-medium)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Support</p>
                <p style={{ fontWeight: 600 }}>
                  {ticket.assigned_to_name ? ticket.assigned_to_name : 'Unassigned'}
                </p>
                {ticket.assigned_to_email && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ticket.assigned_to_email}</p>
                )}
              </div>
            </div>

            {/* Created Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created Date</p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RefreshCw size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Updated</p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {new Date(ticket.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
