// import React, { createContext, useContext, useState } from "react";
//
// const AuthContext = createContext();
//
// export const AuthProvider = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
//     const [loginUser, setLoginUser] = useState(localStorage.getItem("username") || "");
//
//     return (
//         <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginUser, setLoginUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig"; // axios 인스턴스

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, nickname, ... }
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // 최초 mount시 user fetch
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            api.get("/userinfo", { headers: { access: token } })
                .then((res) => {
                    setUser(res.data);
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    setUser(null);
                    setIsLoggedIn(false);
                })
                .finally(() => setLoading(false));
        } else {
            setUser(null);
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
