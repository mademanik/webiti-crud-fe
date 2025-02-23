import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import Register from "./Auth/Register.jsx";
import Login from "./Auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import {useAuth} from "./contexts/AuthContext.jsx";
import Users from "./pages/Users.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";


const App = () => {
    const {isAuthenticated} = useAuth();
    return (
        <Router>
            <Routes>
                {/* Authentication Routes */}
                <Route path="/" element={!isAuthenticated ? <Register/> : <Navigate to="/dashboard"/>}/>
                <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard"/>}/>

                {/* Dashboard Layout with Nested Routes */}
                <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard/> : <Navigate to="/login"/>}>
                    <Route index element={<h2>Welcome to Dashboard</h2>}/>
                    <Route path="users" element={<Users/>}/>
                    <Route path="products" element={<Products/>}/>
                    <Route path="orders" element={<Orders/>}/>
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<Navigate to="/dashboard"/>}/>
            </Routes>
        </Router>
    );
};

export default App;
