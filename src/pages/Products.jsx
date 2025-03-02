import React, {useState, useEffect} from 'react';
import {Table, Typography, Button, Modal, Form, Input, message, Row, Col} from 'antd';
import axios from 'axios';

const {Title} = Typography;

const Products = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ name: '', minPrice: '', maxPrice: '' });
    const [form] = Form.useForm();

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const token = userData?.userToken;
    const headers = {Authorization: `Bearer ${token}`};

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        try {
            const params = {
                name: filters.name || '',
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined
            };

            const response = await axios.get(`http://localhost:8080/products`, {
                params,
                headers
            });

            const sortedData = response.data.data.sort((a, b) => a.id - b.id);
            setData(sortedData); // Ensure correct data structure
        } catch (error) {
            message.error('Failed to fetch products');
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        fetchProducts(filters);
    };


    const handleReset = () => {
        setFilters({ name: '', minPrice: '', maxPrice: '' });
        fetchProducts();
    };

    const fetchProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/products/${id}`, {headers});
            return response.data.data;
        } catch (error) {
            message.error('Failed to fetch product details');
            return null;
        }
    };

    const showModal = async (product = null) => {
        setEditingProduct(product);
        setIsModalVisible(true);

        if (product) {
            const productData = await fetchProductById(product.id);
            if (productData) {
                form.setFieldsValue({
                    name: productData.name,
                    price: productData.price,
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

            if (editingProduct) {
                await axios.put(`http://localhost:8080/products/${editingProduct.id}`, values, {headers});
                message.success('Product updated successfully');
            } else {
                await axios.post('http://localhost:8080/products', values, {headers});
                message.success('Product added successfully');
            }
            fetchProducts();
            handleCancel();
        } catch (e) {
            if (e.response) {
                message.error(e.response.data.message);
            } else {
                message.error('Failed to save product');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/products/${id}`, {headers});
            message.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            message.error('Failed to delete product');
        }
    };

    const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, defaultSortOrder: 'ascend'},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Price', dataIndex: 'price', key: 'price'},
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => showModal(record)} style={{marginRight: 8}}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            {/* Header with Title and Add Product Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Products</Title>
                <Button type="primary" onClick={() => showModal()}>Add Product</Button>
            </div>

            {/* Search Filters */}
            <Row gutter={16} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                <Col span={6}>
                    <Input
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        placeholder="Min Price"
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        placeholder="Max Price"
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </Col>
            </Row>

            {/* Products Table */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            {/* Modal for Add/Edit Product */}
            <Modal
                title={editingProduct ? 'Edit Product' : 'Add Product'}
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please enter product price' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );

};

export default Products;
