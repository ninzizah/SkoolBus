
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit3, Trash2, Bus, Route as RouteIcon } from 'lucide-react';
import type { Child, Parent, BusRoute, School } from '@/types';
import AddChildForm from '@/components/children/add-child-form';
import { useToast } from "@/hooks/use-toast";


const initialMockChildren: Child[] = [
  { id: 'c1', name: 'Mugisha Kevin', age: 7, schoolId: 'sch1', schoolName: 'Groupe Scolaire Kacyiru', parentId: 'p1', parentName: 'Shema Honore', classGrade: 'P2', photoDataUrl: 'https://placehold.co/50x50.png?text=MK', assignedRouteId: undefined, assignedRouteName: undefined },
  { id: 'c2', name: 'Ineza Ange', age: 5, schoolId: 'sch1', schoolName: 'Groupe Scolaire Kacyiru', parentId: 'p1', parentName: 'Shema Honore', classGrade: 'Nursery', photoDataUrl: undefined, assignedRouteId: 'route1', assignedRouteName: 'Umuseke Route' },
  { id: 'c3', name: 'Gatete Paul', age: 8, schoolId: 'sch2', schoolName: 'Lycee de Kigali', parentId: 'p2', parentName: 'Uwamahoro Queen', classGrade: 'P3', photoDataUrl: 'https://placehold.co/50x50.png?text=GP', assignedRouteId: undefined, assignedRouteName: undefined },
];

const mockParentsForSelection: Pick<Parent, 'id' | 'name'>[] = [
  { id: 'p1', name: 'Shema Honore' },
  { id: 'p2', name: 'Uwamahoro Queen' },
  { id: 'p3', name: 'Nsabimana Eric' },
];

const mockSchoolsForSelection: Pick<School, 'id' | 'name'>[] = [
  { id: 'sch1', name: 'Groupe Scolaire Kacyiru' },
  { id: 'sch2', name: 'Lycee de Kigali' },
  { id: 'sch3', name: 'Green Hills Academy' },
];

const mockBusRoutes: BusRoute[] = [
  { id: 'route1', name: 'Umuseke Route', pickupTime: '07:30 AM', driverName: 'Makuza Jean' },
  { id: 'route2', name: 'Inyange Line', pickupTime: '03:45 PM', driverName: 'Mukamana Alice' },
  { id: 'route3', name: 'Express Kicukiro', pickupTime: '08:00 AM', driverName: 'Habimana David' },
];


export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>(initialMockChildren);
  const [selectedChildForRoute, setSelectedChildForRoute] = useState<Child | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
  const [isAssignRouteDialogOpen, setIsAssignRouteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddChild = (newChild: Child) => {
    const parent = mockParentsForSelection.find(p => p.id === newChild.parentId);
    const school = mockSchoolsForSelection.find(s => s.id === newChild.schoolId);
    const childWithDetails = {
      ...newChild,
      parentName: parent?.name,
      schoolName: school?.name,
    };
    setChildren(prevChildren => [...prevChildren, childWithDetails]);
  };

  const handleEditChild = (id: string) => {
    const childToEdit = children.find(child => child.id === id);
    if (!childToEdit) return;

    const newName = window.prompt("Andika izina rishya ry'umwana:", childToEdit.name);
    if (newName && newName.trim() !== "") {
      setChildren(prevChildren =>
        prevChildren.map(child =>
          child.id === id ? { ...child, name: newName.trim() } : child
        )
      );
      toast({ title: "Umwana Yahinduwe", description: `Izina ry'umwana ryahinduwe ${newName.trim()}.` });
    } else if (newName === "") {
      toast({ title: "Guhindura Byahagaritswe", description: "Izina ry'umwana ntirishobora kuba ubusa.", variant: "destructive" });
    }
  };

  const handleDeleteChild = (id: string) => {
    const childToDelete = children.find(child => child.id === id);
    if (!childToDelete) return;

    if (window.confirm(`Urifuza gusiba amakuru ya ${childToDelete.name}?`)) {
      setChildren(prevChildren => prevChildren.filter(child => child.id !== id));
      toast({ title: "Umwana Yasibwe", description: `Amakuru ya ${childToDelete.name} yasibwe.` });
    }
  };

  const openAssignRouteDialog = (child: Child) => {
    setSelectedChildForRoute(child);
    setSelectedRouteId(child.assignedRouteId);
    setIsAssignRouteDialogOpen(true);
  };

  const handleAssignRoute = () => {
    if (selectedChildForRoute && selectedRouteId) {
      const route = mockBusRoutes.find(r => r.id === selectedRouteId);
      if (route) {
        setChildren(prevChildren =>
          prevChildren.map(c =>
            c.id === selectedChildForRoute.id
              ? { ...c, assignedRouteId: route.id, assignedRouteName: route.name }
              : c
          )
        );
        toast({
          title: "Umwanya Wahawe",
          description: `${selectedChildForRoute.name} yahawe umwanya kuri ${route.name}.`,
        });
      }
    } else if (selectedChildForRoute && !selectedRouteId) { 
       setChildren(prevChildren =>
          prevChildren.map(c =>
            c.id === selectedChildForRoute.id
              ? { ...c, assignedRouteId: undefined, assignedRouteName: undefined }
              : c
          )
        );
        toast({
          title: "Umwanya Wakuweho",
          description: `${selectedChildForRoute.name} yakuwe ku mwanya uwo ariwo wose.`,
        });
    }
    setIsAssignRouteDialogOpen(false);
    setSelectedChildForRoute(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Amakuru y'Abana</h1>
          <p className="text-muted-foreground">Genzura amakuru y'abana n'imyanya yabo mu modoka.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div> 
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Urutonde rw'Abana</CardTitle>
              <CardDescription>Reba kandi ucunge abana banditse muri sisitemu.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Izina ry'Umwana</TableHead>
                    <TableHead>Imyaka</TableHead>
                    <TableHead>Ishuri</TableHead>
                    <TableHead>Umwaka/Ishami</TableHead>
                    <TableHead>Umubyeyi</TableHead>
                    <TableHead>Umwanya mu Modoka</TableHead>
                    <TableHead className="text-right">Ibikorwa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell className="font-medium">
                        {child.name}
                      </TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>{child.schoolName || 'N/A'}</TableCell>
                      <TableCell>{child.classGrade}</TableCell>
                      <TableCell>{child.parentName || 'N/A'}</TableCell>
                      <TableCell>{child.assignedRouteName || <span className="text-muted-foreground italic">Nta mwanya afite</span>}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openAssignRouteDialog(child)} aria-label="Guha Umwanya">
                          <Bus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditChild(child.id)} aria-label="Hindura Umwana">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteChild(child.id)} aria-label="Siba Umwana">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {children.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nta bana barongerwamo.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div> 
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Ongeramo Umwana Mushya
              </CardTitle>
              <CardDescription>Ongeramo amakuru y'umwana muri sisitemu.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddChildForm parents={mockParentsForSelection} schools={mockSchoolsForSelection} onChildAdded={handleAddChild} />
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedChildForRoute && (
        <Dialog open={isAssignRouteDialogOpen} onOpenChange={setIsAssignRouteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline flex items-center"><RouteIcon className="mr-2 h-5 w-5 text-primary"/>Guha Umwanya mu Modoka {selectedChildForRoute.name}</DialogTitle>
              <DialogDescription>
                Hitamo umwanya mu modoka wa {selectedChildForRoute.name}. Ubu afite: {selectedChildForRoute.assignedRouteName || "Ntawo"}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup
                value={selectedRouteId}
                onValueChange={(value) => setSelectedRouteId(value === "UNASSIGN" ? undefined : value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UNASSIGN" id="route-unassign" />
                    <Label htmlFor="route-unassign" className="font-normal italic text-muted-foreground">
                      Kura ku Mwanya
                    </Label>
                  </div>
                {mockBusRoutes.map((route) => (
                  <div key={route.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={route.id} id={route.id} />
                    <Label htmlFor={route.id} className="font-normal flex-1 cursor-pointer">
                      <div className="font-medium text-foreground">{route.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Isaha: {route.pickupTime} - Umushoferi: {route.driverName}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignRouteDialogOpen(false)}>Hagarika</Button>
              <Button onClick={handleAssignRoute} className="bg-primary hover:bg-primary/90">Emeza Umwanya</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
