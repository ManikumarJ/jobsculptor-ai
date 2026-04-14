import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);

    // =========================
    // Set Axios Header Globally
    // =========================
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // =========================
    // LOAD USER (FIXED)
    // =========================
    const loadUser = async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/auth/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(res.data);
        } catch (err) {
            console.error("Load user failed:", err);

            localStorage.removeItem("token");
            setToken("");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, [token]);

    // =========================
    // LOGIN
    // =========================
    const login = async (email, password) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);

            return true;
        } catch (err) {
            throw err.response?.data?.msg || "Login failed";
        }
    };

    // =========================
    // REGISTER
    // =========================
    const register = async (name, email, password) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                { name, email, password }
            );

            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);

            return true;
        } catch (err) {
            throw err.response?.data?.msg || "Register failed";
        }
    };

    // =========================
    // LOGOUT
    // =========================
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
    };

    // =========================
    // CONTEXT VALUE
    // =========================
    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};