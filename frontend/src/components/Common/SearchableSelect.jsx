import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import './SearchableSelect.css';

const SearchableSelect = ({ options, value, onChange, placeholder = 'Select...', icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="ss-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`ss-trigger ${isOpen ? 'ss-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon size={15} className="ss-trigger-icon" />}
        <span className="ss-trigger-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`ss-chevron ${isOpen ? 'ss-chevron-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="ss-dropdown">
          <div className="ss-search-wrapper">
            <Search size={14} className="ss-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="ss-search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                  setSearch('');
                }
              }}
            />
          </div>
          <div className="ss-options-list">
            {filteredOptions.length === 0 ? (
              <div className="ss-no-results">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`ss-option ${value === opt.value ? 'ss-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.icon && <opt.icon size={15} className="ss-option-icon" />}
                  <span>{opt.label}</span>
                  {value === opt.value && <Check size={14} className="ss-check" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
