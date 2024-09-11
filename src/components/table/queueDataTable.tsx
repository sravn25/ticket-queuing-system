import { useRegistration } from "@/contexts/RegistrationContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Ban, Copy, MoreHorizontal, Ticket } from "lucide-react";
import { QueueTable } from "../dashboard/queueTable";
import { columns } from "../dashboard/columns";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import RegisterModal from "../dashboard/registerModal";
import { cancelQueueTicket } from "@/lib/queueFirestore";
import toast from "react-hot-toast";

const QueueDataTable = () => {
  const { queueData, refreshQueueData } = useRegistration();
  const [loading, setLoading] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string>("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!queueData) {
      refreshQueueData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [queueData, refreshQueueData]);

  const handleRegisterModalOpen = () => {
    setIsRegisterModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-3 p-32">
        <Skeleton className="h-96 w-96 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {queueData && queueData.length > 0 ? (
          <QueueTable
            columns={[
              ...columns,

              {
                id: "actions",
                cell: ({ row }) => {
                  const queue = row.original;
                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {queue.queuingStatus ===
                        "collected" ? null : queue.queuingStatus ===
                          "cancelled" ? null : (
                          <DropdownMenuItem
                            onClick={() => {
                              handleRegisterModalOpen();
                              setStudentId(queue.studentId);
                            }}
                            className="text-green-500 font-semibold"
                          >
                            <Ticket className="w-4 h-4 mr-2" />
                            Register
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(queue.studentEmail);
                            toast.success("Copied student email");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Student Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(queue.personalEmail);
                            toast.success("Copied personal email");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Personal Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(queue.phoneNumber);
                            toast.success("Copied phone number");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Phone Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {queue.queuingStatus ===
                        "collected" ? null : queue.queuingStatus ===
                          "cancelled" ? null : (
                          <DropdownMenuItem
                            className="font-semibold text-red-500"
                            onClick={() => {
                              cancelQueueTicket(
                                queue.studentId,
                                queue.studentEmail,
                              );
                              toast.success("Cancelled queue ticket");
                              refreshQueueData();
                            }}
                          >
                            <Ban className="h-4 w-4 mr-2" /> Cancel Ticket
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                },
              },
            ]}
            data={queueData}
          />
        ) : (
          <p>No data available</p>
        )}
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          studentId={studentId}
          source="queue"
        />
      </div>
    </>
  );
};

export default QueueDataTable;
