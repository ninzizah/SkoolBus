
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { Parent } from '@/types';
import AddParentForm from '@/components/parents/add-parent-form';

// Mock data for parents
const mockParents: Parent[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phoneNumber: '555-0101', address: '123 Rabbit Hole Ln, Wonderland', childrenCount: 2 },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phoneNumber: '555-0102', address: '456 Fixit Ave, Tooltown', childrenCount: 1 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phoneNumber: '555-0103', address: '789 Kite St, Toonville', childrenCount: 3 },
];

export default function ParentsPage() {
  // In a real app, these would be server actions or client-side state updates
  const handleEditParent = (id: string) => console.log('Edit parent', id);
  const handleDeleteParent = (id: string) => console.log('Delete parent', id);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Parent Accounts</h1>
          <p className="text-muted-foreground">Manage parent profiles and their associated children.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Parent List</CardTitle>
              <CardDescription>Browse and manage registered parents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-center">Children</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockParents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell className="font-medium">{parent.name}</TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>{parent.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{parent.address || 'N/A'}</TableCell>
                      <TableCell className="text-center">{parent.childrenCount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditParent(parent.id)} aria-label="Edit parent">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteParent(parent.id)} aria-label="Delete parent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Add New Parent
              </CardTitle>
              <CardDescription>Register a new parent account.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddParentForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
