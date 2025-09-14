import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import axios from 'axios';
import './ManagerTableEditor.css';

const ManagerTableEditor = () => {
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState({
        number: '',
        chairs: '',
        status: 'available',
    });
    const tableRefs = useRef({});

    useEffect(() => {
        axios
            .get('/api/tables/')
            .then((res) => setTables(res.data))
            .catch((err) => console.error('Failed to load tables', err));
    }, []);

    // avtomstski sejv
    const handleStop = (e, data, id) => {
        axios
            .patch(`/api/tables/${id}/`, { top: data.y, left: data.x })
            .then(() => console.log('Position updated!'))
            .catch((err) => console.error('Failed to update position', err));
    };

    const handleAddTable = () => {
        const number = parseInt(newTable.number, 10);
        const chairs = parseInt(newTable.chairs, 10);
        if (!Number.isFinite(number) || !Number.isFinite(chairs)) {
            alert('Please enter valid numbers for the number of tables and chairs.');
            return;
        }

        axios
            .post('/api/tables/', {
                number,
                chairs,
                status: newTable.status,
                top: 0,
                left: 0,
            })
            .then((res) => {
                setTables((prev) => [...prev, res.data]);
                setNewTable({ number: '', chairs: '', status: 'available' });
            })
            .catch((err) => console.error('Failed to add table', err));
    };

    const handleDeleteTable = async (id) => {
        if (!confirm('Delete this table?')) return;
        try {
            await axios.delete(`/api/tables/${id}/`);
            setTables((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error('Failed to delete table', err);
            alert(err.response?.data?.detail || 'Cannot delete this table.');
        }
    };

    return (
        <div className="wrapper">
            <div className="center-container">
                <h1 className="titleFloor">Manager Table View</h1>
                <div className="toolbarFloor">
                    <div className="form-group">
                        <label>Table Number</label>
                        <input
                            type="number"
                            value={newTable.number}
                            onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Chairs</label>
                        <input
                            type="number"
                            value={newTable.chairs}
                            onChange={(e) => setNewTable({ ...newTable, chairs: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={newTable.status}
                            onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                        >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="occupied">Occupied</option>
                        </select>
                    </div>

                    <button onClick={handleAddTable} className="btn add">Add Table</button>
                </div>

                <div className="floor">
                    <div className="room">
                        <div className="layout-decor">
                            <div className="balcony-zone" />
                            <div className="glass glass-top" />
                            <div className="glass glass-bottom" />
                            <div className="rim" />
                        </div>

                        {tables.map((table) => {
                            if (!tableRefs.current[table.id]) {
                                tableRefs.current[table.id] = React.createRef();
                            }

                            const shape =
                                Number(table.chairs) >= 7
                                    ? 'round'
                                    : Number(table.chairs) <= 4
                                        ? 'square'
                                        : 'rect';

                            return (
                                <Draggable
                                    key={table.id}
                                    defaultPosition={{ x: table.left ?? 0, y: table.top ?? 0 }}
                                    onStop={(e, data) => handleStop(e, data, table.id)}
                                    nodeRef={tableRefs.current[table.id]}
                                    bounds=".room"
                                    cancel=".btn-del"
                                >
                                    <div
                                        ref={tableRefs.current[table.id]}
                                        className={`table-node ${shape} status-${table.status}`}
                                    >
                                        <button
                                            className="btn-del"
                                            title="Delete table"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTable(table.id);
                                            }}
                                        >
                                            ×
                                        </button>

                                        <span className="chair top" />
                                        <span className="chair right" />
                                        <span className="chair bottom" />
                                        <span className="chair left" />

                                        <div className="plates" />

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
