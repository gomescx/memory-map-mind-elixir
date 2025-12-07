/**
 * Reusable alert/toast component for errors, warnings, and info messages
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import './alert.css';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
  duration?: number;
}

interface AlertProps {
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

/**
 * Single alert notification component
 */
const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

    onError?: (error: string) => void;
    onWarning?: (warning: string) => void;
  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
    onError,
    onWarning,
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`alert alert--${type}`}>
      <div className="alert__icon">
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
        {type === 'success' && '✅'}
      </div>
      <div className="alert__message">{message}</div>
      <button
        className="alert__close"
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Alert container that manages multiple notifications
 */
interface AlertContainerProps {
  maxAlerts?: number;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  maxAlerts = 5,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const alertsRef = useRef<AlertMessage[]>([]);

  const addAlert = useCallback(
    (message: string, type: AlertType = 'info', duration?: number) => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      const newAlert: AlertMessage = { id, message, type, duration };

      alertsRef.current = [...alertsRef.current, newAlert];
      if (alertsRef.current.length > maxAlerts) {
        alertsRef.current = alertsRef.current.slice(-maxAlerts);
      }
      setAlerts([...alertsRef.current]);
    },
    [maxAlerts]
  );

  const removeAlert = useCallback((id: string) => {
    alertsRef.current = alertsRef.current.filter((a) => a.id !== id);
    setAlerts([...alertsRef.current]);
  }, []);

  const clearAlerts = useCallback(() => {
    alertsRef.current = [];
    setAlerts([]);
  }, []);

  // Expose methods via context provider
  React.useContext = (context: React.Context<any>) => {
    if (context === AlertContext) {
      return { addAlert, removeAlert, clearAlerts };
    }
    return React.useContext(context);
  };

              onError={(error) => console.error(error)}
              onWarning={(warning) => console.warn(warning)}
  return (
    <AlertProvider value={{ addAlert, removeAlert, clearAlerts }}>
      <div className="alert-container">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            duration={alert.duration}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertProvider>
  );
};

/**
 * Context for alert management
 */
interface AlertContextType {
  addAlert: (message: string, type?: AlertType, duration?: number) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const AlertContext = React.createContext<AlertContextType>({
  addAlert: () => {},
  removeAlert: () => {},
  clearAlerts: () => {},
});

/**
 * Provider component
 */
const AlertProvider: React.FC<{
  value: AlertContextType;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
);

/**
 * Hook to use alert functionality
 */
export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    console.warn(
      'useAlert must be used within AlertContainer component tree'
    );
  }
  return context;
};

export default Alert;
