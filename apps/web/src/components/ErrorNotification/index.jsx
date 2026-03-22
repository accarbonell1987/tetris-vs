import { useEffect } from 'react';
import useGlobalStore from '../../store/useGlobalStore';

const ErrorNotification = () => {
  const error = useGlobalStore(state => state.error);
  const clearError = useGlobalStore(state => state.clearError);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      padding: '12px 16px',
      borderRadius: '8px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <strong style={{ display: 'block', marginBottom: '4px' }}>{error.message}</strong>
        <small style={{ color: '#dc2626', fontSize: '0.875em' }}>{error.details}</small>
      </div>
      <button
        onClick={clearError}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#991b1b',
          cursor: 'pointer',
          fontSize: '1.25rem',
          marginLeft: '12px',
          padding: '0 4px'
        }}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorNotification;