import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, FileText, LayoutDashboard, LogOut, Bell } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from "../config/api";

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.put(`${API_BASE_URL}/api/notifications/read-all`, {}, {
                    headers: { 'x-auth-token': token }
                });
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Polling optionally, but since this is frontend we'll just check on load and interval
            const interval = setInterval(fetchNotifications, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifRef]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && notifications.some(n => !n.isRead)) {
            markAsRead();
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-brand-600 font-bold text-xl group">
                            <div className="p-1.5 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors">
                                <Briefcase className="h-5 w-5 text-brand-600" />
                            </div>
                            <span className="font-display tracking-tight text-gray-900">Job<span className="text-brand-600">Sculptor</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <Link to="/analyzer" className="text-gray-600 hover:text-brand-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Analyzer</span>
                                </Link>
                                <Link to="/tracker" className="text-gray-600 hover:text-brand-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="hidden sm:inline">Tracker</span>
                                </Link>

                                {/* Notification Bell */}
                                <div className="relative" ref={notifRef}>
                                    <button
                                        onClick={toggleNotifications}
                                        className="relative p-2 text-gray-500 hover:text-brand-600 focus:outline-none transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Dropdown Pane */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100 divide-y divide-gray-100">
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        {notifications.filter(n => !n.isRead).length > 0 && (
                                                            <>

                                                                {notifications.filter(n => !n.isRead).map((notif) => (
                                                                    <div key={notif._id} className="p-4 bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors cursor-pointer border-b border-white">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                                                                            <span className="h-2 w-2 bg-brand-600 rounded-full flex-shrink-0 mt-1 shadow-sm shadow-brand-500/50"></span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.body}</p>
                                                                        <span className="text-[10px] text-gray-400 mt-2 block w-full text-right font-medium">
                                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}

                                                        {notifications.filter(n => n.isRead).length > 0 && (
                                                            <>

                                                                {notifications.filter(n => n.isRead).map((notif) => (
                                                                    <div key={notif._id} className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className="text-sm font-medium text-gray-700">{notif.title}</h4>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.body}</p>
                                                                        <span className="text-[10px] text-gray-400 mt-2 block w-full text-right">
                                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="ml-2 flex items-center space-x-1 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm focus:outline-none"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-indigo-500/20 active:scale-95">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
