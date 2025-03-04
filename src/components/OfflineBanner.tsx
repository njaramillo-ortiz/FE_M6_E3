import React, { useEffect, useState } from 'react';

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{ backgroundColor: '#ffcc00', padding: '10px', textAlign: 'center' }}>
      Estás offline. Algunas funciones pueden no estar disponibles.
    </div>
  );
};

export default OfflineBanner;