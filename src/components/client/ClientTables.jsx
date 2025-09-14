import { useEffect, useState } from 'react';
import { api, setAuth } from '../../api.js'; // ⬅️ додај setAuth
import ClientFloor from './ClientFloor.jsx';
import "../manager/ManagerTableEditor.css";
import "./Client.css";

export default function ClientTables({ onLogout }) { // ⬅️ опционален проп
    const [tables, setTables] = useState([]);
    const [openFor, setOpenFor] = useState(null);
    const [when, setWhen] = useState('');
    const [desc, setDesc] = useState('');

    const handleLogout = () => {                 // ⬅️ LOGOUT ЛОГИКА
        setAuth(null);                             // чисти Authorization + access
        localStorage.removeItem('refresh');        // чисти refresh
        if (onLogout) onLogout();                  // јави му на App.jsx (ако праќаш проп)
        else location.reload();                    // иначе едноставно рефреш
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
        <div className="client-container">
            <div className="titleClientFull" style={{ display:'flex', alignItems:'center' }}>
                <h2 className="client-title" style={{ margin: 0 }}>Reservations – table selection</h2>
                <button className="btnClient" onClick={handleLogout}>Logout</button>
            </div>

            <div className="toolbar client-toolbar">
                <div style={{ fontWeight: 800 }}>Tables</div>
                <button className="btn save" onClick={load}>Refresh</button>
            </div>

            <div className="client-layout">
                <div className="client-left">
                    <ClientFloor tables={safeTables} onSelectTable={(t) => setOpenFor(t.id)} />
                </div>

                <div className="client-right">
                    <div style={{ display: 'grid', gap: 12 }}>
                        {availableOnly.length === 0 && (
                            <div className="toolbar client-card" style={{ justifyContent:'center', color:'#6b7280' }}>
                                Right now there are no available tables.
                            </div>
                        )}

                        {availableOnly.map(t => (
                            <div key={t.id} className="toolbar client-card">
                                <div>
                                    <div style={{ fontWeight: 800 }}>Table {t.number} • {t.chairs} chairs</div>
                                    <div style={{ color: '#6b7280' }}>Status: available</div>
                                </div>

                                {openFor === t.id ? (
                                    <div style={{ display:'flex', gap:8, alignItems:'end', flexWrap:'wrap' }}>
                                        <div className="form-group">
                                            <label>Date and time</label>
                                            <input type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Reason for reservation</label>
                                            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="birthday, celebration..." />
                                        </div>
                                        <button className="btn save" onClick={() => reserve(t.id)}>Confirm</button>
                                        <button className="btn" style={{ backgroundColor: 'black', color: 'white' }}
                                                onClick={() => { setOpenFor(null); setWhen(''); setDesc(''); }}>
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button className="btn add" onClick={() => setOpenFor(t.id)}>Reserve</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
