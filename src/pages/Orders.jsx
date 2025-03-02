import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Modal, Form, InputNumber, Select, message } from "antd";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [form] = Form.useForm();

    const userData = JSON.parse(localStorage.getItem("user_data"));
    const token = userData?.userToken;
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch Orders
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/orders", { headers });
            setData(response.data.data.sort((a, b) => a.id - b.id));
        } catch (error) {
            message.error("Failed to fetch orders");
        }
        setLoading(false);
    };

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/users?page=0&size=100", { headers });
            setUsers(response.data.data.users);
        } catch (error) {
            message.error("Failed to fetch users");
        }
    };

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/products?name=", { headers });
            setProducts(response.data.data);
        } catch (error) {
            message.error("Failed to fetch products");
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchProducts();
    }, []);

    // Open Modal
    const showModal = (order = null) => {
        setIsModalVisible(true);
        setEditingOrder(order);

        if (order) {
            form.setFieldsValue({
                user_id: order.user?.id, // Ensure user ID is set correctly
                product_id: order.product?.id, // Ensure product ID is set correctly
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                status: order.status
            });
        } else {
            form.resetFields();
        }
    };


    // Handle Submit
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                user_id: values.user_id,
                product_id: values.product_id,
                quantity: values.quantity,
                totalPrice: values.totalPrice,
                status: values.status,
            };

            if (editingOrder) {
                await axios.put(`http://localhost:8080/orders/${editingOrder.id}`, payload, { headers });
                message.success("Order updated successfully");
            } else {
                await axios.post("http://localhost:8080/orders", payload, { headers });
                message.success("Order added successfully");
            }

            setIsModalVisible(false);
            fetchOrders();
        } catch (error) {
            message.error("Failed to save order");
        }
    };

    // Handle Cancel
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingOrder(null);
        form.resetFields();
    };

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/orders/${id}`, { headers });
            message.success("Order deleted successfully");
            fetchOrders();
        } catch (error) {
            message.error("Failed to delete order");
        }
    };

    // Handle Quantity Change
    const handleQuantityChange = (quantity) => {
        const product_id = form.getFieldValue("product_id");
        const product = products.find((p) => p.id === product_id);
        if (product) {
            form.setFieldsValue({ totalPrice: quantity * product.price });
        }
    };

    // Handle Product Change
    const handleProductChange = (product_id) => {
        const product = products.find((p) => p.id === product_id);
        if (product) {
            const quantity = form.getFieldValue("quantity") || 1;
            form.setFieldsValue({ totalPrice: quantity * product.price });
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id, defaultSortOrder: "ascend" },
        { title: "Product", dataIndex: ["product", "name"], key: "product.name" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "User", dataIndex: ["user", "fullName"], key: "user.fullName" },
        {
            title: "Actions",
            key: "actions",
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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Title level={3}>Orders</Title>
                <Button type="primary" onClick={() => showModal()}>Add Order</Button>
            </div>

            {/* Table */}
            <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />

            {/* Modal */}
            <Modal
                title={editingOrder ? "Edit Order" : "Add Order"}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    {/* User */}
                    <Form.Item name="user_id" label="User" rules={[{ required: true, message: "Please select a user" }]}>
                        <Select placeholder="Select User">
                            {users.map((user) => (
                                <Option key={user.id} value={user.id}>{user.fullName}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Product */}
                    <Form.Item name="product_id" label="Product" rules={[{ required: true, message: "Please select a product" }]}>
                        <Select placeholder="Select Product" onChange={handleProductChange}>
                            {products.map((product) => (
                                <Option key={product.id} value={product.id}>{product.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Quantity */}
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Enter quantity" }]}>
                        <InputNumber min={1} onChange={handleQuantityChange} style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Total Price (Read-only) */}
                    <Form.Item name="totalPrice" label="Total Price">
                        <InputNumber readOnly style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="status" label="Order Status" rules={[{ required: true, message: "Please select an order status" }]}>
                        <Select placeholder="Select Status">
                            <Option value="PENDING">Pending</Option>
                            <Option value="PROCESSING">Processing</Option>
                            <Option value="COMPLETED">Completed</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Orders;
