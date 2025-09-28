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
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1 className="dashboard-title">Manager Dashboard</h1>
                        <div className="header-right">
                            {me && <span className="welcome-text">Hello, {me.username}</span>}
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-tabs">
                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${tab === 'reservations' ? 'active' : ''}`}
                            onClick={() => setTab('reservations')}
                        >
                            <span></span>
                            Reservations
                        </button>
                        <button
                            className={`tab-btn ${tab === 'tables' ? 'active' : ''}`}
                            onClick={() => setTab('tables')}
                        >
                            <span></span>
                            Tables & Zones
                        </button>
                    </div>
                </div>

                <div className="dashboard-content">
                    {tab === 'reservations' ? (
                        <ManagerReservations />
                    ) : (
                        <ManagerTableEditor onBackToDashboard={() => setTab('reservations')} />
                    )}
                </div>
            </div>

            <style jsx>{`
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 0;
              }

              .dashboard-container {
                min-height: 100vh;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 40px 20px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                width: 100vw;
                margin: 0;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
              }

              .dashboard-inner {
                width: 100%;
                max-width: 900px;
                display: flex;
                flex-direction: column;
                gap: 24px;
                margin: 0 auto;
                position: relative;
              }

              .dashboard-header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                width: 100%;
                box-sizing: border-box;
              }

              .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
                width: 100%;
              }

              .dashboard-title {
                font-size: 2.5rem;
                font-weight: 800;
                color: #1a202c;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                flex: 1;
                min-width: 0;
              }

              .header-right {
                display: flex;
                align-items: center;
                gap: 16px;
                flex-shrink: 0;
                min-width: fit-content;
              }

              .welcome-text {
                font-size: 1.1rem;
                color: #4a5568;
                font-weight: 500;
                white-space: nowrap;
              }

              .logout-btn {
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
                font-size: 1rem;
                min-width: 100px;
                white-space: nowrap;
              }

              .logout-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(238, 90, 82, 0.4);
              }

              .dashboard-tabs {
                display: flex;
                justify-content: center;
                width: 100%;
              }

              .tabs-container {
                display: flex;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .tab-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 16px 32px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: transparent;
                color: #64748b;
              }

              .tab-btn span {
                font-size: 1.2rem;
              }

              .tab-btn:hover {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                transform: translateY(-1px);
              }

              .tab-btn.active {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
              }

              .dashboard-content {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                min-height: 400px;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: flex-start;
              }

              @media (max-width: 768px) {
                .dashboard-container {
                  position: relative;
                  padding: 20px;
                  align-items: flex-start;
                }

                .dashboard-inner {
                  max-width: 100%;
                  width: 100%;
                }

                .dashboard-title {
                  font-size: 2rem;
                }

                .header-content {
                  flex-direction: column;
                  text-align: center;
                  gap: 20px;
                }

                .header-right {
                  flex-direction: row;
                  justify-content: center;
                  width: 100%;
                  gap: 12px;
                  flex-wrap: wrap;
                }

                .welcome-text {
                  order: 1;
                }

                .logout-btn {
                  order: 2;
                }

                .tabs-container {
                  flex-direction: column;
                  width: 100%;
                  max-width: 300px;
                  margin: 0 auto;
                }

                .tab-btn {
                  justify-content: center;
                  width: 100%;
                }

                .dashboard-content {
                  padding: 24px 16px;
                }
              }

              @media (max-width: 480px) {
                .header-content {
                  gap: 16px;
                }

                .header-right {
                  flex-direction: column;
                  gap: 12px;
                }

                .dashboard-title {
                  font-size: 1.75rem;
                }

                .logout-btn {
                  padding: 10px 20px;
                  font-size: 0.9rem;
                }
              }
            `}</style>
        </div>
    );
}