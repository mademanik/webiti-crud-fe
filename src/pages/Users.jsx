import React, {useState} from 'react';
import {Table, Typography, Button, Modal, Form, Input, message} from 'antd';
import axios from 'axios';

const {Title} = Typography;

const Users = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const userData = JSON.parse(localStorage.getItem('user_data'));
            const token = userData?.userToken;
            const response = await axios.post('http://localhost:8080/users', values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                message.success('User added successfully');
                setData([...data, { id: data.length + 1, name: values.fullName, email: values.email }]);
                handleCancel();
            } else {
                console.log(response);
            }
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

    const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id'},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
    ];
    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <Title level={3}>Users</Title>
                <Button type="primary" onClick={showModal}>
                    Add User
                </Button>
            </div>
            <Table columns={columns} dataSource={data} rowKey="id" pagination={{pageSize: 5}}/>

            <Modal title="Add User" visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="fullName" label="Full Name"
                               rules={[{required: true, message: 'Please enter full name'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="email" label="Email"
                               rules={[{required: true, type: 'email', message: 'Please enter a valid email'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="password" label="Password"
                               rules={[{required: true, message: 'Please enter password'}]}>
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;