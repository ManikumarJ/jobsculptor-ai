import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableJobCard } from './SortableJobCard';

export const Column = ({ id, title, jobs, onDelete, onUpdateJob }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col bg-gray-50/80 rounded-2xl w-80 flex-shrink-0 border border-gray-100 h-full backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
            <div className="p-4 border-b border-gray-100 bg-white/50 rounded-t-2xl flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 font-display text-base">{title}</span>
                    <span className="bg-brand-50 text-brand-700 font-medium py-0.5 px-2.5 rounded-full text-xs border border-brand-100">{jobs.length}</span>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-4 overflow-y-auto min-h-[150px] transition-colors"
            >
                <SortableContext
                    id={id}
                    items={jobs.map(j => j._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <SortableJobCard key={job._id} job={job} onDelete={onDelete} onUpdateJob={onUpdateJob} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};
