import {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storeData = JSON.parse(localStorage.getItem("user_data"));
        if (storeData) {
            const {userToken, user} = storeData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken, newData) => {
        localStorage.setItem("user_data", JSON.stringify({userToken: newToken, user: newData}),
        );

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("user_data");
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        console.log("Auth status changed:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);