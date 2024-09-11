import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Orbit } from "lucide-react";
import QueueProgress from "./home/queueProgress";
import { Toaster } from "react-hot-toast";
import QueueDataTable from "./table/queueDataTable";
import WaitDataTable from "./table/waitDataTable";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useState } from "react";
import RegisterDataTable from "./table/registerDataTable";
import StatisticBox from "./dashboard/statistics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type tab = "queue" | "wait" | "register";

const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTable, setActiveTable] = useState<tab>("queue");

  const renderTable = () => {
    switch (activeTable) {
      case "queue":
        return <QueueDataTable />;
      case "wait":
        return <WaitDataTable />;
      case "register":
        return <RegisterDataTable />;
      default:
        return <QueueDataTable />;
    }
  };

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
      <div className="flex flex-col justify-center items-center gap-2">
        <p>Table type: </p>
        <ToggleGroup
          type="single"
          variant="outline"
          value={activeTable}
          onValueChange={(value: tab) => {
            if (value) setActiveTable(value);
          }}
          className="flex"
        >
          <ToggleGroupItem value="queue" className="w-full flex flex-col">
            18th
            <div className="font-semibold">Queue</div>
          </ToggleGroupItem>
          <ToggleGroupItem value="wait" className="w-full flex flex-col">
            19th
            <div className="font-semibold">Wait</div>
          </ToggleGroupItem>
          <ToggleGroupItem value="register" className="w-full flex flex-col">
            20th
            <div className="font-semibold">Register</div>
          </ToggleGroupItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-lg border px-4 py-2 font-medium italic hover:bg-gray-100">
              Statistics
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <StatisticBox />
            </DropdownMenuContent>
          </DropdownMenu>
        </ToggleGroup>
      </div>
      {renderTable()}
      <Toaster />
    </>
  );
};

export default Dashboard;
