import {useEffect, useState} from 'react';
import {api, setAuth} from './api';
import AuthLogin from './AuthLogin.jsx';
import AuthRegister from './AutoRegister.jsx';

import ManagerDashboard from './components/manager/ManagerDashboard.jsx';
import WaiterDashboard from './components/waiter/WaiterDashboard.jsx';
import ClientTables from "./components/client/ClientTables.jsx";

export default function App() {
    const [authed, setAuthed] = useState(!!localStorage.getItem('access'));
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) setAuth(token);

        const check = async () => {
            setLoading(true);
            setErr('');
            try {
                const {data} = await api.get('/me/');
                setMe(data);
                setAuthed(true);
            } catch {
                setAuth(null);
                setMe(null);
                setAuthed(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) check(); else setLoading(false);
    }, []);

    const handleLoggedIn = async () => {
        try {
            const {data} = await api.get('/me/');
            setMe(data);
            setAuthed(true);
        } catch {
            setAuth(null);
            setMe(null);
            setAuthed(false);
            setErr('Cannot load profile.');
        }
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        setMe(null);
        setAuthed(false);
    };

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e2e8f0',
                        borderTop: '4px solid #6366f1',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>Loading...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (!authed) {
        return showRegister ? (
            <AuthRegister
                onLoggedIn={handleLoggedIn}
                onSwitchToLogin={() => setShowRegister(false)}
            />
        ) : (
            <AuthLogin
                onLoggedIn={handleLoggedIn}
                onSwitchToRegister={() => setShowRegister(true)}
            />
        );
    }

    if (me?.role === 'manager') {
        return <ManagerDashboard me={me} onLogout={logout} />;
    }
    if (me?.role === 'waiter') {
        return <WaiterDashboard me={me} onLogout={logout} />;
    }
    if (me?.role === 'client') {
        return <ClientTables me={me} onLogout={logout} />;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '40px',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#1a202c',
                    marginBottom: '16px'
                }}>
                    Access Denied
                </h2>
                <p style={{
                    color: '#718096',
                    marginBottom: '24px'
                }}>
                    Unknown role: {me?.role ?? '(none)'}
                </p>
                <button
                    onClick={logout}
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc2626';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ef4444';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}