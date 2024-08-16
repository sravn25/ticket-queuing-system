import { ColumnDef } from "@tanstack/react-table";
import { QueueData, updateCollected } from "@/lib/queueFirestore";
import { Check, X, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

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
    accessorKey: "studentEmail",
    header: "Student Email",
  },
  //{
  //  accessorKey: "personalEmail",
  //  header: "Email",
  //},
  //{
  //  accessorKey: "phoneNumber",
  //  header: "Phone",
  //},
  {
    accessorKey: "dateTime",
    header: "Date",
  },
  {
    accessorKey: "collected",
    header: "Collected",
    cell: ({ row }) =>
      row.original.collected ? (
        <Check className="text-green-500" />
      ) : (
        <X className="text-red-500" />
      ),
  },
  //{
  //  id: "actions",
  //  cell: ({ row }) => {
  //    const queue = row.original;
  //    return (
  //      <DropdownMenu>
  //        <DropdownMenuTrigger asChild>
  //          <Button variant="ghost" className="h-8 w-8 p-0">
  //            <span className="sr-only">Open menu</span>
  //            <MoreHorizontal className="h-4 w-4" />
  //          </Button>
  //        </DropdownMenuTrigger>
  //        <DropdownMenuContent align="end">
  //          <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //          <DropdownMenuItem
  //            onClick={() => {
  //              updateCollected(queue.studentId);
  //            }}
  //          >
  //            Update collect status
  //          </DropdownMenuItem>
  //          <DropdownMenuItem
  //            onClick={() => navigator.clipboard.writeText(queue.personalEmail)}
  //          >
  //            Copy Personal Email
  //          </DropdownMenuItem>
  //          <DropdownMenuItem
  //            onClick={() => navigator.clipboard.writeText(queue.phoneNumber)}
  //          >
  //            Copy Phone Number
  //          </DropdownMenuItem>
  //          <DropdownMenuSeparator />
  //          <DropdownMenuItem className="font-semibold text-red-500">
  //            Delete
  //          </DropdownMenuItem>
  //        </DropdownMenuContent>
  //      </DropdownMenu>
  //    );
  //  },
  //},
];
