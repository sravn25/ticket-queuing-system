import { useRegistration } from "@/contexts/RegistrationContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Ban, CircleArrowUp, Copy, MoreHorizontal, Ticket } from "lucide-react";
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
import toast from "react-hot-toast";
import { cancelWaitTicket, updateWaitingToQueuing } from "@/lib/waitFirestore";

const WaitDataTable = () => {
  const { waitingData, refreshWaitData } = useRegistration();
  const [loading, setLoading] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string>("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!waitingData) {
      refreshWaitData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [waitingData, refreshWaitData]);

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
        {waitingData && waitingData.length > 0 ? (
          <QueueTable
            columns={[
              ...columns,

              {
                id: "actions",
                cell: ({ row }) => {
                  const wait = row.original;
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
                        {wait.queuingStatus ===
                        "collected" ? null : wait.queuingStatus ===
                          "cancelled" ? null : wait.queuingStatus ===
                          "waiting" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              updateWaitingToQueuing(wait.studentId);
                              toast.success("Updated waiting to queuing");
                              refreshWaitData();
                            }}
                            className="text-orange-500 font-semibold"
                          >
                            <CircleArrowUp className="w-4 h-4 mr-2" />
                            Queue
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              handleRegisterModalOpen();
                              setStudentId(wait.studentId);
                            }}
                            className="text-green-500 font-semibold"
                          >
                            <Ticket className="w-4 h-4 mr-2" />
                            Register
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(wait.studentEmail);
                            toast.success("Copied student email");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Student Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(wait.personalEmail);
                            toast.success("Copied personal email");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Personal Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(wait.phoneNumber);
                            toast.success("Copied phone number");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" /> Phone Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {wait.queuingStatus ===
                        "collected" ? null : wait.queuingStatus ===
                          "cancelled" ? null : (
                          <DropdownMenuItem
                            className="font-semibold text-red-500"
                            onClick={() => {
                              cancelWaitTicket(
                                wait.studentId,
                                wait.studentEmail,
                              );
                              toast.success("Cancelled wait ticket");
                              refreshWaitData();
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
            data={waitingData}
          />
        ) : (
          <p>No data available</p>
        )}
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          studentId={studentId}
          source="wait"
        />
      </div>
    </>
  );
};

export default WaitDataTable;
