
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
  { id: 'p1', name: 'Shema Honore', email: 'shema.honore@example.rw', phoneNumber: '(+250) 788123456', address: 'KG 17 Ave, Kimihurura, Kigali', childrenCount: 2 },
  { id: 'p2', name: 'Uwamahoro Queen', email: 'queen.uwamahoro@example.rw', phoneNumber: '(+250) 788765432', address: 'KN 41 St, Kiyovu, Kigali', childrenCount: 1 },
  { id: 'p3', name: 'Nsabimana Eric', email: 'eric.nsabi@example.rw', phoneNumber: '(+250) 733112233', address: 'KK 15 Rd, Kicukiro, Kigali', childrenCount: 0 },
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
    toast({ title: "Umubyeyi Yongewemo", description: `${newParent.name} yongewemo neza.`});
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
    toast({ title: "Umubyeyi Yahinduwe", description: `Amakuru ya ${updatedData.name} yahinduwe.` });
  };

  const handleDeleteParent = (id: string) => {
    const parentToDelete = parents.find(parent => parent.id === id);
    if (!parentToDelete) return;
    
    if (window.confirm(`Urifuza gusiba amakuru ya ${parentToDelete.name}? Ibi bishobora kugira ingaruka ku bana be.`)) {
      setParents(prevParents => prevParents.filter(parent => parent.id !== id));
      toast({ title: "Umubyeyi Yasibwe", description: `Amakuru ya ${parentToDelete.name} yasibwe.` });
    }
  };

  const handleChangeChildrenCount = (parentId: string, change: number) => {
    const parentToUpdate = parents.find(p => p.id === parentId);
    if (!parentToUpdate) return;

    const action = change > 0 ? "kongeraho" : "kugabanya";
    const confirmMessage = `Urifuza ${action} umwana kuri ${parentToUpdate.name}? Ibi bizahindura umubare w'abana be.`;
    
    if (window.confirm(confirmMessage)) {
      if (parentToUpdate.childrenCount + change < 0) {
        toast({ title: "Igikorwa Cyabujijwe", description: "Umubare w'abana ntushobora kuba munsi ya zero.", variant: "destructive"});
        return;
      }
      setParents(prevParents => 
        prevParents.map(p => 
          p.id === parentId ? { ...p, childrenCount: p.childrenCount + change } : p
        )
      );
      toast({ title: "Umubare w'Abana Wahinduwe", description: `Umubare w'abana ba ${parentToUpdate.name} ubu ni ${parentToUpdate.childrenCount + change}.`});
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center"><Users className="mr-2 h-8 w-8"/>Konti z'Ababyeyi</h1>
          <p className="text-muted-foreground">Genzura amakuru y'ababyeyi n'abana babo.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Ongeramo Umubyeyi Mushya
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Urutonde rw'Ababyeyi</CardTitle>
          <CardDescription>Reba kandi ucunge ababyeyi banditse.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Izina</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefoni</TableHead>
                <TableHead>Aderesi</TableHead>
                <TableHead className="text-center">Abana</TableHead>
                <TableHead className="text-right">Ibikorwa</TableHead>
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
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(parent)} aria-label="Hindura umubyeyi">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleChangeChildrenCount(parent.id, 1)} aria-label="Ongeraho umwana ku mubare">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleChangeChildrenCount(parent.id, -1)} aria-label="Gabuanya umwana ku mubare" disabled={parent.childrenCount === 0}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteParent(parent.id)} aria-label="Siba umubyeyi">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {parents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nta babyeyi barongerwamo.</p>
          )}
        </CardContent>
      </Card>

      {/* Add Parent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Ongeramo Umubyeyi Mushya
            </DialogTitle>
            <DialogDescription>Andikisha konti nshya y'umubyeyi.</DialogDescription>
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
                <Edit3 className="mr-2 h-5 w-5 text-primary" /> Hindura Amakuru y'Umubyeyi
              </DialogTitle>
              <DialogDescription>Hindura amakuru ya {editingParent.name}.</DialogDescription>
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
