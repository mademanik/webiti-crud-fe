import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [refreshToken, setRefreshToken] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState(null);

    let refreshTimeout;

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("user_data"));
        if (storedData) {
            const { userToken, user, refresh, exp, refreshExp } = storedData;
            if (Date.now() < refreshExp) {
                setToken(userToken);
                setUserData(user);
                setRefreshToken(refresh);
                setExpiresAt(exp);
                setRefreshTokenExpiresAt(refreshExp);
                setIsAuthenticated(true);

                scheduleTokenRefresh(exp);
            } else {
                logout();
            }
        }
    }, []);

    const login = (newToken, newData, newRefreshToken, exp, refreshExp) => {
        localStorage.setItem(
            "user_data",
            JSON.stringify({
                userToken: newToken,
                user: newData,
                refresh: newRefreshToken,
                exp,
                refreshExp,
            })
        );

        setToken(newToken);
        setUserData(newData);
        setRefreshToken(newRefreshToken);
        setExpiresAt(exp);
        setRefreshTokenExpiresAt(refreshExp);
        setIsAuthenticated(true);

        scheduleTokenRefresh(exp);
    };

    const logout = () => {
        localStorage.removeItem("user_data");
        setToken(null);
        setUserData(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setRefreshTokenExpiresAt(null);
        setIsAuthenticated(false);

        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
        }
    };

    const refreshAccessToken = async () => {
        if (!refreshToken || Date.now() >= refreshTokenExpiresAt) {
            console.log("Refresh token expired. Logging out...");
            logout();
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/auth/refreshToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const data = await res.json();
            if (res.status === 200) {
                console.log("Token refreshed successfully.");
                const newExp = Date.now() + data.data.expiresIn;
                login(data.data.accessToken, userData, refreshToken, newExp, refreshTokenExpiresAt);
            } else {
                console.error("Failed to refresh token:", data.message);
                logout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
        }
    };

    const scheduleTokenRefresh = (exp) => {
        const refreshTime = exp - Date.now() - 60000;
        if (refreshTime > 0) {
            refreshTimeout = setTimeout(refreshAccessToken, refreshTime);
        } else {
            logout();
        }
    };

    useEffect(() => {
        console.log("Auth status changed:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
