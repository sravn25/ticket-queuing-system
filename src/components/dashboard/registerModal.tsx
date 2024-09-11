import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RegisterForm from "./registerForm";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  source: "queue" | "wait";
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  studentId,
  source,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Ticket</DialogTitle>
          <DialogDescription>
            Only ticket number is required, Student ID is automatically added.
          </DialogDescription>
        </DialogHeader>
        <RegisterForm studentId={studentId} onClose={onClose} source={source} />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
