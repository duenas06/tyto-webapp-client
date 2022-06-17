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

export default async function giveExam({
  room_id,
  teacher_email,
  schedule_id,
  exam_name,
}) {
  const docRef = query(
    collection(db, "exams", schedule_id, "exam_data"),
    where("teacher_email", "==", teacher_email),
    where("room_id", "==", room_id),
    where("exam_name", "==", exam_name)
  );
  const docRefa = doc(db, "exams", schedule_id, "exam_data", teacher_email);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef);
    data.forEach((docs) => {
      const upDate = doc(db, "exams", schedule_id, "exam_data", docs.id);
      updateDoc(upDate, { is_active: true });
    });

    await setDoc(logsRef, {
      action: "CREATE_EXAM",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an exam with a room id of ${room_id}`,
    });

    return { success: true, message: "Exam Created Successfully." };
  } else {
    return { success: false, message: "Exam Creation Failed." };
  }
}
