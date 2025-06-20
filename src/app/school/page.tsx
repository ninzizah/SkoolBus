
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School as SchoolIcon, Users, PlusCircle, Edit3, Trash2, Route as RouteIcon, UserCheck, BookOpenCheck, ClockIcon } from 'lucide-react';
import type { Child, School, BusRoute, ChildAttendanceStatus } from '@/types';
import EditStudentForm from '@/components/children/edit-student-form';
import type { EditStudentFormData } from '@/components/children/edit-student-form';
import { useToast } from "@/hooks/use-toast";

const allMockChildren: Child[] = [
  { id: 'c1', name: 'Leo Wonderland', age: 7, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p1', parentName: 'Alice Wonderland', classGrade: '2nd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=LW', assignedRouteId: 'sch1-route1', assignedRouteName: 'Wonderland Morning A', lastAttendanceStatus: 'Picked Up', lastAttendanceTimestamp: '2024-07-30 07:35 AM' },
  { id: 'c2', name: 'Mia Wonderland', age: 5, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p1', parentName: 'Alice Wonderland', classGrade: 'Kindergarten', photoDataUrl: undefined, assignedRouteId: 'sch1-route1', assignedRouteName: 'Wonderland Morning A', lastAttendanceStatus: 'Dropped Off', lastAttendanceTimestamp: '2024-07-30 08:10 AM' },
  { id: 'c3', name: 'Sam Construction', age: 8, schoolId: 'sch2', schoolName: 'Construction Academy', parentId: 'p2', parentName: 'Bob The Builder', classGrade: '3rd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=SC', assignedRouteId: undefined, assignedRouteName: undefined, lastAttendanceStatus: 'Pending', lastAttendanceTimestamp: 'N/A' },
  { id: 'c4', name: 'Lily Oakwood', age: 9, schoolId: 'sch3', schoolName: 'Oakwood High', parentId: 'p3', parentName: 'Charlie Brown', classGrade: '4th Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=LO', assignedRouteId: 'route2', assignedRouteName: 'Afternoon Comet Line', lastAttendanceStatus: 'Picked Up', lastAttendanceTimestamp: '2024-07-29 03:50 PM'},
  { id: 'c5', name: 'Max Wonderland', age: 6, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p4', parentName: 'Diana Prince', classGrade: '1st Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=MW', assignedRouteId: 'sch1-route2', assignedRouteName: 'Wonderland Afternoon B', lastAttendanceStatus: 'Absent', lastAttendanceTimestamp: '2024-07-30 07:00 AM' },
];

const currentSchool: Pick<School, 'id' | 'name'> = {
  id: 'sch1',
  name: 'Wonderland Elementary',
};

const initialMockSchoolRoutes: BusRoute[] = [
  { id: 'sch1-route1', name: 'Wonderland Morning A', pickupTime: '07:30 AM', driverName: 'Mr. Sunny' },
  { id: 'sch1-route2', name: 'Wonderland Afternoon B', pickupTime: '03:45 PM', driverName: 'Ms. Luna' },
  { id: 'sch1-route3', name: 'Wonderland Early Bird', pickupTime: '07:00 AM', driverName: 'To be assigned' },
];

const mockDrivers: { id: string; name: string }[] = [
    { id: 'driver1', name: 'Mr. Sunny' },
    { id: 'driver2', name: 'Ms. Luna' },
    { id: 'driver3', name: 'Capt. Reliable' },
    { id: 'driver4', name: 'Sgt. Speedy' },
    { id: 'driver5', name: 'Dr. Navigator' },
];


export default function SchoolPortalPage() {
  const [students, setStudents] = useState<Child[]>([]);
  const [schoolRoutes, setSchoolRoutes] = useState<BusRoute[]>(initialMockSchoolRoutes);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [isRouteManagementDialogOpen, setIsRouteManagementDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Child | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const schoolStudents = allMockChildren.filter(child => child.schoolId === currentSchool.id);
    setStudents(schoolStudents);
  }, []);

  const handleAddStudent = () => {
    const newStudentId = `new-c-${Math.random().toString(36).substring(2, 9)}`;
    const newStudent: Child = {
      id: newStudentId,
      name: `New Student ${newStudentId.substring(0,4)}`,
      age: 0, 
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      parentId: 'new-p-placeholder', 
      parentName: 'To be assigned',
      classGrade: 'To be assigned',
      photoDataUrl: `https://placehold.co/50x50.png?text=N`,
      assignedRouteId: undefined,
      assignedRouteName: undefined,
      lastAttendanceStatus: 'Pending',
      lastAttendanceTimestamp: new Date().toLocaleDateString(),
    };
    setStudents(prevStudents => [...prevStudents, newStudent]);
    toast({
      title: "Mock Student Added",
      description: `A new student profile for ${newStudent.name} has been added. Please use 'Edit' to update details.`
    });
  };

  const openEditStudentDialog = (student: Child) => {
    setEditingStudent(student);
    setIsEditStudentDialogOpen(true);
  };

  const handleUpdateStudent = (data: EditStudentFormData) => {
    if (!editingStudent) return;

    setStudents(prevStudents =>
      prevStudents.map(s =>
        s.id === editingStudent.id ? { ...s, ...data, age: Number(data.age) } : s
      )
    );
    setIsEditStudentDialogOpen(false);
    setEditingStudent(null);
    toast({ title: "Student Updated", description: `${data.name}'s details have been updated.` });
  };

  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find(student => student.id === studentId);
    if (!studentToDelete) return;

    if (window.confirm(`Are you sure you want to remove ${studentToDelete.name} from ${currentSchool.name}?`)) {
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      toast({ title: "Student Removed", description: `${studentToDelete.name} has been removed from this list.` });
    }
  };

  // Route Management Functions
  const handleAddSchoolRoute = () => {
    const newRouteName = window.prompt("Enter new route name:", "New School Route");
    if (newRouteName && newRouteName.trim() !== "") {
      const newRoute: BusRoute = {
        id: `sch-route-${Math.random().toString(36).substring(2, 9)}`,
        name: newRouteName.trim(),
        pickupTime: "08:00 AM", 
        driverName: "To be assigned", 
      };
      setSchoolRoutes(prev => [...prev, newRoute]);
      toast({ title: "Route Added", description: `Route "${newRoute.name}" added.` });
    } else if (newRouteName === "") {
      toast({ title: "Add Cancelled", description: "Route name cannot be empty.", variant: "destructive" });
    }
  };

  const handleEditSchoolRoute = (routeId: string) => {
    const routeToEdit = schoolRoutes.find(r => r.id === routeId);
    if (!routeToEdit) return;

    const newName = window.prompt("Enter new route name:", routeToEdit.name);
    if (newName && newName.trim() !== "") {
      setSchoolRoutes(prev => prev.map(r => r.id === routeId ? { ...r, name: newName.trim() } : r));
      toast({ title: "Route Updated", description: `Route name changed to "${newName.trim()}".` });
    } else if (newName === "") {
      toast({ title: "Update Cancelled", description: "Route name cannot be empty.", variant: "destructive" });
    }
  };

  const handleDeleteSchoolRoute = (routeId: string) => {
    const routeToDelete = schoolRoutes.find(r => r.id === routeId);
    if (!routeToDelete) return;

    if (window.confirm(`Are you sure you want to delete route "${routeToDelete.name}"?`)) {
      setSchoolRoutes(prev => prev.filter(r => r.id !== routeId));
      setStudents(prevStudents => prevStudents.map(s => 
        s.assignedRouteId === routeId ? { ...s, assignedRouteId: undefined, assignedRouteName: undefined } : s
      ));
      toast({ title: "Route Deleted", description: `Route "${routeToDelete.name}" deleted.` });
    }
  };

  // Driver Assignment Function
  const handleAssignDriverToRoute = (routeId: string, newDriverName: string) => {
    const targetRoute = schoolRoutes.find(r => r.id === routeId);
    if (!targetRoute) return;

    setSchoolRoutes(prevRoutes =>
      prevRoutes.map(route =>
        route.id === routeId ? { ...route, driverName: newDriverName } : route
      )
    );
    
    setStudents(prevStudents => 
        prevStudents.map(s => 
            s.assignedRouteId === routeId && targetRoute
            ? { ...s, assignedRouteName: `${targetRoute.name}` } 
            : s
        )
    );

    toast({
      title: "Driver Assigned",
      description: `${newDriverName === "To be assigned" ? "Driver unassigned from" : newDriverName + " assigned to"} route "${targetRoute.name}".`,
    });
  };

  const handleViewAttendance = () => {
    setIsAttendanceDialogOpen(true);
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
            <SchoolIcon className="mr-3 h-8 w-8" /> {currentSchool.name} Portal
          </h1>
          <p className="text-muted-foreground">Manage students and transportation for your school.</p>
        </div>
        <Button onClick={handleAddStudent} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Student
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" /> Student Roster
          </CardTitle>
          <CardDescription>View and manage students enrolled at {currentSchool.name}. Includes assigned bus routes and drivers.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No students found for {currentSchool.name}.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[80px] text-center">Age</TableHead>
                  <TableHead>Class/Grade</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Assigned Route</TableHead>
                  <TableHead>Route Driver</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const route = schoolRoutes.find(r => r.id === student.assignedRouteId);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={student.photoDataUrl} alt={student.name} data-ai-hint="child portrait" />
                          <AvatarFallback>{student.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">{student.age}</TableCell>
                      <TableCell>{student.classGrade}</TableCell>
                      <TableCell>{student.parentName || 'N/A'}</TableCell>
                      <TableCell>{student.assignedRouteName || <span className="text-muted-foreground italic">Not Assigned</span>}</TableCell>
                      <TableCell>{route?.driverName || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditStudentDialog(student)} aria-label="Edit student">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} aria-label="Delete student">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {editingStudent && (
        <Dialog open={isEditStudentDialogOpen} onOpenChange={setIsEditStudentDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline flex items-center">
                <Edit3 className="mr-2 h-5 w-5 text-primary" /> Edit Student Details
              </DialogTitle>
              <DialogDescription>Update the details for {editingStudent.name}.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EditStudentForm 
                student={editingStudent} 
                onFormSubmit={handleUpdateStudent}
                onCancel={() => {
                  setIsEditStudentDialogOpen(false);
                  setEditingStudent(null);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Route Management</CardTitle>
                <CardDescription>Oversee bus routes specific to {currentSchool.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => setIsRouteManagementDialogOpen(true)}>
                  <RouteIcon className="mr-2 h-4 w-4"/> Manage School Routes
                </Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Driver Assignment</CardTitle>
                <CardDescription>Assign available drivers to school bus routes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(true)}>
                  <UserCheck className="mr-2 h-4 w-4" /> Assign Drivers
                </Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center">
                    <BookOpenCheck className="mr-2 h-5 w-5 text-primary" /> Attendance Records
                </CardTitle>
                <CardDescription>View student attendance logs for {currentSchool.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={handleViewAttendance}>
                  View Attendance
                </Button>
            </CardContent>
         </Card>
      </div>

      <Dialog open={isRouteManagementDialogOpen} onOpenChange={setIsRouteManagementDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <RouteIcon className="mr-2 h-5 w-5 text-primary"/> Route Management for {currentSchool.name}
            </DialogTitle>
            <DialogDescription>
              View, add, edit, or delete bus routes for your school. Drivers assigned here will reflect in the student roster.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="py-4 space-y-4">
              <Button onClick={handleAddSchoolRoute} className="bg-accent hover:bg-accent/90 text-accent-foreground mb-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Route
              </Button>
              {schoolRoutes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No routes configured for {currentSchool.name} yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Driver Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.name}</TableCell>
                        <TableCell>{route.pickupTime}</TableCell>
                        <TableCell>{route.driverName}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditSchoolRoute(route.id)} aria-label="Edit route name">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteSchoolRoute(route.id)} aria-label="Delete route">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRouteManagementDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-primary"/> Assign Drivers to Routes
            </DialogTitle>
            <DialogDescription>
              Select a driver for each school route from the list of available drivers.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 mt-4">
            <div className="space-y-4">
              {schoolRoutes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No routes available. Please add routes first.</p>
              ) : (
                schoolRoutes.map((route) => (
                  <div key={route.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-medium text-foreground">{route.name}</p>
                      <p className="text-xs text-muted-foreground">Pickup: {route.pickupTime}</p>
                    </div>
                    <Select
                      value={route.driverName === "To be assigned" ? undefined : route.driverName}
                      onValueChange={(newDriverName) => {
                        handleAssignDriverToRoute(route.id, newDriverName || "To be assigned");
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To be assigned">
                          <span className="italic text-muted-foreground">To be assigned</span>
                        </SelectItem>
                        {mockDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.name}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <BookOpenCheck className="mr-2 h-6 w-6 text-primary" /> Student Attendance Records for {currentSchool.name}
            </DialogTitle>
            <DialogDescription>
              This is a mock view of student attendance. For live tracking, please refer to the Driver Dashboard.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 mt-4">
             {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No student data available for attendance.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class/Grade</TableHead>
                      <TableHead>Last Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.classGrade}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.lastAttendanceStatus === 'Picked Up' ? 'default' :
                              student.lastAttendanceStatus === 'Dropped Off' ? 'secondary' :
                              student.lastAttendanceStatus === 'Absent' ? 'destructive' : 'outline'
                            }
                            className={
                              student.lastAttendanceStatus === 'Picked Up' ? 'bg-green-500 hover:bg-green-600 text-white' :
                              student.lastAttendanceStatus === 'Dropped Off' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                              student.lastAttendanceStatus === 'Absent' ? 'bg-red-500 hover:bg-red-600 text-white' :
                              'border-yellow-500 text-yellow-600'
                            }
                          >
                            {student.lastAttendanceStatus || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {student.lastAttendanceTimestamp || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
    
