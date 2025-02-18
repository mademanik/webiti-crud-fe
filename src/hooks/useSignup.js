import {useState} from 'react';
import {useAuth} from "../contexts/AuthContext.jsx";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

const UseSignup = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError("Passwords don't match");
        }

        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 201 || res.status === 200) {
                message.success(data.message, 3);
                navigate('/login');
            } else {
                setError(data.message);
                message.error('Registration failed', 3);
            }
        } catch (error) {
            message.error(error, 3);
        } finally {
            setLoading(false);
        }

    }
    return {loading, error, registerUser};
};

export default UseSignup;