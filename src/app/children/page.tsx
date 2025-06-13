
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
  { id: 'c1', name: 'Leo Wonderland', age: 7, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: '1', parentName: 'Alice Wonderland', classGrade: '2nd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=Leo', assignedRouteId: undefined, assignedRouteName: undefined },
  { id: 'c2', name: 'Mia Wonderland', age: 5, schoolId: 'sch1', schoolName: 'Wonderland Elementary', parentId: '1', parentName: 'Alice Wonderland', classGrade: 'Kindergarten', photoDataUrl: undefined, assignedRouteId: 'route1', assignedRouteName: 'Morning Star Route' },
  { id: 'c3', name: 'Scoop The Digger', age: 8, schoolId: 'sch2', schoolName: 'Construction Academy', parentId: '2', parentName: 'Bob The Builder', classGrade: '3rd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=Scoop', assignedRouteId: undefined, assignedRouteName: undefined },
];

const mockParentsForSelection: Pick<Parent, 'id' | 'name'>[] = [
  { id: '1', name: 'Alice Wonderland' },
  { id: '2', name: 'Bob The Builder' },
  { id: '3', name: 'Charlie Brown' },
];

const mockSchoolsForSelection: Pick<School, 'id' | 'name'>[] = [
  { id: 'sch1', name: 'Wonderland Elementary' },
  { id: 'sch2', name: 'Construction Academy' },
  { id: 'sch3', name: 'Oakwood High' },
];

const mockBusRoutes: BusRoute[] = [
  { id: 'route1', name: 'Morning Star Route', pickupTime: '07:30 AM', driverName: 'Mr. Sunny Day' },
  { id: 'route2', name: 'Afternoon Comet Line', pickupTime: '03:45 PM', driverName: 'Ms. Luna Night' },
  { id: 'route3', name: 'Express Shuttle Alpha', pickupTime: '08:00 AM', driverName: 'Capt. Speedy Gonzales' },
];


export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>(initialMockChildren);
  const [selectedChildForRoute, setSelectedChildForRoute] = useState<Child | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
  const [isAssignRouteDialogOpen, setIsAssignRouteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditChild = (id: string) => console.log('Edit child', id);
  const handleDeleteChild = (id: string) => console.log('Delete child', id);

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
          title: "Route Assigned",
          description: `${selectedChildForRoute.name} has been assigned to ${route.name}.`,
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
          title: "Route Unassigned",
          description: `${selectedChildForRoute.name} has been unassigned from any route.`,
        });
    }
    setIsAssignRouteDialogOpen(false);
    setSelectedChildForRoute(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Child Profiles</h1>
          <p className="text-muted-foreground">Manage children's profiles and their bus route assignments.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div> 
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Children List</CardTitle>
              <CardDescription>View and manage children registered in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Class/Grade</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Assigned Route</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>{child.assignedRouteName || <span className="text-muted-foreground italic">Not Assigned</span>}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openAssignRouteDialog(child)} aria-label="Assign Route">
                          <Bus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditChild(child.id)} aria-label="Edit child">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteChild(child.id)} aria-label="Delete child">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {children.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No children added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div> 
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Add New Child
              </CardTitle>
              <CardDescription>Add a child's profile to the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddChildForm parents={mockParentsForSelection} schools={mockSchoolsForSelection} />
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedChildForRoute && (
        <Dialog open={isAssignRouteDialogOpen} onOpenChange={setIsAssignRouteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline flex items-center"><RouteIcon className="mr-2 h-5 w-5 text-primary"/>Assign Bus Route for {selectedChildForRoute.name}</DialogTitle>
              <DialogDescription>
                Select a bus route for {selectedChildForRoute.name}. Current: {selectedChildForRoute.assignedRouteName || "None"}
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
                      Unassign Route
                    </Label>
                  </div>
                {mockBusRoutes.map((route) => (
                  <div key={route.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={route.id} id={route.id} />
                    <Label htmlFor={route.id} className="font-normal flex-1 cursor-pointer">
                      <div className="font-medium text-foreground">{route.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Pickup: {route.pickupTime} - Driver: {route.driverName}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignRouteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignRoute} className="bg-primary hover:bg-primary/90">Assign Route</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
