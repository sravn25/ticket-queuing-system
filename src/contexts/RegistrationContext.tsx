import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchQueueData, QueueData } from "@/lib/queueFirestore";
import {
  getQueueCount,
  CounterDataType,
  VenueData,
  getTimeslotCount,
} from "@/lib/counterFirestore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { fetchWaitData } from "@/lib/waitFirestore";
import { fetchRegisterData, RegisterData } from "@/lib/registerFirestore";

interface RegistrationContextType {
  queueData: QueueData[] | null;
  refreshQueueData: () => Promise<void>;
  waitingData: QueueData[] | null;
  refreshWaitData: () => Promise<void>;
  counterData: CounterDataType | null;
  refreshCounterData: () => Promise<void>;
  timeslotData: { [key in "TGH" | "LT1"]: VenueData } | null;
  refreshTimeslotData: () => Promise<void>;
  queueLimit: boolean;
  waitLimit: boolean;
  registrationData: RegisterData[] | null;
  refreshRegistrationData: () => Promise<void>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
);

export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider",
    );
  }
  return context;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queueData, setQueueData] = useState<QueueData[] | null>(null);
  const [waitingData, setWaitingData] = useState<QueueData[] | null>(null);
  const [counterData, setCounterData] = useState<CounterDataType | null>(null);
  const [timeslotData, setTimeslotData] = useState<
    { [key in "TGH" | "LT1"]: VenueData } | null
  >(null);
  const [queueLimit, setQueueLimit] = useState<boolean>(true);
  const [waitLimit, setWaitLimit] = useState<boolean>(true);
  const [registrationData, setRegistrationData] = useState<
    RegisterData[] | null
  >(null);

  const refreshQueueData = useCallback(async () => {
    try {
      const allQueueData = await fetchQueueData();
      setQueueData(allQueueData);
    } catch (error) {
      console.error("Error fetching queue data:", error);
    }
  }, []);

  const refreshWaitData = useCallback(async () => {
    try {
      const allWaitingData = await fetchWaitData();
      setWaitingData(allWaitingData);
    } catch (error) {
      console.error("Error fetching queue data:", error);
    }
  }, []);

  const refreshCounterData = useCallback(async () => {
    try {
      const queueCount = await getQueueCount();
      setCounterData(queueCount);
      const queuing = queueCount?.queueCount || 0;
      const waiting = queueCount?.waitingCount || 0;
      setQueueLimit(queuing > 1350); // true if full
      setWaitLimit(waiting > 500); // true if full
    } catch (error) {
      console.error("Error fetching counter data:", error);
    }
  }, []);

  const refreshTimeslotData = useCallback(async () => {
    try {
      const tghTimeslot = await getTimeslotCount("TGH");
      const lt1Timeslot = await getTimeslotCount("LT1");

      setTimeslotData({
        TGH: tghTimeslot || {
          "530": { count: 0, studentId: [] },
          "630": { count: 0, studentId: [] },
          "730": { count: 0, studentId: [] },
        },
        LT1: lt1Timeslot || {
          "5": { count: 0, studentId: [] },
          "6": { count: 0, studentId: [] },
        },
      });
    } catch (error) {
      console.error("Error fetching timeslot data", error);
    }
  }, []);

  const refreshRegistrationData = useCallback(async () => {
    try {
      const allRegisterData = await fetchRegisterData();
      setRegistrationData(allRegisterData);
    } catch (error) {
      console.error("Error fetching register data:", error);
    }
  }, []);

  useEffect(() => {
    // counter listener
    const docRef = doc(db, "counter", "count");
    const unsub = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCounterData(docSnapshot.data() as CounterDataType);
          const queuing = docSnapshot.data().queueCount;
          const waiting = docSnapshot.data().waitingCount;
          setQueueLimit(queuing > 1350); // true if full
          setWaitLimit(waiting > 500); // true if full
        } else {
          console.log("counter update doc not found");
        }
      },
      (error) => {
        console.error("Error getting counter refresh snapshot:", error);
      },
    );

    // TGH timeslot listener
    const tghRef = doc(db, "counter", "TGH");
    const unsubTGH = onSnapshot(
      tghRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const tghData = docSnapshot.data() as VenueData;
          setTimeslotData((prevData) => ({
            ...(prevData || {
              LT1: {
                "5": { count: 0, studentId: [] },
                "6": { count: 0, studentId: [] },
              },
            }), // Spread the previous data for LT1 if exists
            TGH: tghData, // Only update TGH data
          }));
        } else {
          console.log("TGH document not found.");
        }
      },
      (error) => {
        console.error("Error listening to TGH timeslot updates:", error);
      },
    );

    // LT1 timeslot listener
    const lt1Ref = doc(db, "counter", "LT1");
    const unsubLT1 = onSnapshot(
      lt1Ref,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const lt1Data = docSnapshot.data() as VenueData;
          setTimeslotData((prevData) => ({
            ...(prevData || {
              TGH: {
                "530": { count: 0, studentId: [] },
                "630": { count: 0, studentId: [] },
                "730": { count: 0, studentId: [] },
              },
            }),
            LT1: lt1Data, // Update only LT1 data
          }));
        } else {
          console.log("LT1 document not found.");
        }
      },
      (error) => {
        console.error("Error listening to LT1 timeslot updates:", error);
      },
    );

    return () => {
      unsub(); // Clean up listener
      unsubTGH();
      unsubLT1();
    };
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        queueData,
        refreshQueueData,
        waitingData,
        refreshWaitData,
        counterData,
        refreshCounterData,
        timeslotData,
        refreshTimeslotData,
        queueLimit,
        waitLimit,
        registrationData,
        refreshRegistrationData,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
