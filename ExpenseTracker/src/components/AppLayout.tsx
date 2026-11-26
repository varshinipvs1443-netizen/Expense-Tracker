import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
export default function AppLayout() {
    const hour = new Date().getHours();

    const greeting =
        hour < 12 ? "Good Morning" :
        hour < 17 ? "Good Afternoon" :
        "Good Evening";
     return <div className="app-shell">
        <Sidebar />
            <main className="main-area">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">YOUR MONEY, IN FOCUS</span>
                        <h1>{greeting} <span className="wave">✦</span></h1>
                    </div>
                    <div className="profile">
                        <div className="avatar">VP</div>
                        <div>
                            <strong>Varshini Pokala</strong>
                            <small>Personal account</small>
                        </div>
                    </div>
                </header>
                <div className="page-content">
                        <Outlet />
                </div>
                <footer>Made for mindful money habits <span>·</span> FinTrack</footer>
            </main>
    </div>;
}
