import React from 'react';
import {Table, Typography} from "antd";

const {Title} = Typography;

const columns = [
    {title: "ID", dataIndex: "id", key: "id"},
    {title: "Name", dataIndex: "name", key: "name"},
    {title: "Email", dataIndex: "email", key: "email"}
];

const data = [
    {id: 1, name: "John Doe", email: "john@example.com"},
    {id: 2, name: "Jane Smith", email: "jane@example.com"}
];

const Users = () => {
    console.log("Users Component Rendered"); // Debugging
    return (
        <div>
            <Title level={3}>Users</Title>
            <Table columns={columns} dataSource={data} rowKey="id" pagination={{pageSize: 5}}/>
        </div>
    );
};

export default Users;