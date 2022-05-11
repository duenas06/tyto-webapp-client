import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default async function createExam({
  examName,
  roomName,
  room_id,
  teacher_email,
  schedule_id,
}) {
  const docRef = doc(db, "exams", schedule_id, "exam_data", teacher_email);
  const docData = await getDoc(docRef);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    await setDoc(docRef, {
      schedule_id: scheduleID,
      room_id:room_id,
      roomName: roomName,
      teacher_email:teacher_email,
      examName: examName,
     
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
