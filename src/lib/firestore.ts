import { db } from "./firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  increment,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export interface QueueData {
  fullName: string;
  studentId: string;
  studentEmail: string;
  personalEmail: string;
  phoneNumber: string;
  dateTime: string;
  rank: number;
  collected: boolean;
}

export const storeQueueData = async (queueData: QueueData): Promise<void> => {
  const {
    fullName,
    studentId,
    studentEmail,
    personalEmail,
    phoneNumber,
    dateTime,
    rank,
    collected,
  } = queueData;
  const docRef = doc(db, "queue", studentId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      throw new Error("Student ID already exist");
    }

    await setDoc(docRef, {
      fullName,
      studentId,
      studentEmail,
      personalEmail,
      phoneNumber,
      dateTime,
      rank,
      collected,
    });
    console.log("documented updated successfully");
    await updateQueueCounter(1);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchQueueData = async (): Promise<QueueData[]> => {
  const queueCollectionRef = collection(db, "queue");

  try {
    const querySnapshot = await getDocs(queueCollectionRef);
    const queueDataList: QueueData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as QueueData;
      queueDataList.push({
        fullName: data.fullName,
        studentId: data.studentId,
        studentEmail: data.studentEmail,
        personalEmail: data.personalEmail,
        phoneNumber: data.phoneNumber,
        dateTime: data.dateTime,
        rank: data.rank,
        collected: data.collected,
      });
    });
    return queueDataList;
  } catch (error) {
    console.error("Error fetching queue data:", error);
    throw error;
  }
};

export const initQueueCounter = async (): Promise<void> => {
  const counterRef = doc(db, "counter", "queueCounter");

  try {
    const docSnap = await getDoc(counterRef);
    if (!docSnap.exists()) {
      await setDoc(counterRef, { count: 0 });
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
  const counterRef = doc(db, "counter", "queueCounter");

  try {
    await updateDoc(counterRef, {
      count: increment(incrementValue),
    });
    console.log(`queueCounter updated by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating queueCounter:", error);
  }
};

export const getQueueCount = async (): Promise<number> => {
  const counterRef = doc(db, "counter", "queueCounter");

  try {
    const docSnap = await getDoc(counterRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.count || 0;
    } else {
      console.log("no queueCounter document found");
      return 0;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudentId = async (
  studentId: string,
): Promise<QueueData | null> => {
  const docRef = doc(db, "queue", studentId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as QueueData;
    } else {
      console.log("No document found with the student ID");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving document:", error);
    throw error;
  }
};

export const updateCollected = async (studentId: string): Promise<void> => {
  const docRef = doc(db, "queue", studentId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentCollected = docSnap.data().collected;
      const tmpCollected = !currentCollected;
      await updateDoc(docRef, { collected: tmpCollected });
      console.log(
        `Collected status for ${studentId} updated to ${tmpCollected}`,
      );
    } else {
      console.log("no document found");
    }
  } catch (error) {
    console.error("Error toggling collected status:", error);
    throw error;
  }
};
