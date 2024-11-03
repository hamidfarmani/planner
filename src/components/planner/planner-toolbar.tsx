import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ViewType } from '@/types/planner-types';
import { DATE_FORMATS } from '@/utils/planner-constants';
 

interface PlannerToolbarProps {
  currentDate: Date;
  view: ViewType;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onViewChange: (view: ViewType) => void;
}

const PlannerToolbar = ({
  currentDate,
  view,
  onNavigate,
  onViewChange,
}: PlannerToolbarProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onNavigate('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onNavigate('today')}
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onNavigate('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="font-medium">
        {format(currentDate, DATE_FORMATS.DATE)}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'day' ? 'default' : 'ghost'}
          onClick={() => onViewChange('day')}
        >
          Day
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'ghost'}
          onClick={() => onViewChange('week')}
        >
          Week
        </Button>
        <Button
          variant={view === 'month' ? 'default' : 'ghost'}
          onClick={() => onViewChange('month')}
        >
          Month
        </Button>
      </div>
    </div>
  );
};

export default PlannerToolbar;