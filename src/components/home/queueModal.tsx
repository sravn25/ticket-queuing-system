import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { UsersRound } from "lucide-react";
import QueueForm from "./queueForm";

const QueueModal = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-slate-100 text-slate-700 rounded px-3 py-2 hover:bg-slate-300">
          <div className="flex items-center gap-2 font-zendots text-lg font-medium">
            Click here to Queue <UsersRound fill="" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Queue</DialogTitle>
            <DialogDescription>
              Please use your full name (English), student ID, and student Email
            </DialogDescription>
            <QueueForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueModal;
