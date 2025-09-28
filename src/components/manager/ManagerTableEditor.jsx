import React, {useEffect, useState, useRef} from 'react';
import Draggable from 'react-draggable';
import {Rnd} from 'react-rnd';
import axios from 'axios';
import './ManagerTableEditor.css';

const ManagerTableEditor = ({ onBackToDashboard }) => {
    const [tables, setTables] = useState([]);
    const [zones, setZones] = useState([]);
    const [newTable, setNewTable] = useState({
        number: '',
        chairs: '',
        status: 'available',
    });
    const [newZoneType, setNewZoneType] = useState('glass');
    const tableRefs = useRef({});

    useEffect(() => {
        axios.get('/api/tables/')
            .then((res) => setTables(res.data))
            .catch((err) => console.error('Failed to load tables', err));

        axios.get('/api/zones/')
            .then((res) => setZones(res.data))
            .catch((err) => console.error('Failed to load zones', err));
    }, []);

    const handleStop = (e, data, id) => {
        axios.patch(`/api/tables/${id}/`, {top: data.y, left: data.x});
    };

    const handleAddTable = () => {
        const number = parseInt(newTable.number, 10);
        const chairs = parseInt(newTable.chairs, 10);
        if (!Number.isFinite(number) || !Number.isFinite(chairs)) {
            alert('Please enter valid numbers');
            return;
        }
        axios.post('/api/tables/', {
            number, chairs, status: newTable.status, top: 0, left: 0,
        }).then((res) => {
            setTables((prev) => [...prev, res.data]);
            setNewTable({number: '', chairs: '', status: 'available'});
        });
    };

    const handleDeleteTable = async (id) => {
        if (!confirm('Delete this table?')) return;
        await axios.delete(`/api/tables/${id}/`);
        setTables((prev) => prev.filter((t) => t.id !== id));
    };

    const handleAddZone = () => {
        const zone = {type: newZoneType, top: 50, left: 50, width: 200, height: 100};
        axios.post('/api/zones/', zone).then((res) => {
            setZones((prev) => [...prev, res.data]);
        });
    };

    const handleUpdateZone = (id, updates) => {
        setZones((prev) => prev.map((z) => z.id === id ? {...z, ...updates} : z));
        axios.patch(`/api/zones/${id}/`, updates);
    };

    const handleDeleteZone = async (id) => {
        if (!confirm('Delete this zone?')) return;
        await axios.delete(`/api/zones/${id}/`);
        setZones((prev) => prev.filter((z) => z.id !== id));
    };

    return (
        <div className="wrapper">
            <div className="center-container">
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button
                        onClick={onBackToDashboard}
                        style={{
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <h1 className="titleFloor" style={{ textAlign: "center", margin: "0 auto 20px auto" }}>Manager Table & Zones View</h1>

                <div className="toolbarRow" style={{ justifyContent: "center", display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
                    <div className="toolbarFloor">
                        <div className="form-group">
                            <label>Table Number</label>
                            <input
                                type="number"
                                value={newTable.number}
                                onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Chairs</label>
                            <input
                                type="number"
                                value={newTable.chairs}
                                onChange={(e) => setNewTable({...newTable, chairs: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={newTable.status}
                                onChange={(e) => setNewTable({...newTable, status: e.target.value})}
                            >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="occupied">Occupied</option>
                            </select>
                        </div>
                        <button onClick={handleAddTable} className="btn add">Add Table</button>
                    </div>

                    <div className="toolbarFloor">
                        <div className="form-group">
                            <label>Zone Type</label>
                            <select value={newZoneType} onChange={(e) => setNewZoneType(e.target.value)}>
                                <option value="glass">Glass</option>
                                <option value="terrace">Terrace</option>
                                <option value="green">Green Area</option>
                            </select>
                        </div>
                        <button onClick={handleAddZone} className="btn add">Add Zone</button>
                    </div>
                </div>

                <div className="floor" style={{width: '800px', margin: '0 auto'}}>
                    <div className="room">

                        {zones.map((zone) => (
                            <Rnd key={zone.id}
                                 default={{x: zone.left, y: zone.top, width: zone.width, height: zone.height}}
                                 onDragStop={(e, d) => handleUpdateZone(zone.id, {left: d.x, top: d.y})}
                                 onResizeStop={(e, dir, ref, delta, pos) =>
                                     handleUpdateZone(zone.id, {
                                         width: ref.offsetWidth,
                                         height: ref.offsetHeight,
                                         left: pos.x,
                                         top: pos.y
                                     })
                                 }
                                 style={{
                                     background: zone.type === 'glass'
                                         ? 'rgba(59,130,246,0.3)'
                                         : zone.type === 'terrace'
                                             ? 'rgba(180,120,86,0.3)'
                                             : 'rgba(34,197,94,0.3)',
                                     border: '2px solid #111',
                                     borderRadius: 6,
                                     zIndex: 0,
                                     position: 'absolute'
                                 }}>
                                <button className="btn-del"
                                        onClick={() => handleDeleteZone(zone.id)}>×
                                </button>
                            </Rnd>
                        ))}

                        {tables.map((table) => {
                            if (!tableRefs.current[table.id]) {
                                tableRefs.current[table.id] = React.createRef();
                            }
                            const shape = Number(table.chairs) >= 7
                                ? 'round'
                                : Number(table.chairs) <= 4 ? 'square' : 'rect';

                            return (
                                <Draggable key={table.id}
                                           defaultPosition={{x: table.left ?? 0, y: table.top ?? 0}}
                                           onStop={(e, data) => handleStop(e, data, table.id)}
                                           nodeRef={tableRefs.current[table.id]}
                                           bounds=".room"
                                           cancel=".btn-del">
                                    <div ref={tableRefs.current[table.id]}
                                         className={`table-node ${shape} status-${table.status}`}>
                                        <button className="btn-del"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTable(table.id);
                                                }}>
                                            ×
                                        </button>
                                        <div className="label">
                                            <div>Table {table.number}</div>
                                            <div className="sub">{table.chairs} chairs</div>
                                        </div>
                                    </div>
                                </Draggable>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerTableEditor;