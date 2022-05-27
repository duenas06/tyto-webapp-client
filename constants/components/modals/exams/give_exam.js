import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Input,
  Divider,
  VStack,
  HStack,
  Box,
  useToast,
} from "@chakra-ui/react";
import { db } from "../../../../firebase";
import { collection, query, where, getDoc, doc, getDocs } from "@firebase/firestore";
import giveExam from "../../services/exams/give_exam";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState, useReducer } from "react";
const GiveExamModal = ({ isOpen, onClose}) => {
    const [data, setData] = useState({});
    const [exam, setExam] = useState([])
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [schedule, setSchedule] = useState([])
 
  useEffect(() => {

    setTimeout(() => {
      const checkSession = localStorage.getItem("email");
      if (!checkSession) {
        router.push("/sign-in");
      }
      getloadData(checkSession);
      setLoading(false);
    }, [])
  }, []);

  async function getloadData(props) {
    setLoading(true);
    schedules = []
    if (props) {
      //TEACHER INFORMATION
      const TEACHER_REF = doc(db,
        "accounts_teacher", props);

      const teacher = await getDoc(TEACHER_REF);
      setData({ ...teacher.data() })

      //Exams
      var exams = []
      //GRADE SEVEN
      const GRADE_SEVEN_EXAM = query(collection(db,
        "exams", "GRADE-SEVEN", "exam_data"), where("teacher_email", "==", props))

      const GSEVEN_EXAM_REF = await getDocs(GRADE_SEVEN_EXAM);

      GSEVEN_EXAM_REF.forEach((doc) => {
        exams.push(doc.data())
      });


      //GRADE EIGHT
      const GRADE_EIGHT_EXAM = query(collection(db,
        "exams", "GRADE-EIGHT", "exam_data"), where("teacher_email", "==", props))

      const GEIGHT_EXAM_REF = await getDocs(GRADE_EIGHT_EXAM);

      GEIGHT_EXAM_REF.forEach((doc) => {
        exams = exams.concat(doc.data())
      });

      //GRADE NINE
      const GRADE_NINE_EXAM = query(collection(db,
        "exams", "GRADE-NINE", "exam_data"), where("teacher_email", "==", props))

      const GNINE_EXAM_REF = await getDocs(GRADE_NINE_EXAM);

      GNINE_EXAM_REF.forEach((doc) => {
        exams = exams.concat(doc.data())
      });

      //GRADE TEN
      const GRADE_TEN_EXAM = query(collection(db,
        "exams", "GRADE-TEN", "exam_data"), where("teacher_email", "==", props))

      const GTEN_EXAM_REF = await getDocs(GRADE_TEN_EXAM);

      GTEN_EXAM_REF.forEach((doc) => {
        exams = exams.concat(doc.data())
      });
      setExam(exam => [...exam, exams])


      //TEACHER SCHEDULE
      var schedules = []
      //GRADE SEVEN
      const GRADE_SEVEN = doc(db,
        "schedules", "GRADE-SEVEN")

      const GSEVEN_REF = await getDoc(GRADE_SEVEN);

      schedules = schedules.concat(GSEVEN_REF.data().subjects.filter(({ teacher_email }) => teacher_email === props))

      //GRADE EIGHT
      const GRADE_EIGHT = doc(db,
        "schedules", "GRADE-EIGHT")

      const GEIGHT_REF = await getDoc(GRADE_EIGHT);

      schedules = schedules.concat(GEIGHT_REF.data().subjects.filter(({ teacher_email }) => teacher_email === props))

      //GRADE NINE
      const GRADE_NINE = doc(db,
        "schedules", "GRADE-NINE")

      const GNINE_REF = await getDoc(GRADE_NINE);

      schedules = schedules.concat(GNINE_REF.data().subjects.filter(({ teacher_email }) => teacher_email === props))

      //GRADE TEN
      const GRADE_TEN = doc(db,
        "schedules", "GRADE-TEN")

      const GTEN_REF = await getDoc(GRADE_TEN);

      schedules = schedules.concat(GTEN_REF.data().subjects.filter(({ teacher_email }) => teacher_email === props))
      setSchedule(schedule => [...schedule, schedules])
      setLoading(false);

    }
  }
  const processGiveExam = async (props) => {
    const giveExams = await giveExam({
      room_id: props.room_id,
      teacher_email: props.teacher_email,
      schedule_id: props.schedule_id,
    });

    if (giveExams.success) {
      toast({
        title: "Exam Given Successfully",
        description: giveExams.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Exam Given Failed",
        description: giveExams.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true)
  }
  
  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        onClose();
        setRoomID("");
        setroomName("");
        setScheduleID("");
        setRoomID("");
        setFormFields([1])
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE EXAM</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
         
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button isDisabled={loading} colorScheme="green" mr={3} onClick={submit}>
            SUBMIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GiveExamModal;