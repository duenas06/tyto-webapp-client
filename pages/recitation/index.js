import {
  Box,
  HStack,
  VStack,
  Text,
  Heading,
  Button,
  useDisclosure,
  ScaleFade,
  Divider,
  Spacer,
  Image,
  useToast,
  Grid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import moment from "moment";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useContext, } from "react";
import Calendar from "react-calendar";
import { Circles } from "react-loader-spinner";
import UserDataContext from "../../src/context/UserDataContext";
import "react-calendar/dist/Calendar.css";
import { db } from "../../firebase";
import { collection, query, where, getDoc, doc, getDocs } from "@firebase/firestore";
import getScheduleIDs from "../../constants/services/schedules/get_schedule_ids";
import Head from "next/head";
import CreateExamModal from "../../constants/components/modals/exams/create_exam"
import giveExam from "../../constants/services/exams/give_exam";
import removeExam from "../../constants/services/exams/remove_exam";
import CreateQuizModal from "../../constants/components/modals/quiz/create_quiz";
import giveQuiz from "../../constants/services/quiz/give_quiz";
import removeQuiz from "../../constants/services/quiz/remove_quiz";
import CreateRecitationModal from "../../constants/components/modals/recitation/create_recitation";
import removeRecitation from "../../constants/services/recitation/remove_recitation";
import giveRecitation from "../../constants/services/recitation/give_recitation";
const NavBarMenuSection = () => {
  const menuItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Exam", link: "/exam" },
    { name: "Quiz", link: "/quiz" },
    { name: "Recitation", link: "/recitation" },
    { name: "Sign Out", link: "/sign-in" },
  ];
  const currentMenuSelected = 3;
  return (
    <Box>
      <Text fontWeight={"bold"} fontSize={"md"}>
        Menu
      </Text>
      <Box height={"2vh"} />
      <VStack alignItems={"stretch"} spacing={"2vh"}>
        {menuItems.map((menuItem, index) => (
          <HStack
            spacing={"1.5vw"}
            key={index}
            cursor={"pointer"}
            onClick={() => Router.push({ pathname: menuItem.link })}
          >
            <Box
              height={"10"}
              width={"10"}
              backgroundColor="tyto_teal"
              borderRadius={"full"}
            />
            <Text
              fontSize={"sm"}
              _hover={{ transitionDuration: ".2s", transform: "scale(1.2)", overflow: "hidden", color: "cyan" }}
              color={currentMenuSelected == index && "tyto_teal"}
            >
              {menuItem.name}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
const DashboardNavigationBar = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      const checkSession = localStorage.getItem("email");
      if (!checkSession) {
        router.push("/sign-in");
      }
      getloadData(checkSession);
      setLoading(false);
    }, [2000])
  }, []);

  async function getloadData(props) {
    setLoading(true);
    if (props) {
      //TEACHER INFORMATION
      const TEACHER_REF = doc(db,
        "accounts_teacher", props);

      const teacher = await getDoc(TEACHER_REF);
      setData({ ...teacher.data() })
    }
  }
  return (
    <VStack
      minWidth={"300px"}
      paddingY={"1vh"}
      paddingX={"1vw"}
      alignItems={"stretch"}
      backgroundColor={"white"}
    >
      <Box height={"2vh"} />

      <HStack spacing={"1vw"}>
        <Box
          height={"14"}
          width={"14"}
          backgroundColor="tyto_teal"
          borderRadius={"full"}
        />
        <VStack alignItems={"stretch"}>
          <Text fontWeight={"bold"}>{data.fullname ? data.fullname : 'Loading...'}</Text>
          <Text fontSize={"xs"}>Teacher</Text>
        </VStack>
      </HStack>

      <Box height={"2vh"} />
      <Divider />
      <Box height={"1vh"} />
      <NavBarMenuSection />
    </VStack>
  );
}

export default function SignIn() {
  const [value, onChange] = useState(new Date());
  const router = useRouter();
  const userDataContext = useContext(UserDataContext);
  const [data, setData] = useState({});
  const [recitation, setRecitation] = useState([])
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState({})
  const [scheduleIDS, setScheduleIDs] = useState([]);
  const [section, setSection] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [schedule, setSchedule] = useState([])
  const cancelRef = React.useRef()
  const toast = useToast();
  const {
    isOpen: isOpenAlertModal,
    onOpen: onOpenAlertModal,
    onClose: onCloseAlertModal
  } = useDisclosure()
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

      //quizs
      var recitations = []
      //GRADE SEVEN
      const GRADE_SEVEN_RECITE = query(collection(db,
        "recitation", "GRADE-SEVEN", "recitation_data"), where("teacher_email", "==", props))

      const GSEVEN_RECITE_REF = await getDocs(GRADE_SEVEN_RECITE);

      GSEVEN_RECITE_REF.forEach((doc) => {
        recitations.push(doc.data())
      });


      //GRADE EIGHT
      const GRADE_EIGHT_RECITE = query(collection(db,
        "recitation", "GRADE-EIGHT", "recitation_data"), where("teacher_email", "==", props))

      const GEIGHT_RECITE_REF = await getDocs(GRADE_EIGHT_RECITE);

      GEIGHT_RECITE_REF.forEach((doc) => {
        recitations = recitations.concat(doc.data())
      });

      //GRADE NINE
      const GRADE_NINE_RECITE = query(collection(db,
        "recitation", "GRADE-NINE", "recitation_data"), where("teacher_email", "==", props))

      const GNINE_RECITE_REF = await getDocs(GRADE_NINE_RECITE);

      GNINE_RECITE_REF.forEach((doc) => {
        recitations = recitations.concat(doc.data())
      });

      //GRADE TEN
      const GRADE_TEN_RECITE = query(collection(db,
        "recitation", "GRADE-TEN", "recitation_data"), where("teacher_email", "==", props))

      const GTEN_RECITE_REF = await getDocs(GRADE_TEN_RECITE);

      GTEN_RECITE_REF.forEach((doc) => {
        recitations = recitations.concat(doc.data())
      });
      setRecitation(recitation => [...recitation, recitations])


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

  function getRoomInfo() {
    var sectionInfo = []
    schedule[0].map(val => {
      sectionInfo.push({ room_id: val?.room_id, name: val?.name })
    })
    return sectionInfo;
  }

  const processGiveRecitation = async (props) => {
    const giveRecits = await giveRecitation({
      room_id: props.room_id,
      teacher_email: props.teacher_email,
      student_email: props.student_email,
      schedule_id: props.schedule_id,
    });

    if (giveRecits.success) {
      toast({
        title: "Recitation Given Successfully",
        description: giveRecits.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Recitation Given Failed",
        description: giveRecits.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const processRemoveRecitation = async (props) => {
    const removeRecits = await removeRecitation({
      room_id: props.room_id,
      teacher_email: props.teacher_email,
      student_email: props.student_email,
      schedule_id: props.schedule_id,
    });

    if (removeRecits.success) {
      toast({
        title: "Recitation Removed Successfully",
        description: removeRecits.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Recitation Operation Failed",
        description: removeRecits.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <>
      <Head>
        <title>Recitation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {
        !data.fullname?
        <Text>Loading...</Text>
        :
        <Box minH={"100vh"} bg={"white"}>
        <HStack height={"100vh"} alignItems={"stretch"}>
          <DashboardNavigationBar />
          <CreateRecitationModal
            isOpen={isOpen}
            onClose={onClose}
            roomInfo={section}
            scheduleIDS={scheduleIDS}
            teacherEmail={data.email} />
          <Divider orientation="vertical" />

          <VStack
            width={"100%"}
            alignItems={"stretch"}
            paddingX={"1vw"}
            paddingY={"1vh"}
          >
            <HStack
              backgroundColor={"white"}
              paddingX={"2vw"}
              paddingY={"2vh"}
              borderRadius={"lg"}
            >
              <VStack alignItems={"stretch"}>
                <Heading color={"tyto_black"}>Hi {data.fullname}</Heading>
                <Text color={"tyto_faded_black"}>
                  Wishing you a productive day!
                </Text>
              </VStack>
              <Spacer />
              <VStack alignItems={"stretch"}>
                <Heading color={"tyto_black"}>{moment().format("dddd")}</Heading>
                <Text color={"tyto_black"} alignSelf="flex-end">{moment().format("hh:mm A")}</Text>
              </VStack>
            </HStack>

            <Divider width={"90%"} alignSelf={"center"} />

            <Text
              fontWeight={"bold"}
              fontSize={"xl"}
              color={"tyto_black"}
              paddingX={"1vw"}
              paddingY={"1vw"}
            >
              {"Available Items"}
            </Text>
            <Box minH={"100%"} bg={"white"} >
              <Grid
                // h='200px'
                // bg={"blue"}
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(4, 1fr)'
                gap={4}
                borderRadius={"lg"}
              >
                <Button
                  maxW={"20vw"}
                  height={"fit-content"}
                  width={"fit-content"}
                  _hover={{ shadow: "lg" }}
                  onClick={async () => {
                    if (data.fullname) {
                        setScheduleIDs(await getScheduleIDs()),
                        setSection(getRoomInfo()),
                        onOpen();
                    } else {
                      toast({
                        title: "Create Exam",
                        description: "Kindly wait for the data thank you",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  <VStack
                    height={"20vh"}
                    width={"25.5vh"}
                    flex={1}
                    backgroundColor={"tyto_teal"}
                    paddingX={"1vw"}
                    paddingY={"2vh"}
                    borderRadius={"xl"}
                    justifyContent={"center"}
                    cursor={"hand"}

                  >
                    <Image boxSize="124" src="/createquiz.svg" _hover={{ transitionDuration: ".2s", transform: "scale(1.2)", overflow: "hidden", color: "cyan" }} />
                    <Text margin="5" alignSelf="center" _hover={{ transitionDuration: ".2s", transform: "scale(1.2)", overflow: "hidden", color: "cyan" }}>ADD QUIZ</Text>
                  </VStack>
                </Button>
                {recitation[0]?.map((val, index) => {

                  if (val) {
                    return (
                      <VStack
                        height={"20vh"}
                        maxW={"20vw"}
                        flex={1}
                        backgroundColor={"tyto_teal"}
                        paddingX={"1vw"}
                        paddingY={"2vh"}
                        borderRadius={"lg"}
                        justifyContent={"center"}
                        cursor={"auto"}
                        _hover={{ shadow: "lg" }}
                        key={index}
                      >
                        <Text color="white" fontWeight="bold" fontSize={"xl"} textAlign={"center"}>
                          {val?.recitation_name}
                        </Text>
                        <Text color="white">{val?.name}</Text>
                        <Spacer />
                        <HStack width={"100%"}>
                          <Button
                            variant={"solid"}
                            width={"100%"}
                            alignSelf="flex-end"
                            backgroundColor={"#06D7A0"}
                            _hover={{ backgroundColor: "#06D7A0" }}
                            _active={{ backgroundColor: "#06D7A0" }}
                            onClick={() => {
                              router.push({
                                pathname: "/classroom/[room_id]/[section]/[quiz]/[recitation]",
                                query: {
                                  room_id: val?.room_id,
                                  section: val?.name,
                                  quiz: val?.recitation_name,
                                  recitation: val?.recitation_name
                                },
                              })
                              localStorage.setItem('roomData', JSON.stringify(val))
                              processGiveRecitation(val);
                              setRoomInfo(val)
                            }}
                          >
                            Give
                          </Button>

                          <Button
                            variant={"solid"}
                            width={"100%"}
                            alignSelf="flex-end"
                            backgroundColor={"#F56565"}
                            _hover={{ backgroundColor: "#FC8181" }}
                            _active={{ backgroundColor: "#F56565" }}
                            onClick={() => {
                              onOpenAlertModal()
                            }}
                          >
                            Remove
                          </Button>
                        </HStack>

                        <AlertDialog
                          isOpen={isOpenAlertModal}
                          leastDestructiveRef={cancelRef}
                          onClose={onCloseAlertModal}
                        >
                          <AlertDialogOverlay>
                            <AlertDialogContent>
                              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Customer
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                {"Are you sure? You can't undo this action afterwards."}
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onCloseAlertModal}>
                                  Cancel
                                </Button>
                                <Button
                                  backgroundColor={"#F56565"}
                                  _hover={{ backgroundColor: "#FC8181" }}
                                  onClick={() => {
                                    processRemoveRecitation(val)
                                    onCloseAlertModal()
                                  }} ml={3}>
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>

                      </VStack>

                    )
                  }
                })}
              </Grid>
            </Box>
          </VStack>
        </HStack>
        </Box>
      }
    </>
  );
}
