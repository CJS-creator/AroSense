import React from 'react';
import { TimelineEvent, TimelineEventType } from '../types';
import { IconDocument, IconPrescription, IconEmergency, IconCreditCard, IconVitals, IconSyringe, IconHeart, IconCalendar, IconDiagnoses } from '../constants';

interface TimelineItemProps {
  event: TimelineEvent;
}

const eventConfig: Record<TimelineEventType, { icon: React.FC<{className?: string}>; color: string; }> = {
  document: { icon: IconDocument, color: 'bg-primary-DEFAULT' },
  prescription: { icon: IconPrescription, color: 'bg-secondary-DEFAULT' },
  note: { icon: IconEmergency, color: 'bg-yellow-500' },
  bill: { icon: IconCreditCard, color: 'bg-green-500' },
  vital: { icon: IconVitals, color: 'bg-indigo-500'},
  vaccination: { icon: IconSyringe, color: 'bg-cyan-500' },
  wellness: { icon: IconHeart, color: 'bg-purple-500' },
  appointment: { icon: IconCalendar, color: 'bg-orange-500' },
  condition: { icon: IconDiagnoses, color: 'bg-rose-500' },
};

const criticalNoteColor = 'bg-danger';

export const TimelineItem: React.FC<TimelineItemProps> = ({ event }) => {
  const config = eventConfig[event.type];
  if (!config) {
    return null;
  }

  const { icon: Icon } = config;
  const isCriticalNote = event.type === 'note' && event.isCritical;
  const dotColor = isCriticalNote ? criticalNoteColor : config.color;
  const iconColor = isCriticalNote ? 'text-danger' : 'text-textSecondary';

  return (
    <div className="relative flex items-start">
      {/* Dot */}
      <div className="absolute -left-[34px] top-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-surface z-10">
        <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
      </div>
      
      <div className="pl-4">
        <p className="text-sm text-textSecondary">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="flex items-center mt-1">
          <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />
          <p className="font-semibold text-textPrimary">{event.title}</p>
        </div>
      </div>
    </div>
  );
};