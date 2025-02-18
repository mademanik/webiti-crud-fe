import {useState} from 'react';
import {useAuth} from "../contexts/AuthContext.jsx";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

const UseLogin = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 201 || res.status === 200) {
                message.success(data.message, 3);
                const userData = await getUserData(data.data.accessToken);
                if (userData) {
                    login(data.data.accessToken, userData);
                } else {
                    message.error('Failed to retrieve user data', 3);
                }
            } else {
                setError(data.message);
                message.error('Login failed', 3);
            }
        } catch (error) {
            message.error(error, 3);
        } finally {
            setLoading(false);
        }

    }

    const getUserData = async (token) => {
        try {
            const res = await fetch('http://localhost:8080/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            const data = await res.json();
            if (res.status === 201 || res.status === 200) {
                return data.data;
            } else {
                setError(data.message);
                message.error('Failed retrieve userData', 3);
            }
        } catch (error) {
            message.error(error, 3);
        }
    }
    return {loading, error, loginUser};
};

export default UseLogin;