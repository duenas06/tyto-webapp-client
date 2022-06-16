import { doc, getDoc, setDoc, addDoc, collection, updateDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import Router from "next/router";
import { db } from "../../../firebase";

export default async function removeExam({
  room_id,
  teacher_email,
  schedule_id,
}) {
  const docRef = query(collection(db, "exams", schedule_id, "exam_data"), where("teacher_email", "==", teacher_email), where("room_id", "==", room_id));
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef)
    data.forEach(docs => {
        const upDate = doc(db, "exams", schedule_id, "exam_data", docs.id)
        deleteDoc(upDate)
    });

    await setDoc(logsRef, {
      action: "CREATE_EXAM",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} removed an exam with a room id of ${room_id}`,
    });

    Router.reload(window.location.pathname)
    return { success: true, message: "Exam Removed Successfully." };
  } else {
    return { success: false, message: "Exam Operation Failed." };
  }
}
