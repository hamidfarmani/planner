
export type resourceType = 'room' | 'person' | 'equipment' | 'service' | 'other';

export interface Resource {
    id: string;
    name: string;
    role: string;
    avatar: string;
    
    type: resourceType;
    details: {[key:string]:any};
}