import {useEffect, useState} from 'react';
import {api, setAuth} from './api';
import AuthLogin from './AuthLogin.jsx';

import ManagerDashboard from './components/manager/ManagerDashboard.jsx';
import WaiterDashboard from './components/waiter/WaiterDashboard.jsx';
import ClientTables from "./components/client/ClientTables.jsx";


export default function App() {
    const [authed, setAuthed] = useState(!!localStorage.getItem('access'));
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

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
            setErr('Не може да се вчита профилот.');
        }
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        setMe(null);
        setAuthed(false);
    };

    if (loading) {
        return <div className="wrapper"><div className="center-container">Loading…</div></div>;
    }

    if (!authed) {
        return (
            <div className="wrapper" style={{display: 'flex', justifyContent: 'center', paddingTop: 80}}>
                <AuthLogin onLoggedIn={handleLoggedIn}/>
            </div>
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
        <div className="wrapper">
            <div className="center-container" style={{maxWidth: 900}}>
                <h2 className="title">No access</h2>
                <p>Непозната улога: {me?.role ?? '(none)'}</p>
                <button className="btn" onClick={logout}>Logout</button>
            </div>
        </div>
    );
}
