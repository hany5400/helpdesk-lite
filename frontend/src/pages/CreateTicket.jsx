import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Common/Spinner';
import { PlusCircle, ArrowLeft, Send } from 'lucide-react';

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'HR & Facilities', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast('Please provide both title and detailed description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/tickets', {
        title: title.trim(),
        category,
        priority,
        description: description.trim()
      });

      if (res.data.success) {
        showToast('Ticket created successfully!', 'success');
        navigate(`/tickets/${res.data.ticket.id}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create support ticket.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <PlusCircle size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create New Support Ticket</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Describe the issue in detail so our support staff can assist you promptly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Ticket Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Cannot connect to company VPN after OS update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid-two-col" style={{ marginBottom: '1.25rem' }}>
            {/* Category */}
            <div>
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="form-label">Priority Level *</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p} Priority</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Please detail steps to reproduce, error messages, computer OS version, and any troubleshooting already tried..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/tickets')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '160px' }}
            >
              {submitting ? (
                <Spinner size={18} />
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
