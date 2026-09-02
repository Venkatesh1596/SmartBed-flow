import React, { useEffect, useState } from 'react';
import type { AppNotification } from '../api/dashboardApi';
import { 
    fetchNotifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    generateNotifications 
} from '../api/dashboardApi';

type FilterType = 'ALL' | 'UNREAD' | 'INFO' | 'WARNING' | 'CRITICAL';

export const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const loadNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchNotifications();
            setNotifications(data || []);
            setLastRefreshed(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000); // 30-second polling for auto-refresh
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: number) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Failed to mark read', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Failed to mark all read', err);
        }
    };

    const handleGenerateMock = async () => {
        try {
            await generateNotifications();
            await loadNotifications();
        } catch (err) {
            console.error('Failed to generate mock notifications', err);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'UNREAD') return !n.is_read;
        if (filter === 'INFO') return n.type === 'INFO';
        if (filter === 'WARNING') return n.type === 'WARNING';
        if (filter === 'CRITICAL') return n.type === 'CRITICAL';
        return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="notification-center" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Notification Center</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85em', color: '#666' }}>
                        Last refreshed: {lastRefreshed.toLocaleTimeString()}
                    </span>
                    <button onClick={loadNotifications} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={handleGenerateMock}>Generate Mock</button>
                    <button onClick={handleMarkAllRead}>Mark All Read</button>
                </div>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                {(['ALL', 'UNREAD', 'INFO', 'WARNING', 'CRITICAL'] as FilterType[]).map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        style={{ fontWeight: filter === f ? 'bold' : 'normal', backgroundColor: filter === f ? '#e0e0e0' : 'white' }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="notification-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredNotifications.length === 0 ? (
                    <div>No notifications found.</div>
                ) : (
                    filteredNotifications.map(n => (
                        <div key={n.id} style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            borderLeft: `5px solid ${n.type === 'CRITICAL' ? 'red' : n.type === 'WARNING' ? 'orange' : 'blue'}`,
                            backgroundColor: n.is_read ? '#f9f9f9' : '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{n.title} {!n.is_read && <span style={{ color: 'red', fontSize: '0.8em' }}>*New*</span>}</h4>
                                <p style={{ margin: '0 0 5px 0' }}>{n.message}</p>
                                <small style={{ color: '#888' }}>{new Date(n.created_at).toLocaleString()}</small>
                            </div>
                            {!n.is_read && (
                                <button onClick={() => handleMarkRead(n.id)} style={{ padding: '5px 10px' }}>
                                    Mark Read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
