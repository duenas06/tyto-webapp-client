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
} from "firebase/firestore";
import { db } from "../../../firebase";

export default async function giveQuiz({
  room_id,
  teacher_email,
  schedule_id,
  quiz_id,
}) {
  const docRef = query(
    collection(db, "quiz", schedule_id, "quiz_data"),
    where("teacher_email", "==", teacher_email),
    where("room_id", "==", room_id),
    where("quiz_id", "==", quiz_id)
  );
  const docRefa = doc(db, "quiz", schedule_id, "quiz_data", teacher_email);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef);
    data.forEach((docs) => {
      const upDate = doc(db, "quiz", schedule_id, "quiz_data", docs.id);
      updateDoc(upDate, { is_active: true });
    });

    await setDoc(logsRef, {
      action: "CREATE_QUIZ",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an quiz with a room id of ${room_id}`,
    });

    return { success: true, message: "Quiz Given Successfully" };
  } else {
    return { success: false, message: "Failed To Give Quiz." };
  }
}
