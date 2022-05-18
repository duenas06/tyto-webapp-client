import { collection, doc, getDoc, getDocs, where } from 'firebase/firestore'
import { db } from '../../../firebase'

export default async function getEmails(schedule_id) {
  const collectionRef = collection(db, 'accounts_student')
  const docData = await getDocs(collectionRef, where("schedule_id", "==", schedule_id))
  var studentEmails = []
  docData.forEach(doc => { studentEmails.push({ studentEmail: doc.id }) })
  return studentEmails;
  studentEmails = []
}
