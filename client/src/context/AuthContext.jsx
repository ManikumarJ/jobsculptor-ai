import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);

    // Set auth header for axios globally
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }

    const loadUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('http://localhost:5000/api/auth');
            setUser(res.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, [token]);

    const login = async (email, password) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({ email, password });

        try {

            const res = await axios.post('http://localhost:5000/api/auth/login', body, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            return true;
        } catch (err) {
            console.error(err);
            throw err.response?.data?.msg || err.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({ name, email, password });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', body, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            return true;
        } catch (err) {
            console.error(err);
            throw err.response?.data?.msg || err.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
