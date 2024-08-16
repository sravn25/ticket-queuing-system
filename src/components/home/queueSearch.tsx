import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getStudentId, QueueData } from "@/lib/queueFirestore";
import toast, { Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";

const studentIdRegex = /^\d{7}$/;

const QueueSearch = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [result, setResult] = useState<QueueData | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    setResult(null);
    e.preventDefault();

    if (!studentIdRegex.test(studentId)) {
      toast.error("Invalid student ID");
      return;
    }

    try {
      const data = await getStudentId(studentId);
      setResult(data);
      if (!data) toast.error("No student ID found");
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    } finally {
      setStudentId("");
    }
  };

  return (
    <>
      <div className="text-black flex flex-col gap-4 justify-center min-h-80">
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center justify-center border rounded sm:mx-auto p-6 bg-slate-600 space-y-6"
        >
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-52"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </div>
          <div className="border p-4 rounded-lg text-white w-full h-full">
            {result ? (
              <div className="space-y-2">
                <h3 className="font-semibold underline underline-offset-2">
                  Queue Search Result
                </h3>
                <div className="text-left text-slate-200">
                  <p>ID: {result.studentId}</p>
                  <p>Name: {result.fullName}</p>
                  <p>Email: {result.studentEmail}</p>
                  <p className="flex items-center gap-2">
                    Queued: <Check className="text-green-500" />
                  </p>
                  <p className="flex items-center gap-2">
                    Collected:
                    {result.collected ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-sm font-light">Search with Student ID</span>
            )}
          </div>
        </form>
      </div>
      <Toaster />
    </>
  );
};

export default QueueSearch;
