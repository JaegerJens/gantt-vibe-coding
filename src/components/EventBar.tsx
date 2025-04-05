import { Event } from '@/data/Events';

// Helper Function (Remains the same)
const timeToMinutes = (time: Date): number => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return hours * 60 + minutes;
};

export interface EventBarProps {
    event: Event;
    timelineWidth: number;
    totalMinutesInDay: number;
    personName: string;
}


const EventBar: React.FC<EventBarProps> = ({ event, timelineWidth, totalMinutesInDay, personName }) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const durationMinutes = Math.max(0, endMinutes - startMinutes);

    const leftPx = (startMinutes / totalMinutesInDay) * timelineWidth;
    const widthPx = (durationMinutes / totalMinutesInDay) * timelineWidth;

    const bgColor = event.color || 'bg-blue-500';

    return (
        <div
            key={event.id}
            className={`event-bar absolute top-1 bottom-1 rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap ${bgColor}`}
            style={{
                left: `${leftPx}px`,
                width: `${widthPx}px`,
                minWidth: '1px',
                maxWidth: `calc(100% - ${leftPx}px)`,
            }}
            title={`${personName}: ${event.name} (${event.startTime} - ${event.endTime})`}
        >
            <span className="truncate">{event.name}</span>
        </div>
    );
}

export default EventBar;