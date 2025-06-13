
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { Parent, ParentFormData } from '@/types';
import AddParentForm from '@/components/parents/add-parent-form';
import { useToast } from "@/hooks/use-toast";

// Mock data for parents
const initialMockParents: Parent[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phoneNumber: '(250)-0101', address: '123 Rabbit Hole Ln, Wonderland', childrenCount: 2 },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phoneNumber: '(250)-0102', address: '456 Fixit Ave, Tooltown', childrenCount: 1 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phoneNumber: '(250)-0103', address: '789 Kite St, Toonville', childrenCount: 3 },
];

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>(initialMockParents);
  const { toast } = useToast();

  const handleAddParent = (newParentData: ParentFormData) => {
    const newParent: Parent = {
      ...newParentData,
      id: `p-${Math.random().toString(36).substring(2, 9)}`,
      childrenCount: 0, // New parents initially have 0 children
    };
    setParents(prevParents => [...prevParents, newParent]);
  };
  
  const handleEditParent = (id: string) => {
    const parentToEdit = parents.find(parent => parent.id === id);
    if (!parentToEdit) return;

    const newName = window.prompt("Enter new parent name:", parentToEdit.name);
    if (newName && newName.trim() !== "") {
      setParents(prevParents =>
        prevParents.map(parent =>
          parent.id === id ? { ...parent, name: newName.trim() } : parent
        )
      );
      toast({ title: "Parent Updated", description: `Parent's name changed to ${newName.trim()}.` });
    } else if (newName === "") {
      toast({ title: "Update Cancelled", description: "Parent's name cannot be empty.", variant: "destructive" });
    }
  };

  const handleDeleteParent = (id: string) => {
    const parentToDelete = parents.find(parent => parent.id === id);
    if (!parentToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete ${parentToDelete.name}'s profile? This might affect associated children.`)) {
      setParents(prevParents => prevParents.filter(parent => parent.id !== id));
      toast({ title: "Parent Deleted", description: `${parentToDelete.name}'s profile has been deleted.` });
    }
  };

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
                  {parents.map((parent) => (
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
              {parents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No parents added yet.</p>
              )}
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
              <AddParentForm onParentAdded={handleAddParent} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
