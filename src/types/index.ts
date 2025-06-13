
import { z } from 'zod';

// Parent Schemas and Types
export const parentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\+?[0-9\s-()xX.]*$/, "Invalid phone number format. Allows digits, spaces, hyphens, parentheses, dots, and 'x' for extensions.")
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters.").optional(),
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
  classGrade: z.string().min(1, "Class/Grade is required."),
  photoDataUrl: z.string().optional().describe("A data URI of the child's photo. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  parentId: z.string().uuid("Valid parent ID is required."),
  schoolId: z.string().min(1, "School selection is required."),
  assignedRouteId: z.string().optional(),
});
export type ChildFormData = z.infer<typeof childFormSchema>;

export interface Child extends Omit<ChildFormData, 'photoDataUrl' | 'assignedRouteId' | 'parentId' | 'schoolId'>{
  id: string;
  parentId: string;
  parentName?: string;
  photoDataUrl?: string;
  schoolId: string;
  schoolName?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
}

// Bus Route Types
export interface BusRoute {
  id: string;
  name: string;
  pickupTime: string; // e.g., "07:30 AM"
  driverName: string;
}

// Driver Dashboard Types
export type ChildAttendanceStatus = 'Pending' | 'Picked Up' | 'Dropped Off';

export interface ChildAttendance {
  id: string; // Child's ID
  name: string;
  status: ChildAttendanceStatus;
}
export interface RouteStop {
  id: string; // Stop ID, can be more generic like string
  name: string; // e.g., "123 Main St" or "Oakwood Elementary"
  time: string; // e.g., "07:15 AM"
  children: ChildAttendance[]; // List of children expected at this stop
}

export interface AssignedRoute {
  id: string; // Route ID
  routeName: string; // e.g., "Route A - Morning"
  driverName: string;
  busNumber: string;
  stops: RouteStop[];
}

// Admin - School Management Schemas and Types
export const schoolFormSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  contactPhone: z.string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\+?[0-9\s-()xX.]*$/, "Invalid phone number format. Allows digits, spaces, hyphens, parentheses, dots, and 'x' for extensions."),
  contactEmail: z.string().email("Invalid email address."),
});
export type SchoolFormData = z.infer<typeof schoolFormSchema>;

export interface School extends SchoolFormData {
  id: string;
}

// Sign Up Schemas and Types
export const signupFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["parent", "school_representative", "driver"], {
    required_error: "You must select a role.",
  }),
});
export type SignupFormData = z.infer<typeof signupFormSchema>;

