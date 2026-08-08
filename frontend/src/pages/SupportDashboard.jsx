import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/Common/StatCard';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import SearchableSelect from '../components/Common/SearchableSelect';
import {
  Headphones,
  Clock,
  PlayCircle,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  UserCheck,
  Shield,
  RefreshCw,
  Inbox,
  AlertCircle,
  ListFilter
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses', icon: ListFilter },
  { value: 'To Do', label: 'To Do', icon: Clock },
  { value: 'In Progress', label: 'In Progress', icon: PlayCircle },
  { value: 'In Review', label: 'In Review', icon: Eye },
  { value: 'Done', label: 'Done', icon: CheckCircle2 }
];

const SupportDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSupportTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axiosInstance.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      showToast('Failed to load support tickets queue', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSupportTickets();
  }, [fetchSupportTickets]);

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
      {/* Header */}
      <div className="support-header">
        <div className="support-header-content">
          <div className="support-header-icon">
            <Headphones size={28} />
          </div>
          <div>
            <h1 className="support-header-title">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="support-header-subtitle">
              Manage incoming support requests, claim unassigned tickets, and update resolution statuses.
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary refresh-btn"
          onClick={() => fetchSupportTickets(true)}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Queue'}</span>
        </button>
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
      <div className="glass-card filter-bar">
        <div className="filter-bar-inner">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by requester name, title, category or #ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <SearchableSelect
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Statuses"
              icon={Filter}
            />
          </div>
        </div>
      </div>

      {/* Ticket Queue Table */}
      <div className="glass-card ticket-queue-card">
        <div className="ticket-queue-header">
          <h2 className="ticket-queue-title">
            <Inbox size={20} />
            Ticket Queue
          </h2>
          <span className="ticket-count-badge">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <AlertCircle size={48} />
            </div>
            <h3 className="empty-state-title">No tickets found</h3>
            <p className="empty-state-text">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no tickets in the queue at the moment.'}
            </p>
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
                  <th>Status</th>
                  <th>Assigned Support</th>
                  <th>Update Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="table-row">
                    <td>
                      <span className="ticket-id">#{t.id}</span>
                    </td>
                    <td>
                      <span className="ticket-title">{t.title}</span>
                    </td>
                    <td>
                      <div className="employee-cell">
                        <span className="employee-name">{t.employee_name}</span>
                        <span className="employee-email">{t.employee_email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{t.category}</span>
                    </td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      {updatingId === t.id ? (
                        <Spinner size={16} />
                      ) : t.assigned_to === user?.id ? (
                        <span className="assigned-badge">
                          <Shield size={14} /> Assigned to Me
                        </span>
                      ) : !t.assigned_to ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm claim-btn"
                          onClick={() => handleClaimTicket(t.id)}
                        >
                          <UserCheck size={14} /> Claim Ticket
                        </button>
                      ) : (
                        <span className="assigned-other">
                          {t.assigned_to_name}
                        </span>
                      )}
                    </td>
                    <td>
                      {updatingId === t.id ? (
                        <Spinner size={16} />
                      ) : (
                        <select
                          className="form-select status-select"
                          value={t.status}
                          onChange={(e) => handleStatusUpdate(t.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <Link to={`/tickets/${t.id}`} className="btn btn-secondary btn-sm view-btn">
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
