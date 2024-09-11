import { db } from "./firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  increment,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export interface CounterDataType {
  queueCount: number;
  registerCount: number;
  registeredCount: number;
  vegetarianCount: number;
  waitingCount: number;
  waitingToQueueCount: number;
  //LT1?: { [timeslot: string]: TimeSlotData };
  //TGH?: { [timeslot: string]: TimeSlotData };
}

export interface TimeSlotData {
  count: number;
  studentId: string[];
}

export interface VenueData {
  [time: string]: TimeSlotData;
}

export const getQueueCount = async (): Promise<CounterDataType | null> => {
  const counterRef = doc(db, "counter", "count");

  try {
    const docSnap = await getDoc(counterRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as CounterDataType;
      return data;
    } else {
      console.log("no queueCounter document found");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// not needed anymore
export const initQueueCounter = async (): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    const docSnap = await getDoc(counterRef);
    if (!docSnap.exists()) {
      await setDoc(
        counterRef,
        {
          queueCount: 0,
          registerCount: 0,
          vegetarianCount: 0,
          waitingCount: 0,
          waitingToQueueCount: 0,
        },
        { merge: true },
      );
      console.log("queue counter initialized with count: 0");
    } else {
      console.log("queueCounter already exist");
    }
  } catch (error) {
    console.error("Error initializing queue counter");
  }
};

export const updateQueueCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      queueCount: increment(incrementValue),
    });
    console.log(`queueCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating queueCounter:", error);
  }
};

export const updateRegisterCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      registerCount: increment(incrementValue),
    });
    console.log(`registerCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating registerCounter:", error);
  }
};

export const updateVegetarianCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      vegetarianCount: increment(incrementValue),
    });
    console.log(`vegetarianCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating vegetarianCounter:", error);
  }
};

export const updateWaitingCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      waitingCount: increment(incrementValue),
    });
    console.log(`waitingCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating waitingCounter:", error);
  }
};

export const updateWaitingToQueueCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      waitingToQueueCount: increment(incrementValue),
    });
    console.log(`waitingToQueueCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating waitingToQueueCounter:", error);
  }
};

export const updateRegisteredCounter = async (
  incrementValue: number,
): Promise<void> => {
  const counterRef = doc(db, "counter", "count");

  try {
    await updateDoc(counterRef, {
      registeredCount: increment(incrementValue),
    });
    console.log(`waitingToQueueCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating waitingToQueueCounter:", error);
  }
};

export const initTimeSlotCount = async (): Promise<void> => {
  const initialStructure = {
    TGH: {
      "530": {
        count: 0,
        studentId: [],
      },
      "630": {
        count: 0,
        studentId: [],
      },
      "730": {
        count: 0,
        studentId: [],
      },
    },
    LT1: {
      "5": {
        count: 0,
        studentId: [],
      },
      "6": {
        count: 0,
        studentId: [],
      },
    },
  };
  try {
    const tghRef = doc(db, "counter", "TGH");
    await setDoc(tghRef, initialStructure.TGH);
    const lt1Ref = doc(db, "counter", "LT1");
    await setDoc(lt1Ref, initialStructure.LT1);
    console.log("Firestore timeslot initialized");
  } catch (error) {
    console.error("Error initialising timeslot", error);
  }
};

export const getTimeslotCount = async (
  venue: "TGH" | "LT1",
): Promise<VenueData | null> => {
  const venueRef = doc(db, "counter", venue);
  try {
    const venueSnap = await getDoc(venueRef);

    if (venueSnap.exists()) {
      const venueData = venueSnap.data() as VenueData;
      const timeslotStructure: VenueData =
        venue === "TGH"
          ? {
              ...(venueData || {}),
              "530": venueData["530"] || { count: 0, studentId: [] },
              "630": venueData["630"] || { count: 0, studentId: [] },
              "730": venueData["730"] || { count: 0, studentId: [] },
            }
          : {
              ...(venueData || {}),
              "5": venueData["5"] || { count: 0, studentId: [] },
              "6": venueData["6"] || { count: 0, studentId: [] },
            };
      return timeslotStructure;
    } else {
      console.log("no such venue doc");
      return null;
    }
  } catch (error) {
    console.error("Error getting timeslot data", error);
    return null;
  }
};

export const updateTimeslot = async (
  venue: "TGH" | "LT1",
  incrementValue: number,
  studentId: string,
  time: string,
): Promise<void> => {
  const venueRef = doc(db, "counter", venue);

  try {
    const timeslotField = `${time}`;
    await updateDoc(venueRef, {
      [`${timeslotField}.count`]: increment(incrementValue),
      [`${timeslotField}.studentId`]: arrayUnion(studentId),
    });
    console.log(
      `Timeslot ${time} updated by ${incrementValue}, studentId added: ${studentId}`,
    );
  } catch (error) {
    console.error("Error updating timeslot:", error);
  }
};

export const timeslotLimit = async (
  venue: "TGH" | "LT1",
  time: string,
): Promise<boolean> => {
  const timeslotRef = doc(db, "counter", venue);
  const limit = venue === "TGH" ? 450 : 250;
  try {
    const timeslotSnap = await getDoc(timeslotRef);

    if (timeslotSnap.exists()) {
      const venueData = timeslotSnap.data();
      const timeslotData = venueData[time];

      if (timeslotData && timeslotData.count !== undefined) {
        const currentCount = timeslotData.count;
        return currentCount < limit;
      } else {
        console.log("No data for given timeslot");
        return false;
      }
    } else {
      console.log("no such venue doc");
      return false;
    }
  } catch (error) {
    console.error("Error checking timeslot limit:", error);
    return false;
  }
};
