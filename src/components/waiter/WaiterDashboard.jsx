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
            <div style={{margin: '150px 0 40px'}}>
                <div className="center-container" style={{maxWidth: 1100, margin: '0 auto', padding: '0 24px'}}>
                    <div className="titleWaiter"
                         style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Waiter dashboard</span>
                        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                            {me && <span style={{fontSize: 14, opacity: .8}}>Hello, {me.username}</span>}
                            <button className="btnLogout" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <WaiterBoard/>
                </div>
            </div>
        </div>
    );
}
