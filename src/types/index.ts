import { z } from 'zod';

// Parent Schemas and Types
export const parentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});
export type ParentFormData = z.infer<typeof parentFormSchema>;

export interface Parent extends ParentFormData {
  id: string;
  childrenCount: number;
}

// Child Schemas and Types
export const childFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().int().positive("Age must be a positive number.").min(1, "Age must be at least 1."),
  school: z.string().min(3, "School name is required."),
  classGrade: z.string().min(1, "Class/Grade is required."),
  photoDataUrl: z.string().optional().describe("A data URI of the child's photo. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  parentId: z.string().uuid("Valid parent ID is required."),
});
export type ChildFormData = z.infer<typeof childFormSchema>;

export interface Child extends Omit<ChildFormData, 'photoDataUrl'>{
  id: string;
  parentName?: string; // Denormalized for display
  photoDataUrl?: string; // Optional: URL or data URI of the photo
  classGrade: string;
}


// Route and Stop Types for Driver Dashboard
export interface ChildAttendance {
  id: string;
  name: string;
  status: 'Pending' | 'Picked Up' | 'Dropped Off';
}
export interface RouteStop {
  id: string;
  name: string; // e.g., "123 Main St" or "Oakwood Elementary"
  time: string; // e.g., "07:15 AM"
  children: ChildAttendance[];
}

export interface AssignedRoute {
  id: string;
  routeName: string; // e.g., "Route A - Morning"
  driverName: string;
  busNumber: string;
  stops: RouteStop[];
}
