import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import SearchableSelect from '../components/Common/SearchableSelect';
import { useToast } from '../context/ToastContext';
import './TicketQueue.css';
import {
  Ticket,
  Search,
  Filter,
  Eye,
  Inbox,
  AlertCircle,
  RefreshCw,
  Clock,
  PlayCircle,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses', icon: ListFilter },
  { value: 'To Do', label: 'To Do', icon: Clock },
  { value: 'In Progress', label: 'In Progress', icon: PlayCircle },
  { value: 'In Review', label: 'In Review', icon: Eye },
  { value: 'Done', label: 'Done', icon: CheckCircle2 }
];

const ManagerTickets = () => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const startTime = Date.now();
    try {
      const res = await axiosInstance.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed);
      setTimeout(() => setRefreshing(false), remaining);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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
      <div className="manager-header">
        <div className="manager-header-content">
          <div className="manager-header-icon">
            <Ticket size={28} />
          </div>
          <div>
            <h1 className="manager-header-title">All System Tickets</h1>
            <p className="manager-header-subtitle">
              View-only access to all tickets across the system. Contact support to make changes.
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary refresh-btn"
          onClick={() => fetchTickets(true)}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Ticket List */}
      <div className="glass-card ticket-queue-card">
        <div className="ticket-queue-header">
          <h2 className="ticket-queue-title">
            <Inbox size={20} />
            System Tickets
          </h2>
          <span className="ticket-count-badge">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="filter-bar-inner" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
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

        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <AlertCircle size={48} />
            </div>
            <h3 className="empty-state-title">No tickets found</h3>
            <p className="empty-state-text">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no tickets in the system yet.'}
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
                  <th>Created</th>
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
                      <span className="assigned-other">
                        {t.assigned_to_name || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span className="category-tag">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}
                      </span>
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

export default ManagerTickets;
