import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobTracker from './pages/JobTracker';
import JobDetails from './pages/JobDetails';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <main className="flex-grow flex flex-col">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analyzer"
                                element={
                                    <ProtectedRoute>
                                        <ResumeAnalyzer />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tracker"
                                element={
                                    <ProtectedRoute>
                                        <JobTracker />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/jobs/:id"
                                element={
                                    <ProtectedRoute>
                                        <JobDetails />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
