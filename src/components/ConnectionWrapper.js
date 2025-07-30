import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from '../screens/NoInternet';

const ConnectionWrapper = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showNoInternet, setShowNoInternet] = useState(false);

  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    const connected = state.isConnected && state.isInternetReachable !== false;
    setIsConnected(connected);
    setShowNoInternet(!connected);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(connected);
      
      if (!connected) {
        // Show no internet overlay when connection lost
        setShowNoInternet(true);
      } else {
        // Hide no internet overlay when connection restored
        setShowNoInternet(false);
      }
    });

    checkConnection(); // Initial check

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Always render children to preserve navigation state */}
      {children}
      
      {/* Show no internet screen as overlay when offline */}
      {showNoInternet && (
        <NoInternetScreen 
          onRetry={checkConnection}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default ConnectionWrapper;
