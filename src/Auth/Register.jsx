import React from 'react';
import {Alert, Button, Card, Flex, Form, Input, Spin, Typography} from "antd";
import {Link} from "react-router-dom";
import registerImage from "../assets/astronout.png"
import useSignup from "../hooks/useSignup.js";

const Register = () => {
    const {loading, error, registerUser} = useSignup();
    const handleRegister = (values) => {
        registerUser(values);
    }
    return (
        <div className="container-center">
            <Card className="form-container">
                <Flex gap="large" align="center">
                    {/*form*/}
                    <Flex vertical flex={1}>
                        <Typography.Title level={3} strong className="title">
                            Create an account
                        </Typography.Title>
                        <Typography.Text type="secondary" strong className="slogan">
                            Webiti Store
                        </Typography.Text>
                        <Form layout="vertical" onFinish={handleRegister} autoComplete="false">
                            <Form.Item label="Fullname" name="fullName" rules={[
                                {
                                    required: true,
                                    message: "Please enter your full name",
                                }
                            ]}>
                                <Input size="large" placeholder="Enter your fullname"/>
                            </Form.Item>
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
                            <Form.Item label="Confirm Password" name="passwordConfirm" rules={[
                                {
                                    required: true,
                                    message: "Please enter your confirm password",
                                }
                            ]}>
                                <Input.Password size="large" placeholder="Re-enter your confirm password"/>
                            </Form.Item>
                            {error && (<Alert description={error} type="error" showIcon closable className="alert"/>)}
                            <Form.Item>
                                <Button
                                    type={loading ? '' : 'primary'}
                                    htmlType="submit" size="large"
                                    className="btn">
                                    {loading ? <Spin/> : 'Register'}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to="/login">
                                    <Button size="large" className="btn">Sign in</Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </Flex>
                    <Flex flex={1}>
                        <img src={registerImage} className="auth-image"/>
                    </Flex>
                </Flex>
            </Card>
        </div>
    )
};

export default Register;