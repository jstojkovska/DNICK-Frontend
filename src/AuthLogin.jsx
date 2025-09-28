import { useState } from "react";
import axios from "axios";
import { api, setAuth } from "./api";

export default function AuthLogin({ onLoggedIn, onSwitchToRegister }) {
    const [username, setU] = useState("");
    const [password, setP] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                { username, password }
            );

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            setAuth(data.access);

            const me = await api.get("/me/");
            onLoggedIn?.(me.data);
        } catch {
            setErr("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#1a202c',
                        marginBottom: '8px',
                        letterSpacing: '-0.025em'
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{
                        color: '#718096',
                        fontSize: '16px',
                        margin: 0
                    }}>
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                        }}>
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setU(e.target.value)}
                            placeholder="Enter your username"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: '#f8fafc',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.backgroundColor = 'white';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setP(e.target.value)}
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: '#f8fafc',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.backgroundColor = 'white';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? '#9ca3af' : '#6366f1',
                            color: 'white',
                            padding: '14px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '20px',
                            transform: loading ? 'none' : 'translateY(0)',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#4f46e5';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#6366f1';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {err && (
                        <div style={{
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '14px',
                            marginBottom: '20px'
                        }}>
                            {err}
                        </div>
                    )}

                    <div style={{
                        textAlign: 'center',
                        paddingTop: '20px',
                        borderTop: '1px solid #e2e8f0'
                    }}>
                        <span style={{
                            color: '#718096',
                            fontSize: '14px'
                        }}>
                            Don't have an account?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#6366f1',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                padding: '4px 0'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}