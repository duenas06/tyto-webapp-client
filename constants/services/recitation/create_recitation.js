import { doc, getDoc, setDoc, addDoc, collection, Firestore } from "firebase/firestore";
import { db } from "../../../firebase";
import SignIn from "../../../pages/exam";

export default async function createRecitation({
  recitationName,
  roomName,
  room_id,
  teacher_email,
  student_email,
  schedule_id,
  items
}) {
  const docRef = collection(db, "recitation", schedule_id, "recitation_data");
  const docRefa = doc(db, "users", schedule_id);
  const docData = await getDoc(docRefa);
  const isEmailExisting = docData.exists();
  var date = new Date();

  const logsRef = doc(db, "logs", date.toString());

  if (!isEmailExisting) {
    await addDoc(docRef, {
      is_active:false,
      schedule_id: schedule_id,
      room_id:room_id,
      name: roomName,
      teacher_email:teacher_email,
      student_email:student_email,
      quiz_name: recitationName,
      items: items,
      create:date.toString()
    });

    await setDoc(logsRef, {
      action: "CREATE_Recitation",
      creator_email: teacher_email,
      timestamp: date.toString(),
      description: `${teacher_email} created an recitation with a room id of ${room_id}`,
    });
    return { success: true, message: "Recitation created successfully." };
  } else {
    return { success: false, message: "Recitation creation failed." };
  }
}
