import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Router from "next/router";
import { db } from "../../../firebase";

export default async function removeRecitation({
  room_id,
  teacher_email,
  student_email,
  schedule_id,
  recitation_id,
}) {
  const docRef = query(
    collection(db, "recitation", schedule_id, "recitation_data"),
    where("teacher_email", "==", teacher_email),
    where("room_id", "==", room_id),
    where("student_email", "==", student_email),
    where("recitation_id", "==", recitation_id)
  );
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef);
    data.forEach((docs) => {
      const deleteDo = doc(
        db,
        "recitation",
        schedule_id,
        "recitation_data",
        docs.id
      );
      deleteDoc(deleteDo);
    });

    await setDoc(logsRef, {
      action: "CREATE_RECITATION",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} removed an Recitation with a room id of ${room_id}`,
    });
    Router.reload(window.location.pathname);
    return { success: true, message: "Recitation Removed Successfully." };
  } else {
    return { success: false, message: "Recitation Operation Failed." };
  }
}
