import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

function SideBar() {
    const location = useLocation();

    return (
        <Sidebar
            backgroundColor="#1e293b"
        >
            <div className="p-4 text-center border-b border-slate-700 mb-2">
                <h2 className="text-lg font-bold text-white">Quản lý nhân sự</h2>
            </div>
            <Menu
                menuItemStyles={{
                    button: ({ active }) => ({
                        backgroundColor: active ? '#334155' : 'transparent',
                        color: active ? '#38bdf8' : '#94a3b8',
                        '&:hover': {
                            backgroundColor: '#334155',
                            color: '#e2e8f0',
                        },
                    }),
                }}
            >
                <MenuItem
                    active={location.pathname === '/'}
                    component={<Link to="/" />}
                >
                    Dashboard
                </MenuItem>
                <MenuItem
                    active={location.pathname === '/users-manager'}
                    component={<Link to="/users-manager" />}
                >
                    Quản lý users
                </MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default SideBar;