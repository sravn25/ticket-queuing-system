import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { getQueueCount } from "@/lib/queueFirestore";

const MAX_TICKETS = 1500;

const QueueProgress = () => {
  const [progress, setProgress] = useState<number>(0);

  const getCount = async (): Promise<void> => {
    try {
      const data = await getQueueCount();
      setProgress(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    getCount();

    const interval = setInterval(() => {
      getCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //const progressPercentage = (progress / MAX_TICKETS) * 100;
  const progressPercentage = 80;

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <h3 className="text-xl">
        Event Limit:{" "}
        <span className="font-semibold text-sky-500">
          {progress} / {MAX_TICKETS}
        </span>{" "}
        Tickets
      </h3>
      <Progress value={progressPercentage} className="w-full" />
    </div>
  );
};

export default QueueProgress;
