
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface ManageHODsTableProps {
  hods: User[];
  onEdit: (hod: User) => void;
}

const ManageHODsTable: React.FC<ManageHODsTableProps> = ({ hods, onEdit }) => {
  return (
    <div className="rounded-md border">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Manage HODs</h2>
        <p className="text-muted-foreground">
          View and edit HOD details across all departments
        </p>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No HODs found
                </TableCell>
              </TableRow>
            ) : (
              hods.map((hod) => (
                <TableRow key={hod.id}>
                  <TableCell>{hod.name}</TableCell>
                  <TableCell>{hod.email}</TableCell>
                  <TableCell>{hod.department}</TableCell>
                  <TableCell>{hod.phone || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onEdit(hod)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageHODsTable;
