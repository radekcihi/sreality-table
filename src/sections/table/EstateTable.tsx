import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Estate } from './api/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import EstateTableRow from './EstateTableRow';

const columnHelper = createColumnHelper<Estate>();

export default function EstateTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Estate[];
  onEdit: (item: Estate) => void;
  onDelete: (id: number) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('locality', { header: 'Locality' }),
      columnHelper.accessor('price', { header: 'Price' }),
      columnHelper.accessor('type', { header: 'Type' }),
      columnHelper.accessor('category', { header: 'Category' }),
      columnHelper.accessor('labels', { header: 'Labels' }),
      columnHelper.display({ id: 'actions', header: 'Actions' }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: <ChevronUp className="ml-1 inline h-4 w-4" />,
                  desc: <ChevronDown className="ml-1 inline h-4 w-4" />,
                }[header.column.getIsSorted() as string] ?? null}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <EstateTableRow key={row.id} item={row.original} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  );
}
