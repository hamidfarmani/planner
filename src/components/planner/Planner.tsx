"use client";;
import { useEffect, useState } from 'react';
import { addDays, startOfDay, addHours } from 'date-fns';
import { PlannerProvider, usePlanner } from '@/contexts/planner-context';
import PlannerToolbar from './planner-toolbar';
import PlannerResourceList from './planner-resource-list';
import PlannerTimeGrid from './planner-time-grid';
import { HOURS_TO_LOAD } from '@/utils/planner-constants';

const PlannerContent = () => {
  const {
    currentDate,
    view,
    resources,
    selectedResources,
    appointments,
    isLoading,
    searchTerm,
    setCurrentDate,
    setView,
    toggleResource,
    setSearchTerm,
    loadAppointments,
    handleAppointmentUpdate,
    handleAppointmentResize
  } = usePlanner();

  const [virtualHours, setVirtualHours] = useState<Date[]>([]);
 

  useEffect(() => {
    const initialHours = Array.from(
      { length: HOURS_TO_LOAD },
      (_, i) => addHours(startOfDay(currentDate), i)
    );
    setVirtualHours(initialHours);
  }, [currentDate]);

  useEffect(() => {
    if (virtualHours.length > 0 && virtualHours[0] !== undefined && virtualHours[virtualHours.length - 1] !== undefined) {
      loadAppointments(virtualHours[0] as Date, virtualHours[virtualHours.length - 1] as Date);
    }
  }, [virtualHours, loadAppointments]);

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    switch (direction) {
      case 'prev':
        setCurrentDate(addDays(currentDate, -1));
        break;
      case 'next':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'today':
        setCurrentDate(new Date());
        break;
    }
  };

 
  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <PlannerToolbar
          currentDate={currentDate}
          view={view}
          onNavigate={handleNavigate}
          onViewChange={setView}
        />

        <div className="flex-1 flex overflow-hidden">
          <PlannerResourceList
            resources={resources}
            selectedResources={selectedResources}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onResourceToggle={toggleResource}
          />

          <PlannerTimeGrid
            virtualHours={virtualHours}
            resources={resources}
            selectedResources={selectedResources}
            appointments={appointments}
            isLoading={isLoading}
            onAppointmentUpdate={handleAppointmentUpdate}
            onResize={handleAppointmentResize}
          />
        </div>
      </div>
    </div>
  );
};

const InfiniteScrollingPlanner = () => {
  return (
    <PlannerProvider>
      <PlannerContent />
    </PlannerProvider>
  );
};

export default InfiniteScrollingPlanner;