import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Building, Calendar, Star, Trash2, Edit, ExternalLink } from 'lucide-react';

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusUpdating, setStatusUpdating] = useState(false);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
            setJob(res.data);
            setEditForm(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch job details');
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveEdit = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, editForm);
            setJob(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save changes');
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatusUpdating(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, {
                status: newStatus
            });
            setJob(res.data);
            alert('Job status updated');
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/jobs/${id}`);
            alert('Job deleted successfully');
            navigate('/tracker');
        } catch (err) {
            console.error(err);
            alert('Failed to delete job');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading job details...</div>;
    if (error || !job) return <div className="p-8 text-center text-red-500">{error || 'Job not found'}</div>;

    const date = new Date(job.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/tracker')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Job Tracker
                </button>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={job.status}
                            onChange={handleStatusChange}
                            disabled={statusUpdating}
                            className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm ${statusUpdating ? 'opacity-50' : ''}`}
                        >
                            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Job
                    </button>
                </div>
            </div>

            {/* Job Content */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 relative">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-5 right-6 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <Edit className="h-5 w-5" />
                        </button>
                    )}

                    {isEditing ? (
                        <div className="space-y-4 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" name="jobTitle" value={editForm?.jobTitle || ''} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" name="companyName" value={editForm?.companyName || ''} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            { /* Safe datetime-local helper */}
                            {(() => {
                                const formatDateTimeForInput = (dateString) => {
                                    if (!dateString) return '';
                                    const d = new Date(dateString);
                                    if (isNaN(d.getTime())) return '';
                                    const year = d.getFullYear();
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const day = String(d.getDate()).padStart(2, '0');
                                    const hours = String(d.getHours()).padStart(2, '0');
                                    const minutes = String(d.getMinutes()).padStart(2, '0');
                                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                                };
                                return (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Interview Date & Time</label>
                                        <input type="datetime-local" name="interviewDate"
                                            value={formatDateTimeForInput(editForm?.interviewDate)}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                )
                            })()}
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl leading-6 font-bold text-gray-900 pr-8">{job.jobTitle}</h3>
                            <div className="mt-2 max-w-2xl text-sm text-gray-500 flex flex-wrap gap-4 items-center">
                                <span className="flex items-center"><Building className="h-4 w-4 mr-1" /> {job.companyName}</span>
                                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Applied: {date}</span>
                                {job.matchScore > 0 && (
                                    <span className="flex items-center text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-medium">
                                        <Star className="h-4 w-4 mr-1" /> {job.matchScore}% Match
                                    </span>
                                )}
                                {job.interviewDate && (
                                    <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full font-medium">
                                        <Calendar className="h-4 w-4 mr-1" /> Interview: {new Date(job.interviewDate).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 mb-2">Notes</dt>
                            {isEditing ? (
                                <textarea name="notes" rows={3} value={editForm?.notes || ''} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            ) : (
                                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                                    {job.notes || <span className="text-gray-400 italic">No notes added.</span>}
                                </dd>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-indigo-600 mb-2 flex items-center">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Job Link
                            </dt>
                            {isEditing ? (
                                <input type="url" name="jobLink" value={editForm?.jobLink || ''} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            ) : job.jobLink ? (
                                <dd className="mt-1 text-sm text-gray-900 bg-indigo-50 border border-indigo-100 p-3 rounded-md">
                                    <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline break-all">
                                        {job.jobLink}
                                    </a>
                                </dd>
                            ) : (
                                <dd className="mt-1 text-sm text-gray-400 italic bg-gray-50 p-3 rounded-md">No link provided.</dd>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-700 mb-2">Job Description</dt>
                            {isEditing ? (
                                <textarea name="jobDescription" rows={8} value={editForm?.jobDescription || ''} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            ) : (
                                <dd className="mt-1 text-sm text-gray-700 bg-blue-50/50 border border-blue-100 p-4 rounded-md whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                                    {job.jobDescription || <span className="text-gray-400 italic">No description provided.</span>}
                                </dd>
                            )}
                        </div>
                    </dl>

                    {isEditing && (
                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditForm(job); // revert
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
