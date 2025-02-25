import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Users = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [form] = Form.useForm();

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const token = userData?.userToken;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = async (page = 0, size = 5) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/users?page=${page}&size=${size}`, { headers });
            const { totalItems, currentPage, users } = response.data.data;
            setData(users);
            setPagination({ current: currentPage + 1, pageSize: size, total: totalItems });
        } catch (error) {
            message.error('Failed to fetch users');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUserById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${id}`, { headers });
            return response.data.data;
        } catch (error) {
            message.error('Failed to fetch user details');
            return null;
        }
    };

    const handleTableChange = (pagination) => {
        fetchUsers(pagination.current - 1, pagination.pageSize);
    };

    const showModal = async (user = null) => {
        console.log(user)
        setEditingUser(user);
        setIsModalVisible(true);

        if (user) {
            const userData = await fetchUserById(user.id);
            if (userData) {
                form.setFieldsValue({
                    fullName: userData.fullName,
                    email: userData.email,
                });
            }
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const userData = JSON.parse(localStorage.getItem('user_data'));
            const token = userData?.userToken;

            if (editingUser) {
                if (!values.password) {
                    delete values.password;
                }
                await axios.put(`http://localhost:8080/users/${editingUser.id}`, values, { headers: {
                        Authorization: `Bearer ${token}`
                    } });
                message.success('User updated successfully');
            } else {
                const response = await axios.post('http://localhost:8080/users', values, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    message.success('User added successfully');
                    setData([...data, { id: data.length + 1, name: values.fullName, email: values.email }]);
                } else {
                    console.log(response);
                }
            }
            fetchUsers();
            handleCancel();
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
                message.error(e.response.data.message);
            } else {
                console.log(e);
                message.error('Failed to add user');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/users/${id}`, { headers });
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Users</Title>
                <Button type="primary" onClick={() => showModal()}>Add User</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Modal title={editingUser ? 'Edit User' : 'Add User'} visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="fullName" label="Full Name"
                               rules={[{required: true, message: 'Please enter full name'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="email" label="Email"
                               rules={[{required: true, type: 'email', message: 'Please enter a valid email'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;
