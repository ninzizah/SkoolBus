
import { z } from 'zod';

// Parent Schemas and Types
export const parentFormSchema = z.object({
  name: z.string().min(2, "Izina rigomba kuba nibura inyuguti 2."),
  email: z.string().email("Email ntiyemewe."),
  phoneNumber: z.string()
    .min(10, "Nimero ya telefoni igomba kuba nibura imibare 10.")
    .regex(/^\+?[0-9\s-()xX.]*$/, "Imiterere ya nimero ya telefoni ntiyemewe. Yemera imibare, umwanya, utumenyetso nka -, (), ., na 'x' ku kwagura nimero.")
    .optional(),
  address: z.string().min(5, "Aderesi igomba kuba nibura inyuguti 5.").optional(),
});
export type ParentFormData = z.infer<typeof parentFormSchema>;

export interface Parent extends ParentFormData {
  id: string;
  childrenCount: number;
}

// Child Schemas and Types
export const childFormSchema = z.object({
  name: z.string().min(2, "Izina rigomba kuba nibura inyuguti 2."),
  age: z.coerce.number().int().positive("Imyaka igomba kuba umubare usumba zeru.").min(1, "Imyaka igomba kuba nibura 1."),
  classGrade: z.string().min(1, "Umwaka/Ishami birakenewe."),
  photoDataUrl: z.string().optional().describe("Data URI y'ifoto y'umwana. Imiterere iteganyijwe: 'data:<mimetype>;base64,<encoded_data>'."),
  parentId: z.string().min(1, "Guhitamo umubyeyi birakenewe."),
  schoolId: z.string().min(1, "Guhitamo ishuri birakenewe."),
  assignedRouteId: z.string().optional(),
});
export type ChildFormData = z.infer<typeof childFormSchema>;

export type ChildAttendanceStatus = 'Pending' | 'Picked Up' | 'Dropped Off' | 'Absent';


export interface Child extends Omit<ChildFormData, 'photoDataUrl' | 'assignedRouteId' | 'parentId' | 'schoolId'>{
  id: string;
  parentId: string;
  parentName?: string;
  photoDataUrl?: string;
  schoolId: string;
  schoolName?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  lastAttendanceStatus?: ChildAttendanceStatus;
  lastAttendanceTimestamp?: string;
}

// Bus Route Types
export interface BusRoute {
  id: string;
  name: string;
  pickupTime: string;
  driverName: string;
}

// Driver Dashboard Types
export interface ChildAttendance {
  id: string;
  name: string;
  status: ChildAttendanceStatus;
}
export interface RouteStop {
  id: string;
  name: string;
  time: string;
  children: ChildAttendance[];
}

export interface AssignedRoute {
  id: string;
  routeName: string;
  driverName: string;
  busNumber: string;
  stops: RouteStop[];
}

// Admin - School Management Schemas and Types
export const schoolFormSchema = z.object({
  name: z.string().min(3, "Izina ry'ishuri rigomba kuba nibura inyuguti 3."),
  address: z.string().min(5, "Aderesi igomba kuba nibura inyuguti 5."),
  contactPhone: z.string()
    .min(10, "Telefoni igomba kuba nibura imibare 10.")
    .regex(/^\+?[0-9\s-()xX.]*$/, "Imiterere ya nimero ya telefoni ntiyemewe."),
  contactEmail: z.string().email("Email ntiyemewe."),
});
export type SchoolFormData = z.infer<typeof schoolFormSchema>;

export interface School extends SchoolFormData {
  id: string;
}

// Sign Up Schemas and Types
export const signupFormSchema = z.object({
  fullName: z.string().min(2, "Amazina yuzuye agomba kuba nibura inyuguti 2."),
  email: z.string().email("Email ntiyemewe."),
  password: z.string().min(8, "Ijambobanga rigomba kuba nibura inyuguti 8."),
  role: z.enum(["parent", "school_representative", "driver"], {
    required_error: "Ugomba guhitamo uruhare rwawe.",
  }),
});
export type SignupFormData = z.infer<typeof signupFormSchema>;

// Login Schemas and Types
export const loginFormSchema = z.object({
  email: z.string().email("Email ntiyemewe."),
  password: z.string().min(1, "Ijambobanga rirakenewe."),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;

// Forgot Password Schemas
export const forgotPasswordEmailSchema = z.object({
  email: z.string().email({ message: "Email ntiyemewe." }),
});
export type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export const forgotPasswordTokenSchema = z.object({
  token: z.string().min(1, { message: "Agaciro karakenewe." }),
});
export type ForgotPasswordTokenFormData = z.infer<typeof forgotPasswordTokenSchema>;

export const forgotPasswordNewPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: "Ijambobanga rigomba kuba nibura inyuguti 8." }),
  confirmNewPassword: z.string().min(8, { message: "Kwemeza ijambobanga rigomba kuba nibura inyuguti 8." }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Amajambobanga ntabwo ahuye.",
  path: ["confirmNewPassword"],
});
export type ForgotPasswordNewPasswordFormData = z.infer<typeof forgotPasswordNewPasswordSchema>;
