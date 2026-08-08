import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 24, fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%' }}>
        <div className="spinner" style={{ width: size, height: size }} />
      </div>
    );
  }

  return <div className="spinner" style={{ width: size, height: size }} />;
};

export default Spinner;
