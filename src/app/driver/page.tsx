
"use client"; // For state updates on button clicks

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Users, CheckCircle, XCircle, AlertTriangle, Clock, ListChecks, Bus as BusIcon } from 'lucide-react';
import type { AssignedRoute, ChildAttendance, RouteStop } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Mock data for driver's assigned route
const initialMockRoute: AssignedRoute = {
  id: 'route-001',
  routeName: 'Morning Route - West District',
  driverName: 'John Doe',
  busNumber: 'BUS-42',
  stops: [
    {
      id: 'stop-1',
      name: '123 Willow Creek Rd',
      time: '07:15 AM',
      children: [
        { id: 'child-1a', name: 'Emily Carter', status: 'Pending' },
        { id: 'child-1b', name: 'Michael B. Jordan (not the actor)', status: 'Pending' },
      ],
    },
    {
      id: 'stop-2',
      name: 'Oakwood Apartments - Main Gate',
      time: '07:30 AM',
      children: [{ id: 'child-2a', name: 'Sophia Lee', status: 'Pending' }],
    },
    {
      id: 'stop-3',
      name: 'Corner of 5th and Pine',
      time: '07:45 AM',
      children: [
        { id: 'child-3a', name: 'James Rodriguez', status: 'Pending' },
        { id: 'child-3b', name: 'Olivia Martinez', status: 'Pending' },
      ],
    },
    {
      id: 'stop-4',
      name: 'Sunset Elementary School',
      time: '08:00 AM',
      children: [], // Drop-off only stop initially, or children are marked as dropped here
    },
  ],
};

// Custom SteeringWheelIcon as lucide-react might not have it directly or to ensure specific style
const SteeringWheelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </svg>
);

export default function DriverDashboardPage() {
  const [assignedRoute, setAssignedRoute] = useState<AssignedRoute>(initialMockRoute);

  const updateChildStatus = (stopId: string, childId: string, status: ChildAttendance['status']) => {
    setAssignedRoute(prevRoute => ({
      ...prevRoute,
      stops: prevRoute.stops.map(stop =>
        stop.id === stopId
          ? {
              ...stop,
              children: stop.children.map(child =>
                child.id === childId ? { ...child, status } : child
              ),
            }
          : stop
      ),
    }));
  };
  
  const allChildrenProcessedCurrentStop = (stop: RouteStop) => 
    stop.children.length > 0 && stop.children.every(child => child.status === 'Picked Up' || child.status === 'Dropped Off');

  const allChildrenProcessedEntireRoute = assignedRoute.stops.every(stop => 
    stop.children.length === 0 || stop.children.every(child => child.status === 'Picked Up' || child.status === 'Dropped Off')
  );


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-8 shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline flex items-center">
            <SteeringWheelIcon className="mr-3 h-8 w-8" /> Driver Dashboard
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Welcome, {assignedRoute.driverName}! Manage your current route: {assignedRoute.routeName} (Bus: {assignedRoute.busNumber}).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
           <Button variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground">
            <Clock className="mr-2 h-4 w-4" /> View Full Schedule
          </Button>
          <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
            <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary"/>Route Stops & Attendance</CardTitle>
              <CardDescription>Mark children as picked up or dropped off at each stop.</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedRoute.stops.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No stops assigned for this route.</p>
              ) : (
                <Accordion type="single" collapsible defaultValue={assignedRoute.stops[0]?.id} className="w-full">
                  {assignedRoute.stops.map((stop, stopIndex) => (
                    <AccordionItem value={stop.id} key={stop.id}>
                      <AccordionTrigger className="hover:no-underline text-lg font-medium py-4 px-2 rounded-md data-[state=open]:bg-muted/50">
                        <div className="flex items-center gap-3 w-full">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="flex-grow text-left">Stop {stopIndex + 1}: {stop.name}</span>
                          <Badge variant="outline" className="ml-auto flex-shrink-0">{stop.time}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2 px-2 space-y-4">
                        {stop.children.length === 0 && stop.name.toLowerCase().includes('school') && (
                           <p className="text-muted-foreground italic">This is a drop-off location. Ensure all picked-up children are marked as dropped.</p>
                        )}
                        {stop.children.length === 0 && !stop.name.toLowerCase().includes('school') && (
                           <p className="text-muted-foreground italic">No children currently scheduled for this stop.</p>
                        )}

                        {stop.children.map((child) => (
                          <div key={child.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md shadow-sm bg-background hover:bg-muted/30 transition-colors gap-3 sm:gap-0">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                              <div>
                                <p className="font-medium">{child.name}</p>
                                <Badge 
                                  variant={
                                    child.status === 'Picked Up' ? 'default' : 
                                    child.status === 'Dropped Off' ? 'secondary' : 'outline'
                                  } 
                                  className={
                                    child.status === 'Picked Up' ? 'bg-green-500 hover:bg-green-600 text-white' :
                                    child.status === 'Dropped Off' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
                                    'border-yellow-500 text-yellow-600'
                                  }
                                >{child.status}</Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white disabled:bg-green-500/50 disabled:text-white/70 disabled:border-green-500/50"
                                onClick={() => updateChildStatus(stop.id, child.id, 'Picked Up')}
                                disabled={child.status === 'Picked Up' || child.status === 'Dropped Off'}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" /> Picked Up
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white disabled:bg-blue-500/50 disabled:text-white/70 disabled:border-blue-500/50"
                                onClick={() => updateChildStatus(stop.id, child.id, 'Dropped Off')}
                                disabled={child.status === 'Dropped Off' || child.status === 'Pending'} // Can only drop off if picked up
                              >
                                <XCircle className="mr-1 h-4 w-4" /> Dropped Off
                              </Button>
                            </div>
                          </div>
                        ))}
                         {allChildrenProcessedCurrentStop(stop) && (
                            <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-md text-center text-sm font-medium">
                                All children at this stop processed.
                            </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {allChildrenProcessedEntireRoute && assignedRoute.stops.length > 0 && (
                 <div className="mt-6 p-4 bg-green-500 text-white rounded-md text-center font-semibold text-lg">
                  🎉 Route Completed! All children processed.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"> <BusIcon className="mr-2 h-5 w-5 text-primary" /> Route Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Route:</strong> {assignedRoute.routeName}</p>
              <p><strong>Total Stops:</strong> {assignedRoute.stops.length}</p>
              <p><strong>Status:</strong> {allChildrenProcessedEntireRoute ? <Badge className="bg-green-500 text-white">Completed</Badge> : <Badge variant="outline" className="border-yellow-500 text-yellow-700">In Progress</Badge>}</p>
              <div className="mt-4">
                <Image src="https://placehold.co/600x300.png" alt="Simplified route map with bus icon" width={600} height={300} className="rounded-md" data-ai-hint="route map icon"/>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Share Live Location</Button>
              <Button className="w-full" variant="outline">View Route History</Button>
              <Button className="w-full" variant="outline">Contact Dispatch</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

