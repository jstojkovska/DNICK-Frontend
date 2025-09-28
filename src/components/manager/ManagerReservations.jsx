import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function ManagerReservations() {
    const [items, setItems] = useState([]);
    const [loading, setL] = useState(false);

    const load = async () => {
        setL(true);
        try {
            const { data } = await api.get('/reservations/?status=pending');
            setItems(data);
        } finally {
            setL(false);
        }
    };

    const approve = async (id) => {
        await api.post(`/reservations/${id}/approve/`);
        load();
    };
    const reject = async (id) => {
        await api.post(`/reservations/${id}/reject/`);
        load();
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="section section-narrow">
            <div className="toolbar" style={{ justifyContent: 'space-between', marginLeft:300}}>
                <div style={{ fontWeight: 800 }}>Pending reservations</div>
                <button className="btn save" onClick={load}>
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {items.length === 0 ? (
                <p className="empty">No pending reservations</p>
            ) : (
                <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                    {items.map((r) => (
                        <div key={r.id} className="resv-row">
                            <div>
                                <div style={{ fontWeight: 800 }}>Reservation #{r.id}</div>
                                <div>
                                    Table {r.table} • {new Date(r.datetime).toLocaleString()}
                                </div>
                                <div style={{ color: '#6b7280' }}>username: {r.user_username}</div>
                                <div style={{ color: '#6b7280' }}>description: {r.description}</div>
                            </div>

                            <div className="actions">
                                <button className="btn save" onClick={() => approve(r.id)}>
                                    Approve
                                </button>
                                <button
                                    className="btn add"
                                    onClick={() => reject(r.id)}
                                    style={{ background: '#ef4444' }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
