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

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function createExam({
  exam_name,
  roomName,
  room_id,
  teacher_email,
  schedule_id,
  items,
  section,
}) {
  const docRef = collection(db, "exams", schedule_id, "exam_data");
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    await addDoc(docRef, {
      is_active: false,
      schedule_id: schedule_id,
      room_id: room_id + roomName,
      section: section,
      name: roomName,
      teacher_email: teacher_email,
      exam_name: exam_name,
      items: items,
      create: date.toString(),
      exam_id: makeid(10),
    });

    await setDoc(logsRef, {
      action: "CREATE_EXAM",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an exam with a room id of ${room_id}`,
    });
    Router.reload(window.location.pathname);
    return { success: true, message: "Exam Created Successfully." };
  } else {
    return { success: false, message: "Exam Creation Failed." };
  }
}
