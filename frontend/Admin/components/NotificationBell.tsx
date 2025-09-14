'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bellStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '12px',
    background: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
    animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: '0',
    width: '380px',
    maxHeight: '480px',
    background: 'rgba(255, 255, 255, 0.98)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    zIndex: 1000,
    marginTop: '8px',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const notificationItemStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .notification-item:hover {
          background: rgba(102, 126, 234, 0.05) !important;
        }
        
        .connection-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${isConnected ? '#10b981' : '#ef4444'};
          margin-left: 8px;
          animation: ${isConnected ? 'none' : 'blink 1s infinite'};
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
      
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          style={bellStyle}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            if (!isOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: 'white' }}
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          
          {unreadCount > 0 && (
            <div style={badgeStyle}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>

        <div style={dropdownStyle}>
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                Notifications
              </h3>
              <div className="connection-indicator" title={isConnected ? 'Connected' : 'Disconnected'} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px' 
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔔</div>
                <p style={{ margin: 0 }}>No notifications yet</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                  We'll notify you when something happens!
                </p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className="notification-item"
                  style={{
                    ...notificationItemStyle,
                    background: notification.isRead ? 'transparent' : 'rgba(102, 126, 234, 0.03)',
                    borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                  }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      lineHeight: '1.3'
                    }}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getTypeColor(notification.type),
                        marginLeft: '8px',
                        marginTop: '2px',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '13px', 
                    color: '#4b5563',
                    lineHeight: '1.4'
                  }}>
                    {notification.message}
                  </p>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
                View All ({notifications.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}