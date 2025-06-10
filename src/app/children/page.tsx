"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit3, Trash2, UserCircle2 } from 'lucide-react';
import type { Child, Parent } from '@/types';
import AddChildForm from '@/components/children/add-child-form';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockChildren: Child[] = [
  { id: 'c1', name: 'Leo Wonderland', age: 7, school: 'Wonderland Elementary', parentId: '1', parentName: 'Alice Wonderland', classGrade: '2nd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=Leo' },
  { id: 'c2', name: 'Mia Wonderland', age: 5, school: 'Wonderland Preschool', parentId: '1', parentName: 'Alice Wonderland', classGrade: 'Kindergarten', photoDataUrl: undefined },
  { id: 'c3', name: 'Scoop The Digger', age: 8, school: 'Construction Academy', parentId: '2', parentName: 'Bob The Builder', classGrade: '3rd Grade', photoDataUrl: 'https://placehold.co/50x50.png?text=Scoop' },
];

const mockParentsForSelection: Pick<Parent, 'id' | 'name'>[] = [
  { id: '1', name: 'Alice Wonderland' },
  { id: '2', name: 'Bob The Builder' },
  { id: '3', name: 'Charlie Brown' },
];


export default function ChildrenPage() {
  const handleEditChild = (id: string) => console.log('Edit child', id);
  const handleDeleteChild = (id: string) => console.log('Delete child', id);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Child Profiles</h1>
          <p className="text-muted-foreground">Manage children's profiles for transportation.</p>
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
                    <TableHead>Photo</TableHead>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Class/Grade</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChildren.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={child.photoDataUrl} alt={child.name} data-ai-hint="child portrait" />
                          <AvatarFallback>
                            {child.name.substring(0,1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {child.name}
                      </TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>{child.school}</TableCell>
                      <TableCell>{child.classGrade}</TableCell>
                      <TableCell>{child.parentName || 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-2">
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
               {mockChildren.length === 0 && (
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
              <AddChildForm parents={mockParentsForSelection} />
            </CardContent>
          </Card>
          <Card className="mt-8 shadow-lg">
             <CardContent className="p-0">
               <Image src="https://placehold.co/600x400.png" alt="Children playing" width={600} height={400} className="rounded-lg object-cover" data-ai-hint="children school bus" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
