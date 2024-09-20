import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import PropertyForm from './PropertyForm';
import { type EstateWithoutHashId } from './api/types';
import { useState } from 'react';

export default function AddPropertyButton({
  onAdd,
}: {
  onAdd: (item: EstateWithoutHashId) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <PropertyForm
          onSubmit={(item) => {
            onAdd(item);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
