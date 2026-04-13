import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobCard } from './JobCard';

export const SortableJobCard = ({ job, onDelete, onUpdateJob }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job._id, data: job });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative rounded-xl ${isDragging ? 'shadow-2xl ring-2 ring-brand-500 bg-brand-50/50 scale-[1.02] transition-transform' : ''}`}
        >
            <div {...attributes} {...listeners} className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : ''}`}>
                <JobCard job={job} onDelete={onDelete} onUpdateJob={onUpdateJob} />
            </div>
        </div>
    );
};
