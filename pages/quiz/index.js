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
import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import { Circles } from "react-loader-spinner";
import UserDataContext from "../../src/context/UserDataContext";
import "react-calendar/dist/Calendar.css";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  getDocs,
} from "@firebase/firestore";
import getScheduleIDs from "../../constants/services/schedules/get_schedule_ids";
import Head from "next/head";
import CreateQuizModal from "../../constants/components/modals/quiz/create_quiz";
import giveQuiz from "../../constants/services/quiz/give_quiz";
import removeQuiz from "../../constants/services/quiz/remove_quiz";
const NavBarMenuSection = () => {
  const menuItems = [
    { name: "Dashboard", link: "/dashboard", icon: "/dashboard.png" },
    { name: "Exam", link: "/exam", icon: "/exam.png" },
    { name: "Quiz", link: "/quiz", icon: "/quiz.png" },
    { name: "Recitation", link: "/recitation", icon: "/recitation.png" },
    { name: "Sign Out", link: "/sign-in", icon: "/sign-out.png" },
  ];
  const currentMenuSelected = 2;
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
            onClick={() => {
              if (menuItem.name === "Sign Out") {
                Router.push({ pathname: menuItem.link });
                localStorage.clear();
              } else {
                Router.push({ pathname: menuItem.link });
              }
            }}
          >
            <Box
              height={"10"}
              width={"10"}
              padding="1vh"
              backgroundColor="tyto_teal"
              borderRadius={"full"}
            >
              {" "}
              <Image src={menuItem.icon} />
            </Box>
            <Text
              fontSize={"sm"}
              _hover={{
                transitionDuration: ".2s",
                transform: "scale(1.2)",
                overflow: "hidden",
                color: "cyan",
              }}
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
    const checkSession = localStorage.getItem("email");
    if (!checkSession) {
      router.push("/sign-in");
    }
    getloadData(checkSession);
    setLoading(false);
  }, []);

  async function getloadData(props) {
    setLoading(true);
    if (props) {
      //TEACHER INFORMATION
      const TEACHER_REF = doc(db, "accounts_teacher", props);

      const teacher = await getDoc(TEACHER_REF);
      setData({ ...teacher.data() });
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
          padding="1.5vh"
        >
          <Image src={"/user.png"} height={"7"} width={"7"} />
        </Box>
        <VStack alignItems={"stretch"}>
          <Text fontWeight={"bold"}>{data.fullname}</Text>
          <Text fontSize={"xs"}>Teacher</Text>
        </VStack>
      </HStack>

      <Box height={"2vh"} />
      <Divider />
      <Box height={"1vh"} />
      <NavBarMenuSection />
    </VStack>
  );
};

export default function SignIn() {
  const [value, onChange] = useState(new Date());
  const router = useRouter();
  const userDataContext = useContext(UserDataContext);
  const [data, setData] = useState({});
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [scheduleIDS, setScheduleIDs] = useState([]);
  const [section, setSection] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [schedule, setSchedule] = useState([]);
  const cancelRef = React.useRef();
  const toast = useToast();
  const {
    isOpen: isOpenAlertModal,
    onOpen: onOpenAlertModal,
    onClose: onCloseAlertModal,
  } = useDisclosure();
  useEffect(() => {
    setTimeout(() => {
      const checkSession = localStorage.getItem("email");
      if (!checkSession) {
        router.push("/sign-in");
      }
      getloadData(checkSession);
      setLoading(false);
    }, []);
  }, []);

  async function getloadData(props) {
    setLoading(true);
    schedules = [];
    if (props) {
      //TEACHER INFORMATION
      const TEACHER_REF = doc(db, "accounts_teacher", props);

      const teacher = await getDoc(TEACHER_REF);
      setData({ ...teacher.data() });

      //quizs
      var quizes = [];
      //GRADE SEVEN
      const GRADE_SEVEN_QUIZ = query(
        collection(db, "quiz", "GRADE-SEVEN", "quiz_data"),
        where("teacher_email", "==", props)
      );

      const GSEVEN_QUIZ_REF = await getDocs(GRADE_SEVEN_QUIZ);

      GSEVEN_QUIZ_REF.forEach((doc) => {
        quizes.push(doc.data());
      });

      //GRADE EIGHT
      const GRADE_EIGHT_QUIZ = query(
        collection(db, "quiz", "GRADE-EIGHT", "quiz_data"),
        where("teacher_email", "==", props)
      );

      const GEIGHT_QUIZ_REF = await getDocs(GRADE_EIGHT_QUIZ);

      GEIGHT_QUIZ_REF.forEach((doc) => {
        quizes = quizes.concat(doc.data());
      });

      //GRADE NINE
      const GRADE_NINE_QUIZ = query(
        collection(db, "quiz", "GRADE-NINE", "quiz_data"),
        where("teacher_email", "==", props)
      );

      const GNINE_QUIZ_REF = await getDocs(GRADE_NINE_QUIZ);

      GNINE_QUIZ_REF.forEach((doc) => {
        quizes = quizes.concat(doc.data());
      });

      //GRADE TEN
      const GRADE_TEN_QUIZ = query(
        collection(db, "quiz", "GRADE-TEN", "quiz_data"),
        where("teacher_email", "==", props)
      );

      const GTEN_QUIZ_REF = await getDocs(GRADE_TEN_QUIZ);

      GTEN_QUIZ_REF.forEach((doc) => {
        quizes = quizes.concat(doc.data());
      });
      setQuiz((quiz) => [...quiz, quizes]);

      //TEACHER SCHEDULE
      var schedules = [];
      //GRADE SEVEN
      const GRADE_SEVEN = doc(db, "schedules", "GRADE-SEVEN");

      const GSEVEN_REF = await getDoc(GRADE_SEVEN);

      schedules = schedules.concat(
        GSEVEN_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === props
        )
      );

      //GRADE EIGHT
      const GRADE_EIGHT = doc(db, "schedules", "GRADE-EIGHT");

      const GEIGHT_REF = await getDoc(GRADE_EIGHT);

      schedules = schedules.concat(
        GEIGHT_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === props
        )
      );

      //GRADE NINE
      const GRADE_NINE = doc(db, "schedules", "GRADE-NINE");

      const GNINE_REF = await getDoc(GRADE_NINE);

      schedules = schedules.concat(
        GNINE_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === props
        )
      );

      //GRADE TEN
      const GRADE_TEN = doc(db, "schedules", "GRADE-TEN");

      const GTEN_REF = await getDoc(GRADE_TEN);

      schedules = schedules.concat(
        GTEN_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === props
        )
      );
      setSchedule((schedule) => [...schedule, schedules]);
      setLoading(false);
    }
  }

  function getRoomInfo() {
    var sectionInfo = [];
    schedule[0]?.map((val) => {
      sectionInfo.push({ room_id: val?.room_id, name: val?.name });
    });
    return sectionInfo;
  }

  const processGiveQuiz = async (props) => {
    const giveQuizs = await giveQuiz({
      quiz_name:props.quiz_name,
      room_id: props.room_id,
      teacher_email: props.teacher_email,
      schedule_id: props.schedule_id,
      quiz_name: props.quiz_name,
    });

    if (giveQuizs.success) {
      toast({
        title: "Quiz Given Successfully",
        description: giveQuizs.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Quiz Given Failed",
        description: giveQuizs.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const processRemoveQuiz = async (props) => {
    const removeQuizs = await removeQuiz({
      room_id: props.room_id,
      teacher_email: props.teacher_email,
      schedule_id: props.schedule_id,
      quiz_name: props.quiz_name,
    });

    if (removeQuizs.success) {
      toast({
        title: "Quiz Removed Successfully",
        description: removeQuizs.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Quiz Operation Failed",
        description: removeQuizs.message,
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
        <title>Quiz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH={"100vh"} bg={"white"}>
        <HStack height={"100vh"} alignItems={"stretch"}>
          <DashboardNavigationBar />
          <CreateQuizModal
            isOpen={isOpen}
            onClose={onClose}
            roomInfo={section}
            scheduleIDS={scheduleIDS}
            teacherEmail={data.email}
          />
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
                <Heading color={"tyto_black"}>
                  {moment().format("dddd")}
                </Heading>
                <Text color={"tyto_black"} alignSelf="flex-end">
                  {moment().format("hh:mm A")}
                </Text>
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
              {"Available Quizzes"}
            </Text>
            <Box minH={"100%"} bg={"white"}>
              <Grid
                // h='200px'
                // bg={"blue"}
                templateRows="repeat(2, 1fr)"
                templateColumns="repeat(4, 1fr)"
                gap={1}
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
                    <Image
                      boxSize="124"
                      src="/createquiz.svg"
                      _hover={{
                        transitionDuration: ".2s",
                        transform: "scale(1.2)",
                        overflow: "hidden",
                        color: "cyan",
                      }}
                    />
                    <Text
                      margin="5"
                      alignSelf="center"
                      _hover={{
                        transitionDuration: ".2s",
                        transform: "scale(1.2)",
                        overflow: "hidden",
                        color: "cyan",
                      }}
                    >
                      ADD QUIZ
                    </Text>
                  </VStack>
                </Button>
                {quiz[0]?.map((val, index) => {
                  if (val) {
                    return (
                      <VStack
                        height={"20vh"}
                        maxW={"18vw"}
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
                        <Text
                          color="white"
                          fontWeight="bold"
                          fontSize={"xl"}
                          textAlign={"center"}
                        >
                          {val?.quiz_name}
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
                                pathname:
                                  "/classroom/[room_id]/[section]/[quiz]",
                                query: {
                                  room_id: val?.room_id,
                                  section: val?.name,
                                  quiz: val?.quiz_name,
                                },
                              });
                              localStorage.setItem(
                                "roomData",
                                JSON.stringify(val)
                              );
                              processGiveQuiz(val);
                              setRoomInfo(val);
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
                              onOpenAlertModal();
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
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Delete Customer
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                {
                                  "Are you sure? You can't undo this action afterwards."
                                }
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button
                                  ref={cancelRef}
                                  onClick={onCloseAlertModal}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  backgroundColor={"#F56565"}
                                  _hover={{ backgroundColor: "#FC8181" }}
                                  onClick={() => {
                                    processRemoveQuiz(val);
                                    onCloseAlertModal();
                                  }}
                                  ml={3}
                                >
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>
                      </VStack>
                    );
                  }
                })}
              </Grid>
            </Box>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
