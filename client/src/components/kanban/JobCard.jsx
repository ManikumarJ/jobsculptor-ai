import React, { useState } from 'react';
import { Building, Calendar, Trash2, Clock, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JobCard = ({ job, onDelete, onUpdateJob }) => {
    const navigate = useNavigate();
    const [isEditingDate, setIsEditingDate] = useState(false);

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

    const [tempDate, setTempDate] = useState(formatDateTimeForInput(job.interviewDate));

    const date = new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    const handleSaveDate = (e) => {
        e.stopPropagation();
        if (onUpdateJob) {
            onUpdateJob({ ...job, interviewDate: tempDate || null, reminderSent: false });
        }
        setIsEditingDate(false);
    };

    return (
        <div
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="bg-white p-4 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:border-brand-200 transition-all duration-200 group relative cursor-pointer flex flex-col gap-3"
        >
            <div className="flex justify-between items-start gap-2">
                <h4 className="font-semibold text-gray-900 text-sm hover:text-brand-600 transition-colors line-clamp-2 pr-4">{job.jobTitle}</h4>
                <button
                    onPointerDown={(e) => {
                        e.stopPropagation(); // Prevent drag from triggering
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job._id);
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-4 bg-white/80 rounded-full p-1"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center text-xs text-gray-500 font-medium">
                    <Building className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{job.companyName}</span>
                </div>

                <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
                    <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        {date}
                    </div>

                    {job.matchScore > 0 && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${job.matchScore >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            job.matchScore >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {job.matchScore}% Match
                        </span>
                    )}
                </div>

                {/* Inline Editing for Interview Date */}
                <div className="mt-2 border-t border-gray-100 pt-2" onClick={(e) => e.stopPropagation()}>
                    {isEditingDate ? (
                        <div className="flex flex-col gap-2">
                            <input
                                type="datetime-local"
                                value={tempDate}
                                onChange={(e) => setTempDate(e.target.value)}
                                onPointerDown={(e) => e.stopPropagation()} // stop DND grab
                                className="w-full border border-brand-200 rounded-md text-xs py-1.5 px-2 bg-brand-50/30 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveDate}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] uppercase font-bold py-1.5 rounded flex items-center justify-center transition-colors"
                                >
                                    <Check className="h-3 w-3 mr-1" /> Save
                                </button>
                                <button
                                    onClick={() => { setIsEditingDate(false); setTempDate(formatDateTimeForInput(job.interviewDate)); }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="px-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] uppercase font-bold rounded flex items-center justify-center transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        job.interviewDate ? (
                            <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-md p-1.5 hover:bg-indigo-100 transition-colors cursor-pointer" onClick={() => setIsEditingDate(true)}>
                                <div className="flex items-center text-[11px] font-semibold text-indigo-700">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {new Date(job.interviewDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(job.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-start">
                                <button
                                    onClick={() => setIsEditingDate(true)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="text-[10px] uppercase font-bold tracking-wider text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 py-1 px-2.5 rounded-md flex items-center transition-colors"
                                >
                                    + Set Date
                                </button>
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};
