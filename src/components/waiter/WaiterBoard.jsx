import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api.js";
import "./WaiterBoard.css";

export default function WaiterBoard() {
    const [tables, setTables] = useState([]);
    const [zones, setZones] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedTable, setSelectedTable] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [creating, setCreating] = useState(false);

    const [roomSize, setRoomSize] = useState({ w: 850, h: 600 });
    const [scale, setScale] = useState(0.72);
    const [shift, setShift] = useState({ x: 0, y: 0 });
    const floorRef = useRef(null);

    const [query, setQuery] = useState("");
    const norm = (s) => (s ?? "").toString().trim().toLowerCase();
    const itemMatches = (m, q) => norm(m.code).includes(norm(q));

    const shapeOf = (chairs) =>
        Number(chairs) >= 7 ? "round" : Number(chairs) <= 4 ? "square" : "rect";

    useEffect(() => {
        load();
        const id = setInterval(load, 10000);
        return () => clearInterval(id);
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [{ data: t }, { data: m }, { data: z }] = await Promise.all([
                api.get("/tables/status/"),
                api.get("/menu-items/"),
                api.get("/zones/"),
            ]);

            const map = new Map();
            t.forEach((x) => {
                if (!map.has(x.id)) map.set(x.id, x);
            });
            const ts = [...map.values()].sort((a, b) => a.number - b.number);

            setTables(ts);
            setMenu(m);
            setZones(z);
            setRoomSize({ w: 750, h: 450 });
            setShift({ x: 0, y: 0 });
        } finally {
            setLoading(false);
        }
    };

    const openTable = async (t) => {
        setSelectedTable(t);
        if (t.active_order) {
            const { data } = await api.get(`/orders/${t.active_order.order_id}/`);
            setActiveOrder(data);
            setCreating(false);
        } else {
            setActiveOrder(null);
            setCreating(true);
        }
    };

    const closePanel = () => {
        setSelectedTable(null);
        setActiveOrder(null);
        setCreating(false);
    };

    const startOrder = async () => {
        if (!selectedTable) return;
        try {
            const { data } = await api.post("/orders/", {
                table: selectedTable.id,
                items: [],
            });
            const res = await api.get(`/orders/${data.id}/`);
            setActiveOrder(res.data);
            setCreating(false);
            load();
        } catch (e) {
            alert(e?.response?.data?.detail || "Error creating order.");
        }
    };

    const addItem = async (menu_item_id, qty = 1) => {
        if (!activeOrder) return;
        const { data } = await api.post(`/orders/${activeOrder.id}/add_item/`, {
            menu_item: menu_item_id,
            quantity: qty,
        });
        setActiveOrder(data);
        load();
    };

    const setQty = async (order_item_id, qty) => {
        if (!activeOrder) return;
        const { data } = await api.post(`/orders/${activeOrder.id}/set_item_qty/`, {
            order_item_id,
            quantity: qty,
        });
        setActiveOrder(data);
        load();
    };

    const removeItem = async (order_item_id) => {
        if (!activeOrder) return;
        const { data } = await api.post(`/orders/${activeOrder.id}/remove_item/`, {
            order_item_id,
        });
        setActiveOrder(data);
        await load();
    };

    const pay = async () => {
        if (!activeOrder) return;
        await api.post(`/orders/${activeOrder.id}/pay/`);
        closePanel();
        load();
    };

    const filteredMenu = useMemo(() => {
        if (!query.trim()) return menu;
        return menu.filter((m) => itemMatches(m, query));
    }, [menu, query]);

    const statusColor = (s) =>
        s === "available"
            ? "status-available"
            : s === "reserved"
                ? "status-reserved"
                : "status-occupied";

    const seatGuests = async (tableId) => {
        await api.post(`/tables/${tableId}/seat/`);
        await load();

        if (selectedTable?.id === tableId) {
            setSelectedTable((prev) => ({ ...prev, status: "occupied" }));
        }
    };

    const tryQuickAddByCode = async () => {
        if (!activeOrder || !query.trim()) return;
        const exact = menu.find((m) => norm(m.code) === norm(query));
        if (exact) {
            await addItem(exact.id, 1);
            setQuery("");
        }
    };

    return (
        <div className="client-layout">
            <div className="client-left">
                <div className="floor" ref={floorRef} style={{ width: "600px", height: "360px" }}>
                    <div className="room-wrap" style={{ transform: `scale(${scale})` }}>
                        <div
                            className="room"
                            style={{ width: `${roomSize.w}px`, height: `${roomSize.h}px` }}
                        >
                            <div className="layout-decor">
                                {zones.map((zone) => (
                                    <div
                                        key={zone.id}
                                        className="rnd"
                                        style={{
                                            position: "absolute",
                                            top: zone.top,
                                            left: zone.left,
                                            width: zone.width,
                                            height: zone.height,
                                            background:
                                                zone.type === "glass"
                                                    ? "rgba(59,130,246,0.3)"
                                                    : zone.type === "terrace"
                                                        ? "rgba(180,120,86,0.3)"
                                                        : "rgba(34,197,94,0.3)",
                                            border: "2px solid #111",
                                            borderRadius: 6,
                                            pointerEvents: "none",
                                            zIndex: 0,
                                        }}
                                    />
                                ))}
                            </div>

                            {tables.map((t) => {
                                const shape = shapeOf(t.chairs);
                                const L = (Number(t.left) || 0) - shift.x;
                                const T = (Number(t.top) || 0) - shift.y;
                                return (
                                    <div
                                        key={t.id}
                                        className={`table-node ${shape} ${statusColor(t.status)}`}
                                        style={{ transform: `translate(${L}px, ${T}px)` }}
                                        onClick={() => openTable(t)}
                                        title={`Table ${t.number} • ${t.chairs} chairs`}
                                    >
                                        <div className="label">
                                            <div>Table {t.number}</div>
                                            <div className="sub">
                                                {t.status}
                                                {t.active_order
                                                    ? ` • items: ${t.active_order.items_count} • total: ${t.active_order.total} ден`
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="client-right">
                {!selectedTable ? (
                    <div className="card row empty">Select a table to manage order</div>
                ) : (
                    <>
                        <div className="card">
                            <div className="panel-row">
                                <div>
                                    <div className="title-strong">
                                        Table {selectedTable.number} • {selectedTable.chairs} chairs
                                    </div>
                                    <div className="text-muted">Status: {selectedTable.status}</div>
                                </div>
                                <button className="btn btn-grey" onClick={closePanel}>
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="scroll-area">
                            {creating && (
                                <div className="card">
                                    <div className="panel-row">
                                        <div>There is no active order for this table.</div>
                                        {selectedTable.status === "reserved" ? (
                                            <div className="row" style={{ gap: 8 }}>
                                                <span className="title-strong" style={{ color: "#ef4444" }}>
                                                    Reserved
                                                </span>
                                                <button
                                                    className="btn btn-save"
                                                    onClick={() => seatGuests(selectedTable.id)}
                                                >
                                                    Seat guests
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="btn btn-add" onClick={startOrder}>
                                                Start order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeOrder && (
                                <div className="card">
                                    <div className="section-title">Active order #{activeOrder.id}</div>

                                    {activeOrder.orderitem_set.length === 0 ? (
                                        <div className="empty">No items.</div>
                                    ) : (
                                        <div className="scrolly-250">
                                            {activeOrder.orderitem_set.map((oi) => (
                                                <div key={oi.id} className="order-item">
                                                    <div>
                                                        <div className="title-strong">
                                                            {oi.menu_item_detail?.name} — {oi.menu_item_detail?.price} ден
                                                        </div>
                                                        <div className="text-muted">
                                                            {oi.menu_item_detail?.item_type}
                                                        </div>
                                                    </div>

                                                    <div className="actions">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() =>
                                                                setQty(oi.id, Math.max(1, oi.quantity - 1))
                                                            }
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty">{oi.quantity}</span>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => setQty(oi.id, oi.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => removeItem(oi.id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="row">
                                                <div className="title-strong">Total</div>
                                                <div className="title-strong">{activeOrder.total} denars</div>
                                            </div>

                                            <div className="row" style={{ justifyContent: "flex-end" }}>
                                                <button className="btn btn-save" onClick={pay}>
                                                    Mark as paid
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="card">
                                <div className="panel-row">
                                    <div className="title-strong">Menu</div>

                                    <div className="row" style={{ gap: 6 }}>
                                        <input
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") tryQuickAddByCode();
                                            }}
                                            placeholder="Enter code"
                                            className="input-base"
                                        />
                                        <button className="btn btn-add" onClick={tryQuickAddByCode}>
                                            Add by code
                                        </button>
                                    </div>
                                </div>

                                <div className="scrolly-200">
                                    {filteredMenu.map((m) => (
                                        <div key={m.id} className="row">
                                            <div>
                                                <div className="title-strong">{m.name}</div>
                                                <div className="text-muted">
                                                    code: {m.code} • {m.item_type} • {m.price} denars
                                                </div>
                                            </div>
                                            <button className="btn btn-add" onClick={() => addItem(m.id, 1)}>
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                    {filteredMenu.length === 0 && (
                                        <div className="empty">No items match that code.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
