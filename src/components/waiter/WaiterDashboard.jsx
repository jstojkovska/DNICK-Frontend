import WaiterBoard from './WaiterBoard.jsx';
import {setAuth} from '../../api.js';

export default function WaiterDashboard({me, onLogout}) {
    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('refresh');
        onLogout?.();
    };

    return (
        <div className="waiter-dashboard-container">
            <div className="waiter-dashboard-inner">
                <div className="waiter-header">
                    <div className="header-content">
                        <h1 className="waiter-title">Waiter Dashboard</h1>
                        <div className="header-right">
                            {me && <span className="welcome-text">Hello, {me.username}</span>}
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="waiter-content">
                    <WaiterBoard />
                </div>
            </div>

            <style jsx>{`
                .waiter-dashboard-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 40px 20px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    width: 100vw;
                    margin: 0;
                    position: relative;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .waiter-dashboard-inner {
                    width: 100%;
                    max-width: 1200px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .waiter-header {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    width: 100%;
                    box-sizing: border-box;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    width: 100%;
                }

                .waiter-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #1a202c;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    flex: 1;
                    min-width: 0;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-shrink: 0;
                    min-width: fit-content;
                }

                .welcome-text {
                    font-size: 1.1rem;
                    color: #4a5568;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .logout-btn {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
                    font-size: 1rem;
                    min-width: 100px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .logout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(238, 90, 82, 0.4);
                }

                .waiter-content {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 32px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    width: 100%;
                    box-sizing: border-box;
                }

                @media (max-width: 768px) {
                    .waiter-dashboard-container {
                        padding: 20px 16px;
                    }

                    .waiter-title {
                        font-size: 2rem;
                    }

                    .header-content {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                    }

                    .header-right {
                        flex-direction: column;
                        width: 100%;
                        gap: 12px;
                    }

                    .waiter-content {
                        padding: 24px 16px;
                    }
                }
            `}</style>
        </div>
    );
}