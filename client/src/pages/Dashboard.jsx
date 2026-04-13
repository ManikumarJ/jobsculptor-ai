import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Briefcase, CheckCircle, Clock, XCircle, LayoutDashboard, Target, Zap, TrendingUp, Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToPushNotifications } from '../utils/pushNotifications';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6'];

const StatCard = ({ title, value, icon, color, trend }) => {
    const colorStyles = {
        indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-200/50',
        emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-200/50',
        amber: 'bg-amber-50 text-amber-600 ring-amber-200/50',
        rose: 'bg-rose-50 text-rose-600 ring-rose-200/50',
        blue: 'bg-blue-50 text-blue-600 ring-blue-200/50',
        gray: 'bg-gray-50 text-gray-600 ring-gray-200/50',
    };

    const gradientStyles = {
        indigo: 'from-indigo-500/20 to-transparent',
        emerald: 'from-emerald-500/20 to-transparent',
        amber: 'from-amber-500/20 to-transparent',
        rose: 'from-rose-500/20 to-transparent',
        blue: 'from-blue-500/20 to-transparent',
        gray: 'from-gray-500/20 to-transparent',
    }

    return (
        <div className={`relative overflow-hidden bg-white rounded-[20px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 group`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${gradientStyles[color]} rounded-full blur-2xl group-hover:blur-xl transition-all duration-500`}></div>
            <div className="relative z-10 p-5">
                <div className={`inline-flex p-2.5 rounded-xl ring-1 mb-4 ${colorStyles[color]} shadow-sm`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-gray-900 font-display tracking-tight">{value}</h3>
                        {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{trend}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();

        // Trigger Push Notification prompt
        subscribeToPushNotifications();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;

    // Calculate statistics
    const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'Saved').length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interview: jobs.filter(j => j.status === 'Interview').length,
        offer: jobs.filter(j => j.status === 'Offer').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length,
    };

    const statusData = [
        { name: 'Saved', value: stats.saved },
        { name: 'Applied', value: stats.applied },
        { name: 'Interview', value: stats.interview },
        { name: 'Offer', value: stats.offer },
        { name: 'Rejected', value: stats.rejected },
    ].filter(item => item.value > 0);

    // Simple monthly application data
    const monthData = jobs.reduce((acc, job) => {
        const month = new Date(job.appliedDate).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.name === month);
        if (existing) {
            existing.applications += 1;
        } else {
            acc.push({ name: month, applications: 1 });
        }
        return acc;
    }, []).reverse();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-[#f8fafc] min-h-[calc(100vh-64px)] space-y-8">
            {/* Hero Section */}
            <div className="relative rounded-[32px] bg-indigo-900 overflow-hidden shadow-2xl shadow-indigo-900/20 px-8 py-10 lg:px-12 lg:py-14 border border-indigo-800">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-screen filter blur-[60px] opacity-20"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-800/40 border border-indigo-700/50 text-indigo-200 text-sm font-semibold mb-6 backdrop-blur-md">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span>Your Career Hub</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white font-display mb-4 tracking-tight drop-shadow-sm">
                            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}
                        </h1>
                        <p className="text-indigo-100/90 text-[1.1rem] font-medium leading-relaxed">
                            You've tracked <span className="font-bold text-white bg-indigo-800/50 px-2 py-0.5 rounded-md mx-1 border border-indigo-700/50">{stats.total}</span> opportunities so far. Keep the momentum going!
                        </p>
                    </div>

                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
                        <Link to="/tracker" className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-white text-indigo-900 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-indigo-50 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all active:scale-[0.98] border border-indigo-100">
                            <Briefcase className="h-5 w-5" />
                            Go to Tracker
                        </Link>
                        <Link to="/analyzer" className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-indigo-800/40 text-white font-bold hover:bg-indigo-700/50 transition-all active:scale-[0.98] border border-indigo-600/50 backdrop-blur-md">
                            <Target className="h-5 w-5" />
                            Analyze Resume
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                <StatCard title="Total Jobs" value={stats.total} icon={<LayoutDashboard className="h-5 w-5" />} color="indigo" />
                <StatCard title="Saved" value={stats.saved} icon={<Briefcase className="h-5 w-5" />} color="gray" />
                <StatCard title="Applied" value={stats.applied} icon={<Send className="h-5 w-5" />} color="blue" />
                <StatCard title="Interviewing" value={stats.interview} icon={<Clock className="h-5 w-5" />} color="amber" />
                <StatCard title="Offers" value={stats.offer} icon={<CheckCircle className="h-5 w-5" />} color="emerald" />
                <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-5 w-5" />} color="rose" />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                {/* Pipeline Funnel / Distribution */}
                <div className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] rounded-[32px] p-6 lg:p-8 border border-gray-100 lg:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full -z-0 transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
                                    Pipeline Distribution
                                </h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Status of current prospects</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-2xl ring-1 ring-indigo-100/50">
                                <Target className="h-5 w-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="h-[280px] flex-grow">
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={8}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                                            itemStyle={{ color: '#111827', fontSize: '14px' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '24px', fontSize: '13px', fontWeight: '600' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="bg-gray-50 p-4 rounded-full mb-3 ring-1 ring-gray-100">
                                        <Zap className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="font-bold text-gray-600 font-display text-lg">No pipeline data</p>
                                    <p className="text-sm text-gray-500 mt-1">Add jobs to visualize your stats</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Applications Over Time */}
                <div className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] rounded-[32px] p-6 lg:p-8 border border-gray-100 lg:col-span-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full -z-0 transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
                                    Application Activity
                                </h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">Monthly job search volume</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-2xl ring-1 ring-indigo-100/50">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="h-[280px] flex-grow">
                            {monthData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={monthData}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dx={-10} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc', radius: [8, 8, 8, 8] }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                                            itemStyle={{ color: '#4f46e5', fontSize: '14px' }}
                                        />
                                        <Bar dataKey="applications" fill="url(#colorUv)" radius={[8, 8, 8, 8]} maxBarSize={45}>
                                        </Bar>

                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>

                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="bg-gray-50 p-4 rounded-full mb-3 ring-1 ring-gray-100">
                                        <TrendingUp className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="font-bold text-gray-600 font-display text-lg">No activity data</p>
                                    <p className="text-sm text-gray-500 mt-1">Start tracking to see your trends over time</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
