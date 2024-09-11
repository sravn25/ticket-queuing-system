import React from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import {
  ArrowRight,
  LeafyGreen,
  Loader,
  LogIn,
  Ticket,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HoverCard } from "../ui/hover-card";
import { HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";

const StatisticBox = () => {
  const { counterData } = useRegistration();

  return (
    <>
      <div className="flex justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Ticket className="text-green-500" />
                <div>Tickets collected:</div>
                <HoverCard openDelay={1}>
                  <div className="font-semibold">
                    <HoverCardTrigger>
                      <u>{counterData?.registerCount}</u> / 1350
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="italic"
                      side="right"
                      sideOffset={5}
                    >
                      ({1350 - (counterData?.registerCount || 0)} left)
                    </HoverCardContent>
                  </div>
                </HoverCard>
              </div>

              <div className="flex gap-2">
                <Users className="text-celestialPrimary" />
                <div>Queue count:</div>
                <HoverCard openDelay={1}>
                  <div className="font-semibold">
                    <HoverCardTrigger>
                      {counterData?.queueCount} / 1350
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="italic"
                      side="right"
                      sideOffset={5}
                    >
                      ({1350 - (counterData?.queueCount || 0)} left)
                    </HoverCardContent>
                  </div>
                </HoverCard>
              </div>

              <div className="flex gap-2">
                <Loader className="text-yellow-500" />
                <div>Waiting List:</div>
                <HoverCard openDelay={1}>
                  <div className="font-semibold">
                    <HoverCardTrigger>
                      {counterData?.waitingCount} / 500
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="italic"
                      side="right"
                      sideOffset={5}
                    >
                      ({500 - (counterData?.waitingCount || 0)} left)
                    </HoverCardContent>
                  </div>
                </HoverCard>
              </div>

              <div className="flex gap-2">
                <Users className="text-orange-500" />
                <div className="flex items-center">
                  Waiting <ArrowRight className="h-4 w-4" /> Queuing:
                </div>

                <HoverCard openDelay={1}>
                  <div className="font-semibold">
                    <HoverCardTrigger>
                      <u>{counterData?.waitingToQueueCount}</u>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="italic"
                      side="right"
                      sideOffset={5}
                    >
                      <div className="flex flex-col">
                        (
                        {(counterData?.waitingToQueueCount || 0) +
                          (counterData?.registerCount || 0)}{" "}
                        total)
                      </div>
                    </HoverCardContent>
                  </div>
                </HoverCard>
              </div>

              <div className="flex gap-2">
                <LogIn className="text-celestialPrimary" />
                <div>Registration:</div>
                <HoverCard openDelay={1}>
                  <div className="font-semibold">
                    <HoverCardTrigger>
                      <u>{counterData?.registeredCount}</u>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="italic"
                      side="right"
                      sideOffset={5}
                    >
                      ({1350 - (counterData?.registeredCount || 0)} left)
                    </HoverCardContent>
                  </div>
                </HoverCard>
              </div>
              <div className="flex gap-2">
                <LeafyGreen className="text-green-500" />
                <div>Vegetarian:</div>
                <div className="underline underline-offset-2 font-semibold">
                  {counterData?.vegetarianCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StatisticBox;
