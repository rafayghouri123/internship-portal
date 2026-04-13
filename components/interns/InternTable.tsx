"use client";

import Link from "next/link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { InternStatusBadge } from "@/components/interns/InternStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type InternRow = {
  id: string;
  fullName: string;
  cnicNumber: string;
  university: string;
  department?: { name: string } | null;
  supervisorName?: string | null;
  joiningDate: string;
  endDate: string;
  status: string;
};

type InternTableProps = {
  data: InternRow[];
};

const columns: ColumnDef<InternRow>[] = [
  {
    accessorKey: "fullName",
    header: "Name"
  },
  {
    accessorKey: "cnicNumber",
    header: "CNIC"
  },
  {
    accessorKey: "university",
    header: "University"
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => row.original.department?.name ?? "Unassigned"
  },
  {
    accessorKey: "supervisorName",
    header: "Supervisor",
    cell: ({ row }) => row.original.supervisorName ?? "Pending"
  },
  {
    accessorKey: "joiningDate",
    header: ({ column }) => (
      <Button className="px-0 text-xs" size="sm" variant="ghost" onClick={() => column.toggleSorting()}>
        Joining Date
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    )
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <Button className="px-0 text-xs" size="sm" variant="ghost" onClick={() => column.toggleSorting()}>
        End Date
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InternStatusBadge status={row.original.status} />
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="secondary">
        <Link href={`/interns/${row.original.id}`}>Edit</Link>
      </Button>
    )
  }
];

export function InternTable({ data }: InternTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="overflow-hidden rounded-xl border border-dalda-gray-100 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : String(cell.getValue() ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
