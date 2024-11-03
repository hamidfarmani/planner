import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { addDays, addMinutes, differenceInMinutes, startOfDay } from 'date-fns';
import { ViewType, Resource, Appointment } from '@/types/planner-types';
import { getMockAppointments, mockResources } from '@/components/planner/mockData';


interface PlannerContextState {
    currentDate: Date;
    view: ViewType;
    resources: Resource[];
    selectedResources: string[];
    appointments: Appointment[];
    isLoading: boolean;
    searchTerm: string;
}

interface PlannerContextValue extends PlannerContextState {
    setCurrentDate: (date: Date) => void;
    setView: (view: ViewType) => void;
    toggleResource: (resourceId: string) => void;
    setSearchTerm: (term: string) => void;
    loadAppointments: (start: Date, end: Date) => Promise<void>;
    updateAppointment: (appointment: Appointment) => void;
    handleAppointmentUpdate: (
        appointment: Appointment,
        newStart: Date,
        newResourceId: string
    ) => void;
    handleAppointmentResize: (
        appointment: Appointment,
        newStart: Date,
        newEnd: Date
    ) => void;
}

const PlannerContext = createContext<PlannerContextValue | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<PlannerContextState>({
        currentDate: new Date(),
        view: 'day',
        resources: mockResources,
        selectedResources: mockResources.map(r => r.id), // All selected by default
        appointments: [],
        isLoading: false,
        searchTerm: '',
    });

    const loadAppointments = useCallback(async (start: Date, end: Date) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const appointments = getMockAppointments(start);
            setState(prev => ({ ...prev, appointments }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const handleAppointmentUpdate = (
        appointment: Appointment,
        newStart: Date,
        newResourceId: string
    ) => {
        // Calculate duration to maintain the same length
        const duration = differenceInMinutes(appointment.end, appointment.start);

        const updatedAppointment = {
            ...appointment,
            start: newStart,
            end: addMinutes(newStart, duration),
            resourceId: newResourceId
        };

        updateAppointment(updatedAppointment);
    };

    const handleAppointmentResize = (
        appointment: Appointment,
        newStart: Date,
        newEnd: Date
    ) => {
        const updatedAppointment = {
            ...appointment,
            start: newStart,
            end: newEnd,
        };

        updateAppointment(updatedAppointment);
    };

    const toggleResource = useCallback((resourceId: string) => {
        setState(prev => ({
            ...prev,
            selectedResources: prev.selectedResources.includes(resourceId)
                ? prev.selectedResources.filter(id => id !== resourceId)
                : [...prev.selectedResources, resourceId]
        }));
    }, []);

    const updateAppointment = useCallback((appointment: Appointment) => {
        setState(prev => ({
            ...prev,
            appointments: prev.appointments.map(app =>
                app.id === appointment.id ? appointment : app
            )
        }));
    }, []);

    const value = useMemo(() => ({
        ...state,
        setCurrentDate: (date: Date) => setState(prev => ({ ...prev, currentDate: date })),
        setView: (view: ViewType) => setState(prev => ({ ...prev, view })),
        toggleResource,
        setSearchTerm: (term: string) => setState(prev => ({ ...prev, searchTerm: term })),
        loadAppointments,
        updateAppointment,
        handleAppointmentUpdate,
        handleAppointmentResize
    }), [state, toggleResource, loadAppointments, updateAppointment, handleAppointmentUpdate,]);

    return (
        <PlannerContext.Provider value={value}>
            {children}
        </PlannerContext.Provider>
    );
};

export const usePlanner = () => {
    const context = useContext(PlannerContext);
    if (!context) {
        throw new Error('usePlanner must be used within a PlannerProvider');
    }
    return context;
};