import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);

    // =========================
    // Set axios auth header safely
    // =========================
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // =========================
    // Load user
    // =========================
    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
            setUser(res.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem("token");
            setToken("");
            setUser(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadUser();
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