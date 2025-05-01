// components/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // или 100%, если нужен внутри контейнера
    width: '100%',
    position: 'fixed', // чтобы был по центру вне потока
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // фон для overlay
    zIndex: 9999
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #ccc',
      borderTop: '4px solid #333',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default Spinner;