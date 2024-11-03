import { addDays, addHours, startOfDay } from 'date-fns';
import { Resource, Appointment } from '@/models';

// Mock Resources
export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    role: 'Cardiologist',
    avatar: '/api/placeholder/32/32',
    type: 'person',
    details: {
      department: 'Cardiology',
      specialization: 'Interventional Cardiology'
    }
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    role: 'Neurologist',
    avatar: '/api/placeholder/32/32',
    type: 'person',
    details: {
      department: 'Neurology',
      specialization: 'Clinical Neurology'
    }
  },
  {
    id: '3',
    name: 'MRI Scanner Room',
    role: 'Imaging',
    avatar: '/api/placeholder/32/32',
    type: 'room',
    details: {
      location: 'Floor 2',
      equipment: 'Siemens Magnetom'
    }
  },
  {
    id: '4',
    name: 'Surgery Room A',
    role: 'Operating Room',
    avatar: '/api/placeholder/32/32',
    type: 'room',
    details: {
      location: 'Floor 3',
      capacity: '10 people'
    }
  }
];

// Generate mock appointments for today
const generateMockAppointments = (baseDate: Date): Appointment[] => {
  const startOfToday = startOfDay(baseDate);
  
  return [
    {
      id: '1',
      title: 'Patient Consultation',
      description: 'Initial consultation with patient regarding heart condition',
      start: addHours(startOfToday, 9), // 9 AM
      end: addHours(startOfToday, 10),   // 10 AM
      resourceId: '1', // Dr. Sarah Smith
      color: '#3b82f6', // blue
      type: 'consultation',
      details: {
        patientName: 'Alice Johnson',
        type: 'Initial Consultation'
      },
      order: 0
    },
    {
      id: '2',
      title: 'MRI Scan',
      description: 'Routine MRI scan for diagnostic purposes',
      start: addHours(startOfToday, 10), // 10 AM
      end: addHours(startOfToday, 11),   // 11 AM
      resourceId: '3', // MRI Scanner Room
      color: '#10b981', // green
      type: 'procedure',
      details: {
        patientName: 'Bob Wilson',
        type: 'Diagnostic'
      },
      order: 0
    },
    {
      id: '3',
      title: 'Surgery Prep',
      description: 'Pre-surgery preparation and room setup',
      start: addHours(startOfToday, 11), // 11 AM
      end: addHours(startOfToday, 13),   // 1 PM
      resourceId: '4', // Surgery Room A
      color: '#ef4444', // red
      type: 'surgery',
      details: {
        procedure: 'Cardiac Surgery',
        team: 'Team A'
      },
      order: 0
    },
    {
      id: '4',
      title: 'Neurological Assessment',
      description: 'Follow-up neurological assessment',
      start: addHours(startOfToday, 14), // 2 PM
      end: addHours(startOfToday, 15),   // 3 PM
      resourceId: '2', // Dr. John Doe
      color: '#f59e0b', // amber
      type: 'assessment',
      details: {
        patientName: 'Carol Martinez',
        type: 'Follow-up'
      },
      order: 0
    },
    {
      id: '5',
      title: 'Emergency Consultation',
      description: 'Emergency cardiac consultation',
      start: addHours(startOfToday, 15), // 3 PM
      end: addHours(startOfToday, 16),   // 4 PM
      resourceId: '1', // Dr. Sarah Smith
      color: '#3b82f6', // blue
      type: 'emergency',
      details: {
        patientName: 'David Brown',
        type: 'Emergency'
      },
      order: 0
    }
  ];
};

export const getMockAppointments = (date: Date): Appointment[] => {
  // Generate appointments for today and next two days
  return [
    ...generateMockAppointments(date),
    ...generateMockAppointments(addDays(date, 1)),
    ...generateMockAppointments(addDays(date, 2))
  ];
};