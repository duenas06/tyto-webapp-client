import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  Firestore,
} from "firebase/firestore";
import Router from "next/router";
import { db } from "../../../firebase";
import SignIn from "../../../pages/exam";

export default async function createQuiz({
  quizName,
  roomName,
  room_id,
  teacher_email,
  schedule_id,
  items,
}) {
  const docRef = collection(db, "quiz", schedule_id, "quiz_data");
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    await addDoc(docRef, {
      is_active: false,
      schedule_id: schedule_id,
      room_id: room_id,
      name: roomName,
      teacher_email: teacher_email,
      quiz_name: quizName,
      items: items,
      create: date.toString(),
    });

    await setDoc(logsRef, {
      action: "CREATE_QUIZ",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an quiz with a room id of ${room_id}`,
    });

    Router.reload(window.location.pathname)
    return { success: true, message: "Quiz Created Successfully." };
  } else {
    return { success: false, message: "Quiz Creation Failed." };
  }
}
