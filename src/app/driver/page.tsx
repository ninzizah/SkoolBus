
"use client"; // For state updates on button clicks

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Users, CheckCircle, XCircle, AlertTriangle, Clock, ListChecks, Bus as BusIcon, CalendarDays, MessageSquareWarning, Send, History as HistoryIcon } from 'lucide-react';
import type { AssignedRoute, ChildAttendance, RouteStop } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

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

// Mock data for past routes
interface PastRoute {
  id: string;
  routeName: string;
  date: string;
  status: 'Completed' | 'Partially Completed' | 'Cancelled';
  busNumber?: string;
  driverNotes?: string;
}

const mockPastRoutes: PastRoute[] = [
  { id: 'hist-001', routeName: 'Morning Route - West District', date: '2024-07-28', status: 'Completed', busNumber: 'BUS-42', driverNotes: 'All smooth.' },
  { id: 'hist-002', routeName: 'Afternoon Route - East District', date: '2024-07-28', status: 'Completed', busNumber: 'BUS-17', driverNotes: 'Slight delay due to traffic on 5th Ave.' },
  { id: 'hist-003', routeName: 'Morning Route - West District', date: '2024-07-27', status: 'Completed', busNumber: 'BUS-42' },
  { id: 'hist-004', routeName: 'Special Event Shuttle', date: '2024-07-26', status: 'Cancelled', driverNotes: 'Event cancelled by school.' },
  { id: 'hist-005', routeName: 'Morning Route - North District', date: '2024-07-25', status: 'Partially Completed', busNumber: 'BUS-07', driverNotes: 'Bus breakdown, alternate arranged.' },
];


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
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isReportIssueDialogOpen, setIsReportIssueDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [isRouteHistoryDialogOpen, setIsRouteHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleViewFullSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleOpenReportIssueDialog = () => {
    setIsReportIssueDialogOpen(true);
  };

  const handleSendIssueReport = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Cannot Send Empty Report",
        description: "Please describe the issue before sending.",
        variant: "destructive",
      });
      return;
    }
    // Simulate sending the report
    toast({
      title: "Issue Reported",
      description: `Details: "${issueDescription}". Dispatch has been notified.`,
    });
    setIssueDescription('');
    setIsReportIssueDialogOpen(false);
  };


  const handleViewRouteHistory = () => {
    setIsRouteHistoryDialogOpen(true);
  };

  const handleContactDispatch = () => {
    toast({ 
      title: "Dispatch Notified", 
      description: "Dispatch has been alerted. They will contact you via your registered device if further action is needed." 
    });
  };


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
           <Button 
             variant="secondary" 
             className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
             onClick={handleViewFullSchedule}
           >
            <Clock className="mr-2 h-4 w-4" /> View Full Schedule
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleOpenReportIssueDialog}
          >
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
            <CardContent className="space-y-2">
              <p><strong>Route:</strong> {assignedRoute.routeName}</p>
              <p><strong>Total Stops:</strong> {assignedRoute.stops.length}</p>
              <div className="flex items-center">
                <strong className="mr-1">Status:</strong>
                {allChildrenProcessedEntireRoute ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Completed</Badge>
                ) : (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">In Progress</Badge>
                )}
              </div>
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
              <Button className="w-full" variant="outline" onClick={handleViewRouteHistory}>View Route History</Button>
              <Button className="w-full" variant="outline" onClick={handleContactDispatch}>Contact Dispatch</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" /> Full Route Schedule: {assignedRoute.routeName}
            </DialogTitle>
            <DialogDescription>
              Detailed view of all stops and children for the current route.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="space-y-6 py-4 px-2">
              {assignedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                      <MapPin className="mr-2 h-5 w-5" /> Stop {index + 1}: {stop.name}
                    </h3>
                    <Badge variant="secondary">{stop.time}</Badge>
                  </div>
                  {stop.children.length > 0 ? (
                    <ul className="space-y-2 pl-4">
                      {stop.children.map((child) => (
                        <li key={child.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                          <span className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {child.name}
                          </span>
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
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pl-4 text-sm text-muted-foreground italic">
                      {stop.name.toLowerCase().includes('school') ? "Drop-off location." : "No children scheduled for this stop."}
                    </p>
                  )}
                </div>
              ))}
              {assignedRoute.stops.length === 0 && (
                 <p className="text-muted-foreground text-center py-8">No stops in this schedule.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={isReportIssueDialogOpen} onOpenChange={setIsReportIssueDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <MessageSquareWarning className="mr-2 h-6 w-6 text-destructive" /> Report an Issue
            </DialogTitle>
            <DialogDescription>
              Describe the issue you are encountering (e.g., unexpected delay, bus malfunction, passenger concern).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Textarea
              placeholder="Please provide a detailed description of the issue..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => {setIsReportIssueDialogOpen(false); setIssueDescription('');}}>Cancel</Button>
            <Button 
              onClick={handleSendIssueReport} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={!issueDescription.trim()}
            >
              <Send className="mr-2 h-4 w-4" /> Send Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route History Dialog */}
      <Dialog open={isRouteHistoryDialogOpen} onOpenChange={setIsRouteHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
              <HistoryIcon className="mr-2 h-6 w-6 text-primary" /> Route History
            </DialogTitle>
            <DialogDescription>
              Review your past completed and partially completed routes.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="py-4 px-2">
              {mockPastRoutes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bus</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPastRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.routeName}</TableCell>
                        <TableCell>{route.date}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              route.status === 'Completed' ? 'default' : 
                              route.status === 'Cancelled' ? 'destructive' : 'secondary'
                            }
                            className={
                              route.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' :
                              route.status === 'Cancelled' ? 'bg-red-500 hover:bg-red-600' :
                              'bg-yellow-500 hover:bg-yellow-600'
                            }
                          >
                            {route.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{route.busNumber || 'N/A'}</TableCell>
                        <TableCell className="text-xs">{route.driverNotes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No past route data available.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRouteHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

