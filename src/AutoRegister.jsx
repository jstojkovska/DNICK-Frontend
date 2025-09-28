import { useState } from "react";
import axios from "axios";
import { api, setAuth } from "./api";

export default function AuthRegister({ onLoggedIn, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
        role: "client"
    });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        if (!formData.username || !formData.email || !formData.password1 || !formData.password2) {
            setErr("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (formData.password1 !== formData.password2) {
            setErr("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password1.length < 8) {
            setErr("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        if (/^\d+$/.test(formData.password1)) {
            setErr("Password cannot be entirely numeric");
            setLoading(false);
            return;
        }

        const commonPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'password123'];
        if (commonPasswords.includes(formData.password1.toLowerCase())) {
            setErr("Please choose a less common password");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username: formData.username,
                email: formData.email,
                password1: formData.password1,
                password2: formData.password2,
                role: formData.role
            });

            alert("Account created successfully! Please sign in with your credentials.");
            onSwitchToLogin();
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setErr(errorData);
                } else if (errorData.username) {
                    setErr(`Username: ${errorData.username[0]}`);
                } else if (errorData.email) {
                    setErr(`Email: ${errorData.email[0]}`);
                } else if (errorData.password1) {
                    setErr(`Password: ${errorData.password1[0]}`);
                } else if (errorData.non_field_errors) {
                    setErr(errorData.non_field_errors[0]);
                } else {
                    setErr("Registration failed. Please try again.");
                }
            } else {
                setErr("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box'
    };

    const handleInputFocus = (e) => {
        e.target.style.borderColor = '#6366f1';
        e.target.style.backgroundColor = 'white';
        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.backgroundColor = '#f8fafc';
        e.target.style.boxShadow = 'none';
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
                maxWidth: '450px',
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
                        Create Account
                    </h2>
                    <p style={{
                        color: '#718096',
                        fontSize: '16px',
                        margin: 0
                    }}>
                        Join our restaurant booking system
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Username
                        </label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>



                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password1"
                            value={formData.password1}
                            onChange={handleChange}
                            placeholder="Create a password"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px'
                        }}>
                            At least 8 characters, not entirely numeric, avoid common passwords
                        </div>
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            style={inputStyle}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? '#9ca3af' : '#10b981',
                            color: 'white',
                            padding: '14px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '20px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#059669';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#10b981';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
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
                            Already have an account?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
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
                            Sign in here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}