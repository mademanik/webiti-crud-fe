import React from 'react';
import {Menu} from "antd";
import {HomeOutlined, LogoutOutlined, OrderedListOutlined, ProductOutlined, UserOutlined} from '@ant-design/icons'
import {useAuth} from "../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const MenuList = ({darkTheme}) => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar">
            <Menu.Item key="home" icon={<HomeOutlined/>}>
                Home
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />} onClick={() => navigate("/dashboard/users")}>
                Users
            </Menu.Item>
            <Menu.Item key="products" icon={<ProductOutlined/>} onClick={() => navigate("/dashboard/products")}>
                Products
            </Menu.Item>
            <Menu.Item key="orders" icon={<OrderedListOutlined/>} onClick={() => navigate("/dashboard/orders")}>
                Orders
            </Menu.Item>
            {/*This part for add submenu part*/}
            {/*<Menu.SubMenu key="subtask" icon={<BarsOutlined/>} title="Tasks">*/}
            {/*    <Menu.Item key="task-1">Task 1</Menu.Item>*/}
            {/*    <Menu.Item key="task-2">Task 2</Menu.Item>*/}
            {/*</Menu.SubMenu>*/}
            <Menu.Item key="signout" icon={<LogoutOutlined/>} onClick={logout}>
                Sign Out
            </Menu.Item>
        </Menu>
    );
};

export default MenuList;