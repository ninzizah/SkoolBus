
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { School, SchoolFormData } from '@/types';
import AddSchoolForm from '@/components/admin/schools/add-school-form';
import { useToast } from '@/hooks/use-toast';

const initialMockSchools: School[] = [
  { id: 'sch1', name: 'Groupe Scolaire Kacyiru', address: 'KG 548 St, Kacyiru, Kigali', contactPhone: '(+250) 788 XXX XXX', contactEmail: 'contact@gskacyiru.ac.rw' },
  { id: 'sch2', name: 'Lycee de Kigali', address: 'KN 29 St, Nyarugenge, Kigali', contactPhone: '(+250) 789 YYY YYY', contactEmail: 'info@lyceedekigali.sc.rw' },
  { id: 'sch3', name: 'Green Hills Academy', address: 'KG 278 St, Nyarutarama, Kigali', contactPhone: '(+250) 787 ZZZ ZZZ', contactEmail: 'admin@greenhillsacademy.rw' },
];

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<School[]>(initialMockSchools);
  const { toast } = useToast();

  const handleAddSchool = (newSchool: School) => {
    setSchools(prevSchools => [...prevSchools, newSchool]);
  };

  const handleEditSchool = (id: string) => {
    const schoolToEdit = schools.find(school => school.id === id);
    if (!schoolToEdit) return;

    const newName = window.prompt("Shyiramo izina rishya ry'ishuri:", schoolToEdit.name);
    if (newName && newName.trim() !== "") {
      setSchools(prevSchools =>
        prevSchools.map(school =>
          school.id === id ? { ...school, name: newName.trim() } : school
        )
      );
      toast({ title: "Ishuri Ryahinduwe", description: `Izina ry'ishuri ryahinduwe ${newName.trim()}.` });
    } else if (newName === "") {
      toast({ title: "Igikorwa Cyahagaritswe", description: "Izina ry'ishuri ntirishobora kuba ubusa.", variant: "destructive" });
    }
  };

  const handleDeleteSchool = (id: string) => {
    const schoolToDelete = schools.find(school => school.id === id);
    if (!schoolToDelete) return;

    if (window.confirm(`Urifuza gusiba ${schoolToDelete.name}?`)) {
      setSchools(prevSchools => prevSchools.filter(school => school.id !== id));
      toast({ title: "Ishuri Ryasibwe", description: `${schoolToDelete.name} ryasibwe.` });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
            <Building className="mr-3 h-8 w-8" /> Icunga Mashuri
          </h1>
          <p className="text-muted-foreground">Genzura amashuri, ibipimo, n'amakuru ajyanye n'ingendo.</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Amashuri Yanditswe</CardTitle>
              <CardDescription>Reba kandi ucunge amashuri yose ari muri sisitemu.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Izina ry'Ishuri</TableHead>
                    <TableHead>Aderesi</TableHead>
                    <TableHead>Telefoni</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Ibikorwa</TableHead>
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
                        <Button variant="outline" size="icon" onClick={() => handleEditSchool(school.id)} aria-label="Hindura Ishuri">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteSchool(school.id)} aria-label="Siba Ishuri">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {schools.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nta mashuri arongerwamo.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-accent" /> Ongeramo Ishuri Rishya
              </CardTitle>
              <CardDescription>Andikisha ishuri rishya.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSchoolForm onSchoolAdded={handleAddSchool} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
