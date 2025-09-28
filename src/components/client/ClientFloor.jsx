import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api.js";
import "./Client.css";

export default function ClientFloor({ tables = [], onSelectTable }) {
    const floorRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [roomSize, setRoomSize] = useState({ w: 730, h: 450 });
    const [shift] = useState({ x: 0, y: 0 });
    const [zones, setZones] = useState([]);

    useEffect(() => {
        api.get("/zones/").then(({ data }) => setZones(data));
    }, []);

    const shapeOf = (chairs) =>
        Number(chairs) >= 7 ? "round" : Number(chairs) <= 4 ? "square" : "rect";

    const statusColor = (s) =>
        s === "available"
            ? "status-available"
            : s === "reserved"
                ? "status-reserved"
                : "status-occupied";

    const fitScale = () => {
        const el = floorRef.current;
        if (!el) return;
        const availW = el.clientWidth - 24;
        const availH = el.clientHeight - 24;
        const s = Math.min(availW / roomSize.w, availH / roomSize.h, 1);
        setScale(Math.max(0.72, Math.min(1, s)));
    };

    useEffect(() => {
        fitScale();
        const onResize = () => fitScale();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [roomSize]);

    return (
        <div className="floor" ref={floorRef}>
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
                                onClick={() => onSelectTable?.(t)}
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
    );
}
