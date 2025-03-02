import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Line } from "@ant-design/plots";

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        orderStatuses: {}
    });

    // Retrieve user token from localStorage
    const userData = JSON.parse(localStorage.getItem('user_data'));
    const token = userData?.userToken;
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, productsRes, ordersRes] = await Promise.all([
                    fetch("http://localhost:8080/stats/users", { headers }),
                    fetch("http://localhost:8080/stats/products", { headers }),
                    fetch("http://localhost:8080/stats/orders", { headers })
                ]);

                const usersData = await usersRes.json();
                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();

                setStats({
                    totalUsers: usersData.data.totalUser,
                    totalProducts: productsData.data.totalProduct,
                    totalOrders: ordersData.data.totalOrders,
                    orderStatuses: ordersData.data.statuses
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    const orderStatusData = Object.keys(stats.orderStatuses).map((status) => ({
        type: status,
        value: stats.orderStatuses[status],
    }));

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Users" value={stats.totalUsers} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Products" value={stats.totalProducts} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Orders" value={stats.totalOrders} />
                </Card>
            </Col>
            <Col span={12} style={{ marginTop: 20 }}>
                <Card title="Order Status Distribution">
                    <Pie data={orderStatusData} angleField="value" colorField="type" />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardHome;
