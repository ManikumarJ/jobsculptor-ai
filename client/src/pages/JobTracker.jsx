import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from '../components/kanban/Column';
import { JobCard } from '../components/kanban/JobCard';
import { Plus } from 'lucide-react';

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const JobTracker = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        jobLink: '',
        status: 'Saved',
        matchScore: ''
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/jobs');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Determine the column over
        const activeColumn = active.data.current?.sortable?.containerId;
        const overColumn = typeof overId === 'string' && COLUMNS.includes(overId)
            ? overId
            : over.data.current?.sortable?.containerId;

        if (!overColumn) return;

        // Same column, just reordering visually (simplified for Kanban)
        if (activeColumn === overColumn && activeId !== overId) {
            setJobs((jobs) => {
                const oldIndex = jobs.findIndex(j => j._id === activeId);
                const newIndex = jobs.findIndex(j => j._id === overId);
                return arrayMove(jobs, oldIndex, newIndex);
            });
            return;
        }

        // Moving between columns
        if (activeColumn !== overColumn) {
            // Optimistic update
            setJobs((jobs) => {
                return jobs.map((job) => {
                    if (job._id === activeId) {
                        return { ...job, status: overColumn };
                    }
                    return job;
                });
            });

            // API call to update status
            try {
                await axios.put(`http://localhost:5000/api/jobs/${activeId}`, {
                    status: overColumn
                });
            } catch (err) {
                console.error('Failed to update job status', err);
                // Revert on failure
                fetchJobs();
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/jobs', {
                ...formData,
                matchScore: formData.matchScore ? parseInt(formData.matchScore) : 0
            });
            setJobs([res.data, ...jobs]);
            setShowModal(false);
            setFormData({ companyName: '', jobTitle: '', jobDescription: '', jobLink: '', status: 'Saved', matchScore: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateJob = async (updatedJob) => {
        try {
            await axios.put(`http://localhost:5000/api/jobs/${updatedJob._id}`, updatedJob);
            setJobs(jobs.map(j => j._id === updatedJob._id ? updatedJob : j));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 min-h-[calc(100vh-64px)] flex items-center justify-center">Loading your board...</div>;

    const activeJob = activeId ? jobs.find(job => job._id === activeId) : null;

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50">
            <div className="px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md flex justify-between items-center shadow-sm z-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Job Tracker</h1>
                    <p className="text-sm text-gray-500 mt-1">Drag and drop applications across stages.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                    <Plus className="h-4 w-4 mr-1.5" /> Add Job
                </button>
            </div>

            <div className="flex-1 overflow-x-auto p-6 hidden-scrollbar">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 h-full min-w-max pb-4">
                        {COLUMNS.map((stage) => (
                            <Column
                                key={stage}
                                id={stage}
                                title={stage}
                                jobs={jobs.filter(job => job.status === stage)}
                                onDelete={handleDeleteJob}
                                onUpdateJob={handleUpdateJob}
                            />
                        ))}
                    </div>
                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.4',
                                },
                            },
                        }),
                    }}>
                        {activeJob ? <JobCard job={activeJob} onDelete={() => { }} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Add Job Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8 border border-gray-100">
                            <div>
                                <h3 className="text-xl leading-6 font-bold text-gray-900 font-display">Add New Application</h3>
                                <p className="text-sm text-gray-500 mt-2 border-b border-gray-100 pb-4">Keep track of a new opportunity by adding it to your board.</p>
                                <div className="mt-4 text-left">
                                    <form onSubmit={handleAddJob} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input type="text" name="companyName" required value={formData.companyName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors" placeholder="e.g. Google" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                            <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors" placeholder="e.g. Frontend Developer" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Job URL / Link (Optional)</label>
                                            <input type="url" name="jobLink" placeholder="https://..." value={formData.jobLink} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description / Keywords (Optional)</label>
                                            <textarea name="jobDescription" rows={3} value={formData.jobDescription} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors resize-none" placeholder="Brief notes about the role..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                                <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors">
                                                    {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Match Score (Optional %)</label>
                                                <input type="number" name="matchScore" placeholder="e.g. 85" min="0" max="100" value={formData.matchScore} onChange={handleInputChange} className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors" />
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-100 sm:flex sm:flex-row-reverse">
                                            <button type="submit" className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-500 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-all">Save Job</button>
                                            <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-all">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobTracker;
