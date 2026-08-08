import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import StatCard from '../components/Common/StatCard';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import Spinner from '../components/Common/Spinner';
import SearchableSelect from '../components/Common/SearchableSelect';
import { useToast } from '../context/ToastContext';
import './ManagerDashboard.css';
import './TicketQueue.css';
import {
  BarChart3,
  Ticket,
  Clock,
  PlayCircle,
  CheckCircle2,
  PieChart,
  Layers,
  Search,
  Filter,
  Eye,
  Inbox,
  AlertCircle,
  RefreshCw,
  ListFilter
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses', icon: ListFilter },
  { value: 'To Do', label: 'To Do', icon: Clock },
  { value: 'In Progress', label: 'In Progress', icon: PlayCircle },
  { value: 'In Review', label: 'In Review', icon: Eye },
  { value: 'Done', label: 'Done', icon: CheckCircle2 }
];

const ManagerDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/manager/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load manager dashboard statistics:', err);
    }
  }, []);

  const fetchAllTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setTicketsLoading(true);
    const startTime = Date.now();
    try {
      const res = await axiosInstance.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally {
      setTicketsLoading(false);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed);
      setTimeout(() => setRefreshing(false), remaining);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchAllTickets()]);
      setLoading(false);
    };
    loadInitialData();
  }, [fetchStats, fetchAllTickets]);

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

  const { total, open, in_progress, closed, byStatus, byPriority, byCategory } = stats || {};

  return (
    <div>
      {/* Header */}
      <div className="manager-header">
        <div className="manager-header-content">
          <div className="manager-header-icon">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="manager-header-title">Executive Manager Dashboard</h1>
            <p className="manager-header-subtitle">
              Overview of ticket volume, status distributions, priority metrics, and system performance.
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary refresh-btn"
          onClick={() => fetchAllTickets(true)}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
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
          <div className="analytics-section-header">
            <PieChart size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 className="analytics-section-title">Tickets by Status</h2>
          </div>

          <div className="analytics-bars">
            {byStatus && byStatus.map((item) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.status}>
                  <div className="analytics-bar-label">
                    <StatusBadge status={item.status} />
                    <span className="analytics-bar-count">
                      {item.count} ticket{item.count > 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.status === 'Done' ? 'var(--status-done)' :
                                    item.status === 'In Progress' ? 'var(--status-in-progress)' :
                                    item.status === 'In Review' ? 'var(--status-in-review)' : 'var(--status-todo)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tickets by Priority */}
        <div className="glass-card">
          <div className="analytics-section-header">
            <BarChart3 size={20} style={{ color: 'var(--accent-indigo)' }} />
            <h2 className="analytics-section-title">Tickets by Priority</h2>
          </div>

          <div className="analytics-bars">
            {byPriority && byPriority.map((item) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.priority}>
                  <div className="analytics-bar-label">
                    <PriorityBadge priority={item.priority} />
                    <span className="analytics-bar-count">
                      {item.count} ticket{item.count > 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.priority === 'High' ? 'var(--priority-high)' :
                                    item.priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="analytics-section-header">
          <Layers size={20} style={{ color: 'var(--accent-purple)' }} />
          <h2 className="analytics-section-title">Category Breakdown</h2>
        </div>

        <div className="category-grid">
          {byCategory && byCategory.map((item) => (
            <div key={item.category} className="category-item">
              <span className="category-name">{item.category}</span>
              <span className="category-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full Ticket List */}
      <div className="glass-card ticket-queue-card">
        <div className="ticket-queue-header">
          <h2 className="ticket-queue-title">
            <Inbox size={20} />
            All System Tickets
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

        {ticketsLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Spinner />
          </div>
        ) : filteredTickets.length === 0 ? (
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

export default ManagerDashboard;
