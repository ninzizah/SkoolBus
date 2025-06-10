
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { School, SchoolFormData } from '@/types';
import AddSchoolForm from '@/components/admin/schools/add-school-form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const initialMockSchools: School[] = [
  { id: 'sch1', name: 'Wonderland Elementary', address: '123 Fantasy Lane, Storyville, ST 12345', contactPhone: '555-0101', contactEmail: 'contact@wonderland.edu' },
  { id: 'sch2', name: 'Construction Academy', address: '456 Builder Ave, Tooltown, TT 67890', contactPhone: '555-0102', contactEmail: 'info@constructionacad.org' },
  { id: 'sch3', name: 'Oakwood High', address: '789 Knowledge Rd, Learnsville, LV 13579', contactPhone: '555-0103', contactEmail: 'admin@oakwoodhigh.com' },
];

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<School[]>(initialMockSchools);
  const { toast } = useToast();

  const handleAddSchool = (newSchool: School) => {
    setSchools(prevSchools => [...prevSchools, newSchool]);
  };

  const handleEditSchool = (id: string) => {
    console.log('Edit school', id);
    toast({ title: "Action Placeholder", description: "Edit functionality is not yet implemented." });
  };

  const handleDeleteSchool = (id: string) => {
    console.log('Delete school', id);
    // For demo, actually remove from list:
    // setSchools(prevSchools => prevSchools.filter(school => school.id !== id));
    // toast({ title: "School Deleted", description: "School has been removed (locally)." });
    toast({ title: "Action Placeholder", description: "Delete functionality is not yet implemented." });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
            <Building className="mr-3 h-8 w-8" /> School Management
          </h1>
          <p className="text-muted-foreground">Oversee school profiles, settings, and transportation details.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8"> {/* Changed from grid to flex-col */}
        <div> {/* Wrapper for Registered Schools Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Registered Schools</CardTitle>
              <CardDescription>Browse and manage all schools in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact Phone</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.address}</TableCell>
                      <TableCell>{school.contactPhone}</TableCell>
                      <TableCell>{school.contactEmail}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditSchool(school.id)} aria-label="Edit school">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteSchool(school.id)} aria-label="Delete school">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {schools.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No schools added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6"> {/* Wrapper for Add New School Card and Image Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Add New School
              </CardTitle>
              <CardDescription>Register a new school profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSchoolForm onSchoolAdded={handleAddSchool} />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardContent className="p-0">
               <Image src="https://placehold.co/600x400.png" alt="School building illustration" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="school building modern"/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
