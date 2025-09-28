import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function ManagerReservations() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/reservations/?status=pending');
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    const approve = async (id) => {
        try {
            await api.post(`/reservations/${id}/approve/`);
            load();
        } catch (error) {
            console.error('Failed to approve reservation:', error);
        }
    };

    const reject = async (id) => {
        try {
            await api.post(`/reservations/${id}/reject/`);
            load();
        } catch (error) {
            console.error('Failed to reject reservation:', error);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="reservations-container">
            <div className="reservations-header">
                <h2 className="section-title">Pending Reservations</h2>
                <button
                    className="refresh-btn"
                    onClick={load}
                    disabled={loading}
                >
                    <span className="refresh-icon"></span>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="reservations-content">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"></div>
                        <h3>No Pending Reservations</h3>
                        <p>All caught up! No reservations waiting for approval.</p>
                    </div>
                ) : (
                    <div className="reservations-grid">
                        {items.map((reservation) => (
                            <div key={reservation.id} className="reservation-card">
                                <div className="card-header">
                                    <div className="reservation-number">
                                        Reservation #{reservation.id}
                                    </div>
                                    <div className="reservation-status">
                                        <span className="status-badge pending">Pending</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="reservation-details">
                                        <div className="detail-row">
                                            <span className="detail-icon"></span>
                                            <span className="detail-text">Table {reservation.table}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="detail-icon"></span>
                                            <span className="detail-text">
                                                {new Date(reservation.datetime).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="detail-icon"></span>
                                            <span className="detail-text">{reservation.user_username}</span>
                                        </div>

                                        {reservation.description && (
                                            <div className="detail-row">
                                                <span className="detail-icon"></span>
                                                <span className="detail-text description">
                                                    {reservation.description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button
                                        className="action-btn approve-btn"
                                        onClick={() => approve(reservation.id)}
                                    >
                                        <span></span>
                                        Approve
                                    </button>
                                    <button
                                        className="action-btn reject-btn"
                                        onClick={() => reject(reservation.id)}
                                    >
                                        <span></span>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
              .reservations-container {
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
              }

              .reservations-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 32px;
                flex-wrap: wrap;
                gap: 16px;
                width: 100%;
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
                content: '📋';
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

              .refresh-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
              }

              .refresh-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
              }

              .refresh-icon {
                animation: ${loading ? 'spin 1s linear infinite' : 'none'};
              }

              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }

              .reservations-content {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;
              }

              .empty-state {
                text-align: center;
                padding: 60px 40px;
                color: #64748b;
                width: 100%;
                max-width: 500px;
                margin: 0 auto;
              }

              .empty-icon {
                font-size: 4rem;
                margin-bottom: 16px;
              }

              .empty-state h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0 0 8px 0;
                color: #374151;
              }

              .empty-state p {
                font-size: 1rem;
                margin: 0;
              }

              .reservations-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                gap: 24px;
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                justify-content: center;
              }

              .reservation-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                transition: all 0.3s ease;
                width: 100%;
                max-width: 500px;
                margin: 0 auto;
              }

              .reservation-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
              }

              .card-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .reservation-number {
                font-weight: 700;
                font-size: 1.1rem;
              }

              .status-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }

              .status-badge.pending {
                background: rgba(251, 191, 36, 0.2);
                color: #f59e0b;
                border: 1px solid rgba(251, 191, 36, 0.3);
              }

              .card-body {
                padding: 20px;
              }

              .reservation-details {
                display: flex;
                flex-direction: column;
                gap: 12px;
              }

              .detail-row {
                display: flex;
                align-items: flex-start;
                gap: 12px;
              }

              .detail-icon {
                font-size: 1.1rem;
                min-width: 20px;
              }

              .detail-text {
                color: #374151;
                font-weight: 500;
              }

              .detail-text.description {
                font-style: italic;
                color: #6b7280;
                line-height: 1.5;
              }

              .card-actions {
                padding: 16px 20px;
                background: rgba(249, 250, 251, 0.8);
                display: flex;
                gap: 12px;
                justify-content: flex-end;
              }

              .action-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.875rem;
              }

              .approve-btn {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
              }

              .approve-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
              }

              .reject-btn {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
              }

              .reject-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
              }

              @media (max-width: 768px) {
                .reservations-grid {
                  grid-template-columns: 1fr;
                  max-width: 100%;
                }

                .reservations-header {
                  flex-direction: column;
                  text-align: center;
                }

                .card-actions {
                  flex-direction: column;
                }

                .action-btn {
                  justify-content: center;
                }

                .reservation-card {
                  max-width: 100%;
                }
              }

              @media (max-width: 480px) {
                .reservations-grid {
                  grid-template-columns: 1fr;
                }

                .section-title {
                  font-size: 1.5rem;
                }

                .empty-state {
                  padding: 40px 20px;
                }
              }
            `}</style>
        </div>
    );
}