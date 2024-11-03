import React, { useEffect, useRef, useState } from 'react';
import { addMinutes, differenceInMinutes, format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Appointment } from '@/types/planner-types';
import { COLUMN_WIDTH, DATE_FORMATS } from '@/utils/planner-constants';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { GripVertical } from 'lucide-react';


interface PlannerAppointmentProps {
    appointment: Appointment;
    resourceId: string;
    columnIndex: number;
    onResize: (appointment: Appointment, newStart: Date, newEnd: Date) => void;
    onDragStart?: (appointment: Appointment) => void;
}

type ResizeHandle = 'start' | 'end' | null;

const PlannerAppointment = ({
    appointment,
    resourceId,
    columnIndex,
    onResize,
    onDragStart
}: PlannerAppointmentProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const startHandleRef = useRef<HTMLDivElement>(null);
    const endHandleRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
    const [previewTime, setPreviewTime] = useState<{ start?: Date; end?: Date }>({});

    // Calculate appointment position and dimensions
    const getAppointmentStyle = () => {
        const start = previewTime.start || appointment.start;
        const end = previewTime.end || appointment.end;

        const startHour = Number(format(start, 'H'));
        const startMinutes = Number(format(start, 'm')) / 60;
        const durationInHours = differenceInMinutes(end, start) / 60;

        return {
            left: `${(startHour + startMinutes) * COLUMN_WIDTH}px`,
            width: `${durationInHours * COLUMN_WIDTH}px`,
            height: '80%',
            top: '10%',
            position: 'absolute' as const,
            backgroundColor: appointment.color ?? '#3b82f6'
        };
    };

    useEffect(() => {
        const element = ref.current!;
    
        const cleanup1 = draggable({
            element,
            getInitialData: () => ({
                appointmentId: appointment.id,
                sourceResourceId: resourceId,
                columnIndex: columnIndex,
                type: 'appointment'
            }),
            onGenerateDragPreview: ({ nativeSetDragImage }) => {
                if (nativeSetDragImage && element) {
                    // Create a clone for the drag preview
                    const clone = element.cloneNode(true) as HTMLElement;
                    clone.style.opacity = '0.5';
                    document.body.appendChild(clone);

                    nativeSetDragImage(clone, 0, 0);

                    // Clean up the clone
                    requestAnimationFrame(() => {
                        document.body.removeChild(clone);
                    });
                }
            },
            onDragStart: () => {
                setIsDragging(true);
                onDragStart?.(appointment);
            },
            onDrag: () => {
                // Keep isDragging state during drag
                setIsDragging(true);
            },
            onDrop: () => {
                setIsDragging(false);
            },
        });

        // Start handle draggable
        const startHandle = startHandleRef.current!;
        const cleanup2 = draggable({
            element: startHandle,
            getInitialData: () => ({
                appointmentId: appointment.id,
                type: 'resize-start',
                originalStart: appointment.start,
                originalEnd: appointment.end
            }),
            onDragStart: () => setIsResizing('start'),
            onDrag: ({ location }) => {
                const { input } = location.current;
                const containerRect = ref.current?.parentElement?.getBoundingClientRect();
                if (!containerRect) return;

                // Calculate time based on mouse position relative to container
                const relativeX = input.clientX - containerRect.left;
                const hourOffset = Math.floor(relativeX / COLUMN_WIDTH);
                const minuteOffset = Math.round((relativeX % COLUMN_WIDTH) / (COLUMN_WIDTH / 4)) * 15;

                const newStart = new Date(appointment.start);
                newStart.setHours(hourOffset, minuteOffset, 0);

                if (newStart < appointment.end) {
                    setPreviewTime(prev => ({ ...prev, start: newStart }));
                }
            },
            onDrop: () => {
                setIsResizing(null);
                if (previewTime.start) {
                    onResize(appointment, previewTime.start, appointment.end);
                    setPreviewTime({});
                }
            },
        });

        // End handle draggable
        const endHandle = endHandleRef.current!;
        const cleanup3 = draggable({
            element: endHandle,
            getInitialData: () => ({
                appointmentId: appointment.id,
                type: 'resize-end',
                originalStart: appointment.start,
                originalEnd: appointment.end
            }),
            onDragStart: () => setIsResizing('end'),
            onDrag: ({ location }) => {
                const { input } = location.current;
                const containerRect = ref.current?.parentElement?.getBoundingClientRect();
                if (!containerRect) return;

                // Calculate time based on mouse position relative to container
                const relativeX = input.clientX - containerRect.left;
                const hourOffset = Math.floor(relativeX / COLUMN_WIDTH);
                const minuteOffset = Math.round((relativeX % COLUMN_WIDTH) / (COLUMN_WIDTH / 4)) * 15;

                const newEnd = new Date(appointment.end);
                newEnd.setHours(hourOffset, minuteOffset, 0);

                if (newEnd > appointment.start) {
                    setPreviewTime(prev => ({ ...prev, end: newEnd }));
                }
            },
            onDrop: () => {
                setIsResizing(null);
                if (previewTime.end) {
                    onResize(appointment, appointment.start, previewTime.end);
                    setPreviewTime({});
                }
            },
        });

        return () => {
            cleanup1();
            cleanup2();
            cleanup3();
        };
    }, [appointment, resourceId, columnIndex, onDragStart, onResize]);


    return (
        <div
            ref={ref}
            style={getAppointmentStyle()}
            className={cn(
                "rounded-md p-2",
                "hover:ring-2 hover:ring-primary",
                "cursor-grab active:cursor-grabbing",
                "relative group",
                (isDragging || isResizing) && "opacity-50 ring-2 ring-primary",
                "text-sm text-white transition-all"
            )}
            
        >
            {/* Start resize handle */}
            <div
                ref={startHandleRef}
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize",
                    "opacity-0 group-hover:opacity-100",
                    "hover:bg-primary/20"
                )}
            >
                <GripVertical className="h-4 w-4 absolute top-1/2 -translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Content */}
            <div className="font-medium truncate">{appointment.title}</div>
            <div className="text-xs opacity-90">
                {format(previewTime.start || appointment.start, DATE_FORMATS.HOUR)} -
                {format(previewTime.end || appointment.end, DATE_FORMATS.HOUR)}
            </div>

            {/* End resize handle */}
            <div
                ref={endHandleRef}
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize",
                    "opacity-0 group-hover:opacity-100",
                    "hover:bg-primary/20"
                )}
            >
                <GripVertical className="h-4 w-4 absolute top-1/2 -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
};

export default PlannerAppointment;