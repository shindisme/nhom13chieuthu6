import { Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';

function Layout() {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
