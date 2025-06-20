
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
  { id: 'c1', name: 'Mugisha Kevin', age: 7, schoolId: 'sch1', schoolName: 'Groupe Scolaire Kacyiru', parentId: 'p1', parentName: 'Shema Honore', classGrade: 'P2', photoDataUrl: 'https://placehold.co/50x50.png?text=MK', assignedRouteId: 'sch1-route1', assignedRouteName: 'GS Kacyiru Umuseke A', lastAttendanceStatus: 'Picked Up', lastAttendanceTimestamp: '2024-07-30 07:35 AM' },
  { id: 'c2', name: 'Ineza Ange', age: 5, schoolId: 'sch1', schoolName: 'Groupe Scolaire Kacyiru', parentId: 'p1', parentName: 'Shema Honore', classGrade: 'Nursery', photoDataUrl: undefined, assignedRouteId: 'sch1-route1', assignedRouteName: 'GS Kacyiru Umuseke A', lastAttendanceStatus: 'Dropped Off', lastAttendanceTimestamp: '2024-07-30 08:10 AM' },
  { id: 'c3', name: 'Gatete Paul', age: 8, schoolId: 'sch2', schoolName: 'Lycee de Kigali', parentId: 'p2', parentName: 'Uwamahoro Queen', classGrade: 'P3', photoDataUrl: 'https://placehold.co/50x50.png?text=GP', assignedRouteId: undefined, assignedRouteName: undefined, lastAttendanceStatus: 'Pending', lastAttendanceTimestamp: 'N/A' },
  { id: 'c4', name: 'Umutesi Divine', age: 9, schoolId: 'sch3', schoolName: 'Green Hills Academy', parentId: 'p3', parentName: 'Nsabimana Eric', classGrade: 'P4', photoDataUrl: 'https://placehold.co/50x50.png?text=UD', assignedRouteId: 'route2', assignedRouteName: 'Inyange Line', lastAttendanceStatus: 'Picked Up', lastAttendanceTimestamp: '2024-07-29 03:50 PM'},
  { id: 'c5', name: 'Shema Ryan', age: 6, schoolId: 'sch1', schoolName: 'Groupe Scolaire Kacyiru', parentId: 'p4', parentName: 'Keza Diane', classGrade: 'P1', photoDataUrl: 'https://placehold.co/50x50.png?text=SR', assignedRouteId: 'sch1-route2', assignedRouteName: 'GS Kacyiru Inyange B', lastAttendanceStatus: 'Absent', lastAttendanceTimestamp: '2024-07-30 07:00 AM' },
];

const currentSchool: Pick<School, 'id' | 'name'> = {
  id: 'sch1',
  name: 'Groupe Scolaire Kacyiru',
};

const initialMockSchoolRoutes: BusRoute[] = [
  { id: 'sch1-route1', name: 'GS Kacyiru Umuseke A', pickupTime: '07:30 AM', driverName: 'Makuza Jean' },
  { id: 'sch1-route2', name: 'GS Kacyiru Inyange B', pickupTime: '03:45 PM', driverName: 'Mukamana Alice' },
  { id: 'sch1-route3', name: 'GS Kacyiru kare', pickupTime: '07:00 AM', driverName: 'Ntawe' },
];

const mockDrivers: { id: string; name: string }[] = [
    { id: 'driver1', name: 'Makuza Jean' },
    { id: 'driver2', name: 'Mukamana Alice' },
    { id: 'driver3', name: 'Habimana David' },
    { id: 'driver4', name: 'Kwizera Emmanuel' },
    { id: 'driver5', name: 'Uwineza Sandrine' },
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
      name: `Umunyeshuri Mushya ${newStudentId.substring(0,4)}`,
      age: 0, 
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      parentId: 'new-p-placeholder', 
      parentName: 'Ntawe',
      classGrade: 'Ntawo',
      photoDataUrl: `https://placehold.co/50x50.png?text=N`,
      assignedRouteId: undefined,
      assignedRouteName: undefined,
      lastAttendanceStatus: 'Pending',
      lastAttendanceTimestamp: new Date().toLocaleDateString(),
    };
    setStudents(prevStudents => [...prevStudents, newStudent]);
    toast({
      title: "Umunyeshuri Yongewemo (Igipimo)",
      description: `Umunyeshuri mushya ${newStudent.name} yongewemo. Koresha 'Hindura' kugira ngo ushyiremo amakuru ye.`
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
    toast({ title: "Umunyeshuri Yahinduwe", description: `Amakuru ya ${data.name} yahinduwe.` });
  };

  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find(student => student.id === studentId);
    if (!studentToDelete) return;

    if (window.confirm(`Urifuza gukura ${studentToDelete.name} kuri ${currentSchool.name}?`)) {
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      toast({ title: "Umunyeshuri Yakuweho", description: `${studentToDelete.name} yakuwe kuri uru rutonde.` });
    }
  };

  const handleAddSchoolRoute = () => {
    const newRouteName = window.prompt("Shyiramo izina ry'urugendo rushya:", "Urugendo Rushya rw'Ishuri");
    if (!newRouteName || newRouteName.trim() === "") {
      toast({ title: "Kwonheraho Byahagaritswe", description: "Izina ry'urugendo ntirishobora kuba ubusa.", variant: "destructive" });
      return;
    }

    const newPickupTime = window.prompt("Shyiramo isaha yo gufata (urugero: 07:45 AM):", "08:00 AM");
    if (newPickupTime === null) { // User cancelled
        toast({ title: "Kwonheraho Byahagaritswe", description: "Ntabwo wongeyeho urugendo."});
        return;
    }

    const newDriverName = window.prompt("Shyiramo izina ry'umushoferi:", "Ntawe");
     if (newDriverName === null) { // User cancelled
        toast({ title: "Kwonheraho Byahagaritswe", description: "Ntabwo wongeyeho urugendo."});
        return;
    }

    const newRoute: BusRoute = {
      id: `sch-route-${Math.random().toString(36).substring(2, 9)}`,
      name: newRouteName.trim(),
      pickupTime: newPickupTime.trim() || "08:00 AM", 
      driverName: newDriverName.trim() || "Ntawe", 
    };
    setSchoolRoutes(prev => [...prev, newRoute]);
    toast({ title: "Urugendo Rwongewemo", description: `Urugendo "${newRoute.name}" rwongewemo n'isaha yo gufata ${newRoute.pickupTime} n'umushoferi ${newRoute.driverName}.` });
  };

  const handleEditSchoolRoute = (routeId: string) => {
    const routeToEdit = schoolRoutes.find(r => r.id === routeId);
    if (!routeToEdit) return;

    const newName = window.prompt("Shyiramo izina rishya ry'urugendo:", routeToEdit.name);
    if (newName === null) { // User cancelled
        toast({ title: "Guhindura Byahagaritswe", description: "Nta mpinduka zakozwe ku rugendo."});
        return;
    }
    if (newName.trim() === "") {
      toast({ title: "Guhindura Byahagaritswe", description: "Izina ry'urugendo ntirishobora kuba ubusa.", variant: "destructive" });
      return;
    }
    
    const newTime = window.prompt("Shyiramo isaha nshya yo gufata:", routeToEdit.pickupTime);
    if (newTime === null) {
        toast({ title: "Guhindura Byahagaritswe", description: "Nta mpinduka zakozwe ku rugendo."});
        return;
    }

    const newDriver = window.prompt("Shyiramo izina rishya ry'umushoferi:", routeToEdit.driverName);
    if (newDriver === null) {
        toast({ title: "Guhindura Byahagaritswe", description: "Nta mpinduka zakozwe ku rugendo."});
        return;
    }

    setSchoolRoutes(prev => prev.map(r => r.id === routeId ? { 
        ...r, 
        name: newName.trim(),
        pickupTime: newTime.trim() || r.pickupTime,
        driverName: newDriver.trim() || r.driverName
    } : r));
    toast({ title: "Urugendo Rwahinduwe", description: `Urugendo "${newName.trim()}" rwavuguruwe.` });
  };

  const handleDeleteSchoolRoute = (routeId: string) => {
    const routeToDelete = schoolRoutes.find(r => r.id === routeId);
    if (!routeToDelete) return;

    if (window.confirm(`Urifuza gusiba urugendo "${routeToDelete.name}"?`)) {
      setSchoolRoutes(prev => prev.filter(r => r.id !== routeId));
      setStudents(prevStudents => prevStudents.map(s => 
        s.assignedRouteId === routeId ? { ...s, assignedRouteId: undefined, assignedRouteName: undefined } : s
      ));
      toast({ title: "Urugendo Rwasibwe", description: `Urugendo "${routeToDelete.name}" rwasibwe.` });
    }
  };

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
      title: "Umushoferi Yahawe Umwanya",
      description: `${newDriverName === "Ntawe" ? "Umushoferi yakuwe kuri" : newDriverName + " yahawe umwanya kuri"} rugendo "${targetRoute.name}".`,
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
            <SchoolIcon className="mr-3 h-8 w-8" /> {currentSchool.name} Umuyoboro
          </h1>
          <p className="text-muted-foreground">Genzura abanyeshuri n'ingendo z'ishuri ryawe.</p>
        </div>
        <Button onClick={handleAddStudent} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Ongeramo Umunyeshuri Mushya
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" /> Urutonde rw'Abanyeshuri
          </CardTitle>
          <CardDescription>Reba kandi ucunge abanyeshuri banditse muri {currentSchool.name}. Harimo n'ingendo zabo n'abashoferi.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nta banyeshuri babonetse muri {currentSchool.name}.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ifoto</TableHead>
                  <TableHead>Izina</TableHead>
                  <TableHead className="w-[80px] text-center">Imyaka</TableHead>
                  <TableHead>Umwaka/Ishami</TableHead>
                  <TableHead>Izina ry'Umubyeyi</TableHead>
                  <TableHead>Urugendo Yahawe</TableHead>
                  <TableHead>Umushoferi w'Urugendo</TableHead>
                  <TableHead className="text-right w-[150px]">Ibikorwa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const route = schoolRoutes.find(r => r.id === student.assignedRouteId);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={student.photoDataUrl} alt={student.name} data-ai-hint="umwana ifoto" />
                          <AvatarFallback>{student.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">{student.age}</TableCell>
                      <TableCell>{student.classGrade}</TableCell>
                      <TableCell>{student.parentName || 'N/A'}</TableCell>
                      <TableCell>{student.assignedRouteName || <span className="text-muted-foreground italic">Nta rugendo</span>}</TableCell>
                      <TableCell>{route?.driverName || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditStudentDialog(student)} aria-label="Hindura umunyeshuri">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} aria-label="Siba umunyeshuri">
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
                <Edit3 className="mr-2 h-5 w-5 text-primary" /> Hindura Amakuru y'Umunyeshuri
              </DialogTitle>
              <DialogDescription>Hindura amakuru ya {editingStudent.name}.</DialogDescription>
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
                <CardTitle className="font-headline text-lg">Icunga ry'Ingendo</CardTitle>
                <CardDescription>Genzura ingendo z'imodoka zihariye za {currentSchool.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => setIsRouteManagementDialogOpen(true)}>
                  <RouteIcon className="mr-2 h-4 w-4"/> Genzura Ingendo z'Ishuri
                </Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Guha Abashoferi Imyanya</CardTitle>
                <CardDescription>Ha abashoferi bariho imyanya ku ngendo z'imodoka z'ishuri.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(true)}>
                  <UserCheck className="mr-2 h-4 w-4" /> Ha Abashoferi Imyanya
                </Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center">
                    <BookOpenCheck className="mr-2 h-5 w-5 text-primary" /> Amakuru y'Ukwitabira
                </CardTitle>
                <CardDescription>Reba amakuru y'ukwitabira kw'abanyeshuri ba {currentSchool.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={handleViewAttendance}>
                  Reba Ukwitabira
                </Button>
            </CardContent>
         </Card>
      </div>

      <Dialog open={isRouteManagementDialogOpen} onOpenChange={setIsRouteManagementDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <RouteIcon className="mr-2 h-5 w-5 text-primary"/> Icunga ry'Ingendo rya {currentSchool.name}
            </DialogTitle>
            <DialogDescription>
              Reba, ongeramo, hindura, cyangwa siba ingendo z'imodoka z'ishuri ryawe. Abashoferi bahawe imyanya hano bazagaragara ku rutonde rw'abanyeshuri.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="py-4 space-y-4">
              <Button onClick={handleAddSchoolRoute} className="bg-accent hover:bg-accent/90 text-accent-foreground mb-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Ongeramo Urugendo Rushya
              </Button>
              {schoolRoutes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nta ngendo zirashyirwamo kuri {currentSchool.name} kugeza ubu.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Izina ry'Urugendo</TableHead>
                      <TableHead>Isaha yo Gufata</TableHead>
                      <TableHead>Izina ry'Umushoferi</TableHead>
                      <TableHead className="text-right">Ibikorwa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.name}</TableCell>
                        <TableCell>{route.pickupTime}</TableCell>
                        <TableCell>{route.driverName}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditSchoolRoute(route.id)} aria-label="Hindura izina ry'urugendo">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteSchoolRoute(route.id)} aria-label="Siba urugendo">
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
            <Button variant="outline" onClick={() => setIsRouteManagementDialogOpen(false)}>Funga</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-primary"/> Guha Abashoferi Imyanya ku Ngendo
            </DialogTitle>
            <DialogDescription>
              Hitamo umushoferi kuri buri rugendo rw'ishuri mu bashoferi bahari.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 mt-4">
            <div className="space-y-4">
              {schoolRoutes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nta ngendo zihari. Nyamuneka ongeramo ingendo mbere.</p>
              ) : (
                schoolRoutes.map((route) => (
                  <div key={route.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-medium text-foreground">{route.name}</p>
                      <p className="text-xs text-muted-foreground">Isaha yo Gufata: {route.pickupTime}</p>
                    </div>
                    <Select
                      value={route.driverName === "Ntawe" ? undefined : route.driverName}
                      onValueChange={(newDriverName) => {
                        handleAssignDriverToRoute(route.id, newDriverName || "Ntawe");
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Hitamo umushoferi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ntawe">
                          <span className="italic text-muted-foreground">Ntawe</span>
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
            <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>Funga</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <BookOpenCheck className="mr-2 h-6 w-6 text-primary" /> Amakuru y'Ukwitabira kw'Abanyeshuri ba {currentSchool.name}
            </DialogTitle>
            <DialogDescription>
              Aha ni amakuru y'ukwitabira (y'igipimo). Kubona uko bihagaze ako kanya, reba Imbonerahamwe y'Umushoferi.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 mt-4">
             {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nta makuru y'abanyeshuri ahari yo kwerekana ukwitabira.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Izina ry'Umunyeshuri</TableHead>
                      <TableHead>Umwaka/Ishami</TableHead>
                      <TableHead>Uko Byari Biheruka</TableHead>
                      <TableHead>Igihe Biherukira</TableHead>
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
                            {student.lastAttendanceStatus === 'Picked Up' ? 'Yafashwe' : student.lastAttendanceStatus === 'Dropped Off' ? 'Yagejejwe' : student.lastAttendanceStatus === 'Absent' ? 'Ntiyaje' : 'Ategereje' || 'N/A'}
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
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>Funga</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
