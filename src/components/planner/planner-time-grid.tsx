import React from 'react';
import { differenceInMinutes, format } from 'date-fns';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Appointment, Resource } from '@/types/planner-types';
import { COLUMN_WIDTH, ROW_HEIGHT, DATE_FORMATS } from '@/utils/planner-constants';
import PlannerAppointment from './planner-appointment';
import TimeGridCell from './planner-time-cell';


interface PlannerTimeGridProps {
    virtualHours: Date[];
    resources: Resource[];
    selectedResources: string[];
    appointments: Appointment[];
    isLoading?: boolean;
    onAppointmentUpdate: (appointment: Appointment, newStart: Date, newResourceId: string) => void;
    onResize: (appointment: Appointment, newStart: Date, newEnd: Date) => void;
}

const PlannerTimeGrid = ({
    virtualHours,
    resources,
    selectedResources,
    appointments,
    isLoading,
    onAppointmentUpdate,
    onResize,
}: PlannerTimeGridProps) => {
    const handleDrop = (hour: Date, resourceId: string, dragData: any) => {
        const appointment = appointments.find(a => a.id === dragData.appointmentId);
        if (appointment) {
            onAppointmentUpdate(appointment, hour, resourceId);
        }
    };

    const handleResize = (appointment: Appointment, newStart: Date, newEnd: Date) => {
        // Validate the resize
        if (newStart >= newEnd) return;

        // Check minimum duration (e.g., 30 minutes)
        const minDuration = 30;
        const durationInMinutes = differenceInMinutes(newEnd, newStart);
        if (durationInMinutes < minDuration) return;

        onResize(appointment, newStart, newEnd);
    };

    const renderTimeHeader = () => (
        <div className="sticky top-0 z-20 flex bg-background border-b">
            <div className="flex flex-1">
                {virtualHours.map((hour) => (
                    <div
                        key={hour.getTime()}
                        className="flex-shrink-0 p-4 text-center border-r"
                        style={{ width: COLUMN_WIDTH }}
                    >
                        {format(hour, DATE_FORMATS.HOUR)}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResourceRows = () => (
        <>
            {resources.map(resource => (
                <div
                    key={resource.id}
                    className={cn(
                        "relative border-b",
                        selectedResources.includes(resource.id) ? 'block' : 'hidden',
                        isLoading && 'opacity-50'
                    )}
                    style={{ height: ROW_HEIGHT }}
                >
                    {/* Time Grid Cells */}
                    <div className="absolute inset-0 flex">
                        {virtualHours.map((hour, index) => (
                            <TimeGridCell
                                key={hour.getTime()}
                                hour={hour}
                                resourceId={resource.id}
                                columnIndex={index}
                                onDrop={handleDrop}
                            />
                        ))}
                    </div>

                    {/* Appointments */}
                    {appointments
                        .filter(appt => appt.resourceId === resource.id)
                        .map(appointment => (
                            <PlannerAppointment
                                key={appointment.id}
                                appointment={appointment}
                                resourceId={resource.id}
                                columnIndex={virtualHours.findIndex(h =>
                                    format(h, 'HH') === format(appointment.start, 'HH')
                                )}
                                onResize={handleResize}
                            />
                        ))}
                </div>
            ))}
        </>
    );

    return (
        <ScrollArea className="flex-1">
            <div style={{ minWidth: virtualHours.length * COLUMN_WIDTH }}>
                {renderTimeHeader()}
                {renderResourceRows()}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default PlannerTimeGrid;