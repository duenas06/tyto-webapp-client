import { doc, getDoc, setDoc, addDoc, collection, updateDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import Router from "next/router";
import { db } from "../../../firebase";

export default async function removeQuiz({
  room_id,
  teacher_email,
  schedule_id,
}) {
  const docRef = query(collection(db, "quiz", schedule_id, "quiz_data"), where("teacher_email", "==", teacher_email), where("room_id", "==", room_id));
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    const data = await getDocs(docRef)
    data.forEach(docs => {
        const deleteDo = doc(db, "quiz", schedule_id, "quiz_data", docs.id)
        deleteDoc(deleteDo)
    });

    await setDoc(logsRef, {
      action: "CREATE_QUIZ",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} removed an quiz with a room id of ${room_id}`,
    });

    Router.reload(window.location.pathname)
    return { success: true, message: "Quiz Removed Successfully." };
  } else {
    return { success: false, message: "Quiz Operation Failed." };
  }
}
