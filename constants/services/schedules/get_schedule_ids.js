import { collection,doc,getDoc, getDocs } from 'firebase/firestore'
import { db } from "../../../firebase";

export default async function getScheduleIDs (){
  const collectionRef = collection(db,'schedules')
  const docData = await getDocs(collectionRef)
  var scheduleIDS = []
  docData.forEach(doc=>{scheduleIDS.push({id:doc.id})})
  return scheduleIDS;
}
