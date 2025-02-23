import React from 'react';
import {Alert, Button, Card, Flex, Form, Input, Spin, Typography} from "antd";
import {Link} from "react-router-dom";
import loginImage from "../assets/social.png"
import useLogin from "../hooks/useLogin.js";

const Login = () => {
    const {error, loading, loginUser} = useLogin();
    const handleLogin = async (values) => {
        await loginUser(values);
    }
    return (
        <div className="container-center">
            <Card className="form-container">
                <Flex gap="large" align="center">
                    {/*form*/}
                    <Flex vertical flex={1}>
                        <Typography.Title level={3} strong className="title">
                            Login
                        </Typography.Title>
                        <Typography.Text type="secondary" strong className="slogan">
                            Webiti Store
                        </Typography.Text>
                        <Form layout="vertical" onFinish={handleLogin} autoComplete="false">
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                                {
                                    type: "email",
                                    message: "The input is not valid Email",
                                }
                            ]}>
                                <Input size="large" placeholder="Enter your email"/>
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                }
                            ]}>
                                <Input.Password size="large" placeholder="Enter your password"/>
                            </Form.Item>
                            {error && (<Alert description={error} type="error" showIcon closable className="alert"/>)}
                            <Form.Item>
                                <Button
                                    type={loading ? '' : 'primary'}
                                    htmlType="submit" size="large"
                                    className="btn">
                                    {loading ? <Spin/> : 'Login'}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to="/">
                                    <Button size="large" className="btn">Register</Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </Flex>
                    <Flex flex={1}>
                        <img src={loginImage} className="auth-image"/>
                    </Flex>
                </Flex>
            </Card>
        </div>
    )
};

export default Login;