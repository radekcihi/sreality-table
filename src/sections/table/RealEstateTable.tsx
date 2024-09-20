'use client';

import React, { useCallback, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import AddPropertyButton from './AddPropertyButton';
import EstateTable from './EstateTable';
import type { Estate } from './api/types';
import { fetchEstates } from './api/utils';
import { searchParams } from '@/lib/searchParams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '../layout/Pagination';
import SearchAndFilterBar from './SearchAndFilterBar';

export default function RealEstateTable({
  initialData,
}: {
  initialData: {
    estates: Estate[];
    totalPages: number;
  };
}) {
  const { toast } = useToast();
  const [page, setPage] = useQueryState('page', searchParams.page);
  const [perPage, setPerPage] = useQueryState('perPage', searchParams.perPage);

  const [estateAge] = useQueryState('estateAge', searchParams.estateAge);
  const [category] = useQueryState('category', searchParams.category);

  const [localEstates, setLocalEstates] = useState<Estate[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['estates', estateAge, category, page, perPage],
    queryFn: () => fetchEstates(page, perPage, estateAge, category),
    initialData: initialData,
  });

  const handleAdd = useCallback(
    (newItem: Omit<Estate, 'hash_id'>) => {
      const newEstate: Estate = {
        ...newItem,
        hash_id: Math.floor(Math.random() * 1000000),
      };
      setLocalEstates((prev) => [newEstate, ...prev]);
      toast({
        title: 'Success',
        description: 'New property added successfully.',
      });
    },
    [toast]
  );

  const handleEdit = useCallback(
    (editedItem: Estate) => {
      setLocalEstates((prev) =>
        prev.map((item) => (item.hash_id === editedItem.hash_id ? editedItem : item))
      );
      toast({
        title: 'Success',
        description: 'Property updated successfully.',
      });
    },
    [toast]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setLocalEstates((prev) => prev.filter((item) => item.hash_id !== id));
      toast({
        title: 'Success',
        description: 'Property deleted successfully.',
      });
    },
    [toast]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      await setPage(newPage);
    },
    [setPage]
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data && isError) return <div>Error: {error.message}</div>;

  const displayedEstates = localEstates.length > 0 ? localEstates : data.estates;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <SearchAndFilterBar />

        <AddPropertyButton onAdd={handleAdd} />
      </div>
      <EstateTable data={displayedEstates} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="flex items-center justify-between">
        <div>
          <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination
          currentPage={Number(page)}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
