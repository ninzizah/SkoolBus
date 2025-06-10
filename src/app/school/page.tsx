
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { School as SchoolIcon, Users, Route, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SchoolPortalPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
            <SchoolIcon className="mr-3 h-8 w-8" /> School Portal
          </h1>
          <p className="text-muted-foreground">Manage your school's students, routes, and settings.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Users className="mr-2 h-5 w-5 text-accent" /> Student Management
            </CardTitle>
            <CardDescription>View, add, and update student profiles for your school.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This section would allow authenticated school staff to manage students enrolled in their specific school.
            </p>
            <Button variant="outline" disabled>Manage Students (Coming Soon)</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Route className="mr-2 h-5 w-5 text-accent" /> Route Management
            </CardTitle>
            <CardDescription>Oversee bus routes and assignments specific to your school.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              School administrators could define or adjust routes that service their school and assign students.
            </p>
            <Button variant="outline" disabled>Manage Routes (Coming Soon)</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Settings className="mr-2 h-5 w-5 text-accent" /> School Settings
            </CardTitle>
            <CardDescription>Update school information and communication preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Edit details like contact information, operational hours, or notification settings for your school.
            </p>
            <Button variant="outline" disabled>Configure Settings (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Image 
          src="https://placehold.co/800x300.png" 
          alt="School campus illustration" 
          width={800} 
          height={300} 
          className="rounded-lg shadow-xl mx-auto"
          data-ai-hint="school campus modern" 
        />
        <p className="mt-4 text-muted-foreground">
          This portal is designed to provide a dedicated space for school administrators and staff. <br />
          Full functionality, including login and data segregation per school, would be implemented in a production system.
        </p>
      </div>
    </div>
  );
}
