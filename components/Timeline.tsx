
import React from 'react';
import { TimelineEvent } from '../types';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return <p className="text-textSecondary text-center py-8">No timeline events found for this member.</p>;
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -z-0"></div>
      
      <div className="space-y-8">
        {events.map((event) => (
          <TimelineItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
