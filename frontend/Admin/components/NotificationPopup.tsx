'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications, type Notification, type NotificationType } from '../context/NotificationContext';

// Notification Toast Component
interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          icon: '✅',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          icon: '❌',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          icon: '⚠️',
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          icon: 'ℹ️',
        };
    }
  };

  const typeStyles = getTypeStyles(notification.type);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minWidth: '320px',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.98)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    zIndex: 9999,
    overflow: 'hidden',
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    opacity: isRemoving ? '0' : isVisible ? '1' : '0',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyle: React.CSSProperties = {
    background: typeStyles.background,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px',
    color: '#374151',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px' }}>{typeStyles.icon}</span>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            {notification.title}
          </h4>
        </div>
        <button
          onClick={handleClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          ×
        </button>
      </div>
      <div style={contentStyle}>
        <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>
          {notification.message}
        </p>
        <div style={{ 
          marginTop: '12px', 
          fontSize: '12px', 
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{notification.timestamp.toLocaleTimeString()}</span>
          {!notification.isRead && (
            <span style={{
              background: typeStyles.background,
              color: 'white',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '500'
            }}>
              NEW
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Notification Component
export default function NotificationPopup() {
  const { notifications, removeNotification } = useNotifications();
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show only the latest 3 notifications
    const recent = notifications.slice(0, 3);
    setActiveNotifications(recent);
  }, [notifications]);

  const handleCloseNotification = (id: string) => {
    removeNotification(id);
  };

  return (
    <>
      {activeNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            position: 'fixed',
            top: `${80 + (index * 120)}px`,
            right: '20px',
            zIndex: 9999 - index,
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => handleCloseNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
}