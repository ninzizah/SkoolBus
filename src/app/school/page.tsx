
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { School as SchoolIcon, Users, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { Child, School } from '@/types';
import EditStudentForm from '@/components/children/edit-student-form';
import type { EditStudentFormData } from '@/components/children/edit-student-form';
import { useToast } from "@/hooks/use-toast";

const allMockChildren: Child[] = [
  { id: 'c1', name: 'Leo Wonderland', age: 7, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p1', parentName: 'Alice Wonderland', classGrade: '2nd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=LW', assignedRouteId: undefined, assignedRouteName: undefined },
  { id: 'c2', name: 'Mia Wonderland', age: 5, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p1', parentName: 'Alice Wonderland', classGrade: 'Kindergarten', photoDataUrl: undefined, assignedRouteId: 'route1', assignedRouteName: 'Morning Star Route' },
  { id: 'c3', name: 'Sam Construction', age: 8, schoolId: 'sch2', schoolName: 'Construction Academy', parentId: 'p2', parentName: 'Bob The Builder', classGrade: '3rd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=SC', assignedRouteId: undefined, assignedRouteName: undefined },
  { id: 'c4', name: 'Lily Oakwood', age: 9, schoolId: 'sch3', schoolName: 'Oakwood High', parentId: 'p3', parentName: 'Charlie Brown', classGrade: '4th Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=LO', assignedRouteId: 'route2', assignedRouteName: 'Afternoon Comet Line'},
  { id: 'c5', name: 'Max Wonderland', age: 6, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: 'p4', parentName: 'Diana Prince', classGrade: '1st Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=MW', assignedRouteId: 'route1', assignedRouteName: 'Morning Star Route' },
];

const currentSchool: Pick<School, 'id' | 'name'> = {
  id: 'sch1',
  name: 'Wonderland Elementary',
};

export default function SchoolPortalPage() {
  const [students, setStudents] = useState<Child[]>([]);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
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
          <CardDescription>View and manage students enrolled at {currentSchool.name}.</CardDescription>
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
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
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
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEditStudentDialog(student)} aria-label="Edit student">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} aria-label="Delete student">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Student Dialog */}
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
                <CardDescription>Oversee bus routes specific to your school.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" disabled>Manage Routes (Coming Soon)</Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Driver Assignment</CardTitle>
                <CardDescription>Assign drivers to school routes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" disabled>Assign Drivers (Coming Soon)</Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Attendance Records</CardTitle>
                <CardDescription>View student attendance logs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" disabled>View Attendance (Coming Soon)</Button>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}
