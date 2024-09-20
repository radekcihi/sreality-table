'use client';

import React from 'react';
import { useQueryState } from 'nuqs';
import AddPropertyButton from '../property/AddPropertyButton';
import EstateTable from './EstateTable';
import type { Estate, EstateWithoutHashId } from './api/types';
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
import { useLocalEstate } from '@/hooks/useLocalEstate';

export default function RealEstateTable({
  initialData,
}: {
  initialData: {
    estates: Estate[];
    totalPages: number;
  };
}) {
  const [page, setPage] = useQueryState('page', searchParams.page);
  const [perPage, setPerPage] = useQueryState('perPage', searchParams.perPage);
  const [estateAge] = useQueryState('estateAge', searchParams.estateAge);
  const [category] = useQueryState('category', searchParams.category);

  const { estates, addEstate, updateEstate, deleteEstate, isLoading, isError, error, totalPages } =
    useLocalEstate({
      initialData,
      page,
      perPage,
      estateAge,
      category,
    });

  const handleAdd = async (newEstate: EstateWithoutHashId) => {
    await addEstate.mutateAsync(newEstate);
  };

  const handleEdit = async (updatedEstate: Estate) => {
    await updateEstate.mutateAsync(updatedEstate);
  };

  const handleDelete = async (estateId: number) => {
    await deleteEstate.mutateAsync(estateId);
  };
  const handlePageChange = async (newPage: number) => {
    await setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <SearchAndFilterBar />
        <AddPropertyButton onAdd={handleAdd} />
      </div>
      <EstateTable data={estates} onEdit={handleEdit} onDelete={handleDelete} />
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
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
