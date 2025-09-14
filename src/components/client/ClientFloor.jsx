import React, { useEffect, useRef, useState } from "react";
import "./Client.css";

export default function ClientFloor({ tables = [], onSelectTable }) {
    const floorRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [roomSize, setRoomSize] = useState({ w: 1000, h: 543 });
    const [shift] = useState({ x: 0, y: 0 }); // ако не користиш pan, остави 0

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
                        <div className="balcony-zone" />
                        <div className="glass glass-top" />
                        <div className="glass glass-bottom" />
                        <div className="rim" />
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
