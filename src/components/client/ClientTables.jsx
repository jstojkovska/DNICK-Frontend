import { useEffect, useState } from 'react';
import { api, setAuth } from '../../api.js';
import ClientFloor from './ClientFloor.jsx';

export default function ClientTables({ onLogout }) {
    const [tables, setTables] = useState([]);
    const [openFor, setOpenFor] = useState(null);
    const [when, setWhen] = useState('');
    const [desc, setDesc] = useState('');

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        if (onLogout) onLogout();
        else location.reload();
    };

    const load = async () => {
        const { data } = await api.get('/tables/');
        setTables(data);
    };

    const reserve = async (tableId) => {
        if (!when) return alert('Choose date and time.');
        const iso = new Date(when).toISOString();
        await api.post('/reservations/', { table: tableId, datetime: iso, description: desc || '' });
        alert('The request is sent (pending).');
        setOpenFor(null);
        setWhen('');
        setDesc('');
        load();
    };

    useEffect(() => {
        load();
        const id = setInterval(load, 15000);
        return () => clearInterval(id);
    }, []);

    const uniqById = (arr) => {
        const m = new Map();
        for (const x of arr) if (!m.has(x.id)) m.set(x.id, x);
        return [...m.values()];
    };
    const safeTables = uniqById(tables).sort((a, b) => a.number - b.number);
    const availableOnly = safeTables.filter(t => t.status === 'available');

    return (
        <div className="client-dashboard-container">
            <div className="client-dashboard-inner">
                <div className="client-header">
                    <div className="header-content">
                        <h1 className="client-title">Restaurant Table Reservations</h1>
                        <div className="header-right">
                            <span className="welcome-text">Select your table</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="tables-section-header">
                    <h2 className="section-title">Available Tables</h2>
                    <div className="header-actions">
                        <button className="refresh-btn" onClick={load}>
                            <span></span>
                            Refresh
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="client-main-content">
                    <div className="floor-section">
                        <div className="floor-container">
                            <h3 className="floor-title">Restaurant Floor Plan</h3>
                            <p className="floor-subtitle">Click on any available table to make a reservation</p>
                            <div className="floor-wrapper">
                                <ClientFloor tables={safeTables} onSelectTable={(t) => setOpenFor(t.id)} />
                            </div>
                        </div>
                    </div>

                    <div className="tables-list-section">
                        <div className="tables-list-container">
                            {availableOnly.length === 0 ? (
                                <div className="empty-tables-state">
                                    <div className="empty-icon"></div>
                                    <h3>No Available Tables</h3>
                                    <p>All tables are currently occupied or reserved. Please check back later.</p>
                                </div>
                            ) : (
                                <div className="tables-grid">
                                    {availableOnly.map(t => (
                                        <div key={t.id} className="table-card">
                                            <div className="table-card-header">
                                                <div className="table-info">
                                                    <h4 className="table-number">Table {t.number}</h4>
                                                    <div className="table-details">
                                                        <span className="chairs-count">{t.chairs} chairs</span>
                                                        <span className="status-badge available">Available</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="table-card-body">
                                                {openFor === t.id ? (
                                                    <div className="reservation-form">
                                                        <div className="form-group">
                                                            <label>Date and Time</label>
                                                            <input
                                                                type="datetime-local"
                                                                value={when}
                                                                onChange={e => setWhen(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Occasion (Optional)</label>
                                                            <input
                                                                value={desc}
                                                                onChange={e => setDesc(e.target.value)}
                                                                placeholder="Birthday, anniversary, business meeting..."
                                                            />
                                                        </div>
                                                        <div className="form-actions">
                                                            <button className="confirm-btn" onClick={() => reserve(t.id)}>
                                                                <span>✓</span>
                                                                Confirm Reservation
                                                            </button>
                                                            <button
                                                                className="cancel-btn"
                                                                onClick={() => { setOpenFor(null); setWhen(''); setDesc(''); }}
                                                            >
                                                                <span>✕</span>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button className="reserve-btn" onClick={() => setOpenFor(t.id)}>
                                                        <span>📅</span>
                                                        Reserve Table
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
              .client-dashboard-container {
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

              .client-dashboard-inner {
                width: 100%;
                max-width: 1200px;
                display: flex;
                flex-direction: column;
                gap: 24px;
              }

              .client-header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
              }

              .client-title {
                font-size: 2.5rem;
                font-weight: 800;
                color: #1a202c;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
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
                flex-shrink: 0;
              }

              .logout-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(238, 90, 82, 0.4);
              }

              .tables-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 20px 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .section-title {
                font-size: 1.875rem;
                font-weight: 700;
                color: #1a202c;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 12px;
              }

              .section-title::before {
                content: '🪑';
                font-size: 2rem;
              }

              .refresh-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
              }

              .refresh-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
              }

              .header-actions {
                display: flex;
                align-items: center;
                gap: 12px;
              }

              .client-main-content {
                display: grid;
                grid-template-columns: 1fr 400px;
                gap: 24px;
                align-items: start;
              }

              .floor-section {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 32px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .floor-container {
                text-align: center;
              }

              .floor-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a202c;
                margin: 0 0 8px 0;
              }

              .floor-subtitle {
                color: #64748b;
                margin: 0 0 24px 0;
                font-size: 1rem;
              }

              .floor-wrapper {
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
              }

              .tables-list-section {
                display: flex;
                flex-direction: column;
                gap: 16px;
              }

              .tables-list-container {
                max-height: 600px;
                overflow-y: auto;
                padding-right: 8px;
              }

              .empty-tables-state {
                text-align: center;
                padding: 60px 40px;
                color: #64748b;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .empty-icon {
                font-size: 4rem;
                margin-bottom: 16px;
              }

              .empty-tables-state h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0 0 8px 0;
                color: #374151;
              }

              .empty-tables-state p {
                font-size: 1rem;
                margin: 0;
              }

              .tables-grid {
                display: flex;
                flex-direction: column;
                gap: 16px;
              }

              .table-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                transition: all 0.3s ease;
              }

              .table-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
              }

              .table-card-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
              }

              .table-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }

              .table-number {
                font-size: 1.25rem;
                font-weight: 700;
                margin: 0;
              }

              .table-details {
                display: flex;
                align-items: center;
                gap: 12px;
              }

              .chairs-count {
                font-size: 0.875rem;
                opacity: 0.9;
              }

              .status-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }

              .status-badge.available {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
              }

              .table-card-body {
                padding: 20px;
              }

              .reservation-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
              }

              .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
              }

              .form-group label {
                font-size: 0.875rem;
                font-weight: 500;
                color: #374151;
              }

              .form-group input {
                padding: 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background: white;
                font-size: 0.875rem;
                transition: border-color 0.2s;
              }

              .form-group input:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
              }

              .form-actions {
                display: flex;
                gap: 12px;
                flex-direction: column;
              }

              .confirm-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.875rem;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
              }

              .confirm-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
              }

              .cancel-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: linear-gradient(135deg, #6b7280, #4b5563);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.875rem;
                box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
              }

              .cancel-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
              }

              .reserve-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.875rem;
                width: 100%;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
              }

              .reserve-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
              }

              @media (max-width: 1024px) {
                .client-main-content {
                  grid-template-columns: 1fr;
                  gap: 24px;
                }

                .tables-list-container {
                  max-height: none;
                }

                .form-actions {
                  flex-direction: row;
                }
              }

              @media (max-width: 768px) {
                .client-dashboard-container {
                  padding: 20px 16px;
                }

                .client-title {
                  font-size: 2rem;
                }

                .header-content {
                  flex-direction: column;
                  text-align: center;
                  gap: 20px;
                }

                .header-right {
                  flex-direction: column;
                  width: 100%;
                  gap: 12px;
                }

                .tables-section-header {
                  flex-direction: column;
                  text-align: center;
                  gap: 16px;
                }

                .form-actions {
                  flex-direction: column;
                }
              }
            `}</style>
        </div>
    );
}