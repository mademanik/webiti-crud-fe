import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import Register from "./Auth/Register.jsx";
import Login from "./Auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import {useAuth} from "./contexts/AuthContext.jsx";


const App = () => {
    const {isAuthenticated} = useAuth();
    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <Register/> : <Navigate to = '/dashboard'/>}/>
                <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate to = '/dashboard'/>}/>
                {/*<Route path="/dashboard" element={!isAuthenticated ? <Dashboard/> : <Login/>}/>*/}
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to="/login"/>}/>
            </Routes>
        </Router>
    );
};

export default App;
