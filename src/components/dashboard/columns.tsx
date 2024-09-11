import { ColumnDef } from "@tanstack/react-table";
import { QueueData } from "@/lib/queueFirestore";
import { Check, X, ArrowUpDown, Users, Loader } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<QueueData>[] = [
  {
    accessorKey: "rank",
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
    accessorKey: "studentId",
    header: "ID",
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "dateTime",
    header: "Date",
  },
  {
    accessorKey: "queuingStatus",
    header: "Status",
    cell: ({ row }) =>
      row.original.queuingStatus === "collected" ? (
        <Check className="text-green-500" />
      ) : row.original.queuingStatus === "cancelled" ? (
        <X className="text-red-500" />
      ) : row.original.queuingStatus === "queuing" ? (
        <Users className="text-yellow-500" />
      ) : (
        <Loader className="text-yellow-500" />
      ),
  },
  {
    accessorKey: "ticketNumber",
    header: "Ticket Number",
    cell: ({ row }) => {
      return row.original.ticketNumber ? (
        <span>{row.original.ticketNumber}</span>
      ) : (
        <X className="text-red-500" />
      );
    },
  },
];
