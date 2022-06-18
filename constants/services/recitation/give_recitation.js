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
import { db } from "../../../firebase";

export default async function giveRecitation({
  room_id,
  teacher_email,
  student_email,
  recitation_id,
  schedule_id,
}) {
  const docRef = query(
    collection(db, "recitation", schedule_id, "recitation_data"),
    where("teacher_email", "==", teacher_email),
    where("room_id", "==", room_id),
    where("student_email", "==", student_email),
    where("recitation_id", "==", recitation_id)
  );
  const docRefa = doc(
    db,
    "recitation",
    schedule_id,
    "recitation_data",
    teacher_email
  );
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef);
    data.forEach((docs) => {
      const upDate = doc(
        db,
        "recitation",
        schedule_id,
        "recitation_data",
        docs.id
      );
      updateDoc(upDate, { is_active: true });
    });

    await setDoc(logsRef, {
      action: "CREATE_QUIZ",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an recitatiom question with a room id of ${room_id}`,
    });

    return { success: true, message: "Recitation Given Successfully" };
  } else {
    return { success: false, message: "Failed To Give Recitation." };
  }
}
