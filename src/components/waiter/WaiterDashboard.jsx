import WaiterBoard from './WaiterBoard.jsx';
import {setAuth} from '../../api.js';
import './WaiterBoard.css';

export default function WaiterDashboard({me, onLogout}) {
    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        onLogout?.();
    };

    return (
        <div className="page-top">
            {/* HEADER е надвор од client-layout */}
            <div className="center-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
                <div className="titleWaiter">
                    <span>Waiter dashboard</span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {me && <span style={{ fontSize: 14, opacity: .8 }}>Hello, {me.username}</span>}
                        <button className="btnLogout" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>

            {/* ЛЕВО tables + ДЕСНО orders */}
            <WaiterBoard />
        </div>
    );
}
