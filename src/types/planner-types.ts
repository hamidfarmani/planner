export interface Resource {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  }
  
  export interface Appointment {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    resourceId: string;
    color?: string;
    type?: string;
  }
  
  export type ViewType = 'day' | 'week' | 'month';
  
  export interface TimeRange {
    start: Date;
    end: Date;
  }
  
  export interface DragInfo {
    appointment: Appointment;
    sourceResource: string;
    targetResource?: string;
    targetHour?: Date;
  }