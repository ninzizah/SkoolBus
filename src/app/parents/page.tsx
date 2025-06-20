
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, UserPlus, UserMinus, Users } from 'lucide-react';
import type { Parent, ParentFormData } from '@/types';
import AddParentForm from '@/components/parents/add-parent-form';
import EditParentForm from '@/components/parents/edit-parent-form';
import { useToast } from "@/hooks/use-toast";

const initialMockParents: Parent[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phoneNumber: '(250)-0101', address: '123 Rabbit Hole Ln, Wonderland', childrenCount: 2 },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phoneNumber: '(250)-0102', address: '456 Fixit Ave, Tooltown', childrenCount: 1 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phoneNumber: '(250)-0103', address: '789 Kite St, Toonville', childrenCount: 0 },
];

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>(initialMockParents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const { toast } = useToast();

  const handleAddParent = (newParentData: ParentFormData) => {
    const newParent: Parent = {
      ...newParentData,
      id: `p-${Math.random().toString(36).substring(2, 9)}`,
      childrenCount: 0, 
    };
    setParents(prevParents => [...prevParents, newParent]);
    setIsAddDialogOpen(false); // Close dialog after adding
    toast({ title: "Parent Added", description: `${newParent.name} has been added successfully.`});
  };
  
  const openEditDialog = (parent: Parent) => {
    setEditingParent(parent);
    setIsEditDialogOpen(true);
  };

  const handleUpdateParent = (updatedData: ParentFormData) => {
    if (!editingParent) return;
    setParents(prevParents =>
      prevParents.map(p =>
        p.id === editingParent.id ? { ...p, ...updatedData } : p
      )
    );
    setIsEditDialogOpen(false);
    setEditingParent(null);
    toast({ title: "Parent Updated", description: `${updatedData.name}'s profile has been updated.` });
  };

  const handleDeleteParent = (id: string) => {
    const parentToDelete = parents.find(parent => parent.id === id);
    if (!parentToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete ${parentToDelete.name}'s profile? This might affect associated children.`)) {
      setParents(prevParents => prevParents.filter(parent => parent.id !== id));
      toast({ title: "Parent Deleted", description: `${parentToDelete.name}'s profile has been deleted.` });
    }
  };

  const handleChangeChildrenCount = (parentId: string, change: number) => {
    const parentToUpdate = parents.find(p => p.id === parentId);
    if (!parentToUpdate) return;

    const action = change > 0 ? "add" : "remove";
    const confirmMessage = `Are you sure you want to ${action} a child for ${parentToUpdate.name}? This will ${action === "add" ? "increment" : "decrement"} their children count.`;
    
    if (window.confirm(confirmMessage)) {
      if (parentToUpdate.childrenCount + change < 0) {
        toast({ title: "Action Blocked", description: "Children count cannot be negative.", variant: "destructive"});
        return;
      }
      setParents(prevParents => 
        prevParents.map(p => 
          p.id === parentId ? { ...p, childrenCount: p.childrenCount + change } : p
        )
      );
      toast({ title: "Children Count Updated", description: `${parentToUpdate.name}'s children count is now ${parentToUpdate.childrenCount + change}.`});
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center"><Users className="mr-2 h-8 w-8"/>Parent Accounts</h1>
          <p className="text-muted-foreground">Manage parent profiles and their associated children.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Parent
        </Button>
      </div>

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
                  <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(parent)} aria-label="Edit parent">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleChangeChildrenCount(parent.id, 1)} aria-label="Add child to count">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleChangeChildrenCount(parent.id, -1)} aria-label="Remove child from count" disabled={parent.childrenCount === 0}>
                      <UserMinus className="h-4 w-4" />
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

      {/* Add Parent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Add New Parent
            </DialogTitle>
            <DialogDescription>Register a new parent account.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AddParentForm onParentAdded={handleAddParent} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Parent Dialog */}
      {editingParent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline flex items-center">
                <Edit3 className="mr-2 h-5 w-5 text-primary" /> Edit Parent Profile
              </DialogTitle>
              <DialogDescription>Update the details for {editingParent.name}.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EditParentForm 
                parent={editingParent} 
                onFormSubmit={handleUpdateParent}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingParent(null);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
