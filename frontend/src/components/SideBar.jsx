import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

function SideBar() {
    return (
        <Sidebar>
            <Menu
                menuItemStyles={{
                    button: {
                        [`&.active`]: {
                            backgroundColor: '#13395e',
                            color: '#b6c8d9',
                        },
                    },
                }}
            >
                <MenuItem component={<Link to="/" />}> Dashboard</MenuItem>
                <MenuItem component={<Link to="/users-manager" />}> Users Manager</MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default SideBar;