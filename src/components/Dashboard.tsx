import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Orbit, MoreHorizontal, Ticket } from "lucide-react";
import {
  fetchQueueData,
  QueueData,
  updateCollected,
} from "@/lib/queueFirestore";
import { QueueTable } from "./dashboard/queueTable";
import { columns } from "./dashboard/columns";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import QueueProgress from "./home/queueProgress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import toast, { Toaster } from "react-hot-toast";
import RegisterModal from "./dashboard/registerModal";

const Dashboard = () => {
  const { logout } = useAuth();
  const [queueData, setQueueData] = useState<QueueData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);
  const [studentId, setStudentId] = useState<string>("");

  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const allQueueData = await fetchQueueData();
        setQueueData(allQueueData);
      } catch (error) {
        console.error("Error fetching queue data:", error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      getData();
    }, 500);
    console.log(refresh);
  }, [refresh]);

  const handleRegisterModalOpen = () => {
    setIsRegisterModalOpen(true);
  };

  //const handleRegisterModalClose = () => {
  //  setIsRegisterModalOpen(false);
  //};

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
      <div className="flex justify-between items-center p-4">
        <Link to="/">
          <Orbit className="w-8 h-8" />
        </Link>
        <h1 className="text-2xl font-light">Ticket Dashboard</h1>
        <Button onClick={logout}>Log Out</Button>
      </div>
      <div className="px-16 py-4">
        <QueueProgress />
      </div>
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
                        {queue.collected ? null : (
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
                            updateCollected(queue.studentId);
                            setRefresh(refresh + 1);
                            toast.success("Updating collection status");
                          }}
                        >
                          Update collect status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(queue.personalEmail)
                          }
                        >
                          Copy Personal Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(queue.phoneNumber)
                          }
                        >
                          Copy Phone Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="font-semibold text-red-500">
                          Delete
                        </DropdownMenuItem>
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
        />
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;
