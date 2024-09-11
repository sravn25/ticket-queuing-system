import { Progress } from "../ui/progress";
import { useRegistration } from "@/contexts/RegistrationContext";

const MAX_TICKETS = 1350;
const MAX_WAIT = 500;

const QueueProgress = () => {
  const { counterData } = useRegistration();

  const queueCount = counterData?.queueCount || 0;
  const waitingCount = counterData?.waitingCount || 0;

  const queuePercentage = (queueCount / MAX_TICKETS) * 100;
  const waitPercentage = (waitingCount / MAX_WAIT) * 100;
  //const progressPercentage = 80;

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <h3 className="text-xl">
        Event Limit:{" "}
        <span className="font-semibold text-sky-500">
          {queueCount} / {MAX_TICKETS}
        </span>{" "}
        Queuing
      </h3>
      <Progress value={queuePercentage} className="w-full" />
      <h3 className="text-xl">
        Waiting List:{" "}
        <span className="font-semibold text-sky-500">
          {waitingCount} / {MAX_WAIT}
        </span>{" "}
        Waiting
      </h3>
      <Progress value={waitPercentage} className="w-full" />
    </div>
  );
};

export default QueueProgress;
