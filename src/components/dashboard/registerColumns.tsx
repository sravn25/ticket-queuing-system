import { ColumnDef } from "@tanstack/react-table";
import { Check, X, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { RegisterData } from "@/lib/registerFirestore";

export const registerColumns: ColumnDef<RegisterData>[] = [
  {
    accessorKey: "ticketNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticket Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.ticketNumber ? (
        <span>{row.original.ticketNumber}</span>
      ) : (
        <X className="text-red-500" />
      );
    },
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "registered",
    header: "Registered",
    cell: ({ row }) =>
      row.original.registered ? (
        <Check className="text-green-500" />
      ) : (
        <X className="text-red-500" />
      ),
  },
];
