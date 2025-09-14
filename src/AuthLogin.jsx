import { useState } from "react";
import axios from "axios";
import { api, setAuth } from "./api";

export default function AuthLogin({ onLoggedIn }) {
    const [username, setU] = useState("");
    const [password, setP] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");

        try {
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                { username, password }
            );

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            setAuth(data.access);

            const me = await api.get("/me/");
            onLoggedIn?.(me.data.role, me.data);
        } catch {
            setErr("Invalid credentials");
        }
    };

    return (
        <form onSubmit={submit} className="toolbar" style={{ maxWidth: 900, marginLeft: 450, marginTop: 30 }}>
            <div className="form-group">
                <label>Username</label>
                <input value={username} onChange={(e) => setU(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setP(e.target.value)} />
            </div>
            <button className="btn add" type="submit">Login</button>
            {err && <span style={{ color: "#ef4444", marginLeft: 50 }}>{err}</span>}
        </form>
    );
}
