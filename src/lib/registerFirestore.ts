import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface RegisterData {
  ticketNumber: string;
  studentId: string;
  createdAt: string;
  registered: boolean;
}

export const registerTicket = async (
  ticketData: RegisterData,
): Promise<void> => {
  const { ticketNumber, studentId, createdAt, registered } = ticketData;
  const docRef = doc(db, "registration", ticketNumber);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      throw new Error("Ticket number already exist");
    }

    await setDoc(docRef, { ticketNumber, studentId, createdAt, registered });
    console.log("Document successfully written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error registering ticket:", error);
    throw error;
  }
};
