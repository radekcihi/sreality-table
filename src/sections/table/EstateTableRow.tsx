'use client';

import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { type Estate } from './api/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import PropertyForm from '../property/PropertyForm';
import { Badge } from '@/components/ui/badge';
import { renderCategory, renderType } from './api/utils';

export default function EstateTableRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Estate;
  onEdit: (item: Estate) => void;
  onDelete: (id: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TableRow>
      <TableCell>
        {item.new ? (
          <Badge className="m-1 h-5 rounded-full bg-slate-500 uppercase">New</Badge>
        ) : null}
        {item.name}
      </TableCell>
      <TableCell>{item.locality}</TableCell>
      <TableCell>{item.price.toLocaleString()} Kč</TableCell>
      <TableCell>{renderType(item.type)}</TableCell>
      <TableCell>{renderCategory(item.category)}</TableCell>
      <TableCell>{item.labels.join(', ')}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Property</DialogTitle>
              </DialogHeader>
              <PropertyForm
                onSubmit={(updatedItem) => {
                  onEdit({ ...updatedItem, hash_id: item.hash_id });
                  setIsOpen(false);
                }}
                initialData={item}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => onDelete(item.hash_id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
