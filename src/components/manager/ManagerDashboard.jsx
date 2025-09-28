import { useState } from 'react';
import ManagerReservations from './ManagerReservations.jsx';
import ManagerTableEditor from './ManagerTableEditor.jsx';
import { setAuth } from '../../api.js';

export default function ManagerDashboard({ me, onLogout }) {
    const [tab, setTab] = useState('reservations');

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        onLogout?.();
    };

    return (
        <div className="page">
            <div className="page-inner" style={{ marginLeft: "110px" }} >

                <div className="page-header" >
                    <div className="heading">Manager dashboard</div>

                    <div className="right">
                        {me && <span>Hello, {me.username}</span>}
                        <button className="btn add" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="tabs tabs-narrow" style={{ marginLeft: "400px" }}>
                    <button
                        className={`btn-tab ${tab === 'reservations' ? 'active' : ''}`}
                        onClick={() => setTab('reservations')}
                    >
                        Reservations
                    </button>
                    <button
                        className={`btn-tab ${tab === 'tables' ? 'active' : ''}`}
                        onClick={() => setTab('tables')}
                    >
                        Tables
                    </button>
                </div>

                {tab === 'reservations' ? <ManagerReservations /> : <ManagerTableEditor />}
            </div>
        </div>
    );

}
