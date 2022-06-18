import {
  Box,
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Spacer,
  Text,
  VStack,
  Progress,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Jutsu } from "react-jutsu";
import Head from "next/head";
import unGiveQuiz from "../../../../../constants/services/quiz/ungive_quiz ";
export default function QuizRoom() {
  const router = useRouter();
  const [startMeeting, setStartMeeting] = useState(false);
  const [student, setStudent] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [studenta, setStudenta] = useState([]);
  const [quizData, setQuizData] = useState("");

  useEffect(() => {
    const roomData = localStorage.getItem("roomData");
    const datas = JSON.parse(roomData);
    setQuizData(datas.quiz_name);

    if (datas?.quiz_name) {
      const docRef = query(
        collection(db, "quiz", datas.schedule_id, "quiz_answer"),
        where("room_id", "==", datas.room_id + datas.name),
        where("schedule_id", "==", datas.schedule_id)
      );
      const unsub = onSnapshot(docRef, (studentInfo) => {
        const students = [];
        studentInfo.forEach((docs) => {
          students = students.concat(docs.data());
          setStudent([...student, students]);
          console.log(datas.schedule_id);
        });
      });
      setQuiz(datas);
    }
  }, []);

  async function processunGiveQuiz() {
    const unGivequiz = await unGiveQuiz({
      room_id: quiz.room_id,
      teacher_email: quiz.teacher_email,
      schedule_id: quiz.schedule_id,
      quiz_id: quiz.quiz_id,
    });

    if (unGivequiz.success) {
      toast({
        title: "Quiz Remove Successfully",
        description: unGivequiz.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Quiz Remove Failed",
        description: giveQuizs.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  }

  useEffect(() => {
    setStartMeeting(!startMeeting);
  }, [2000]);

  return (
    <>
      <Head>
        <title>Quiz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH={"100vh"} bg={"tyto_bg"}>
        <HStack spacing={0}>
          <Box>
            {startMeeting && (
              <Jutsu
                // all values will come from the server
                roomName={router.query.room_id} // will define where they will enter
                // displayName={'FIXED_NAME_FROM_API'} // users display name
                subject={router.query.section} // subject name
                // password={'sampl3Passw0rd'} // encrypted password to avoid unexpected audience
                // end
                quiz={router.query.quiz}
                containerStyles={{
                  height: "100vh",
                  width: "70vh",
                }}
                loadingComponent={<p>loading ...</p>}
                errorComponent={<p>Oops, something went wrong</p>}
                onMeetingEnd={() => {
                  processunGiveQuiz();
                  router.push({ pathname: "/dashboard" });
                }}
                configOverwrite={{
                  "add-people.disabled": false,
                  "invite.enabled": false,
                  "meeting-name.enabled": false,
                }}
                interfaceConfigOverwrite={{
                  "add-people.disabled": false,
                  "invite.enabled": false,
                  "meeting-name.enabled": false,
                }}
              />
            )}
          </Box>
          <Box
            minH={"100vh"}
            width={"60%"}
            maxH={"100vh  "}
            paddingLeft={20}
            alignSelf="flex-end"
            bg={"tyto_bg"}
          >
            <VStack alignItems={"stretch"} spacing={"10"} mt={"5rem"}>
              <VStack alignItems={"stretch"}>
                <Text
                  fontWeight={"bold"}
                  fontSize={"xl"}
                  color={"tyto_black"}
                  paddingX={"1vw"}
                  paddingY={"1vw"}
                >
                  {"Students Quiz"}
                </Text>
              </VStack>

              <VStack
                alignSelf={"center"}
                borderRadius={"xl"}
                shadow={"lg"}
                width={"90%"}
                backgroundColor={"white"}
                alignItems={"stretch"}
                padding={"20px"}
              >
                <TableContainer>
                  <Table variant="striped" colorScheme="facebook">
                    <TableCaption>Good Luck Everyone!</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>Status</Th>
                        <Th>Items</Th>
                        <Th>Submitted</Th>
                        <Th>Score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {student.map((val, index) => {
                        return val.map((dat) => {
                          return (
                            <Tr key={index}>
                              <Td>{dat?.student_name}</Td>
                              <Td>
                                <Progress
                                  hasStripe
                                  isAnimated
                                  colorScheme={"cyan"}
                                  size="lg"
                                  borderRadius={"md"}
                                  value={dat?.number_answered}
                                  max={quiz.items.length}
                                />
                              </Td>
                              <Td>
                                {dat?.number_answered}/{quiz.items.length}
                              </Td>

                              <Td>{dat?.quiz_submitted ? "YES" : "NO"}</Td>

                              <Td>
                                {dat?.quiz_results.length === 0
                                  ? "0"
                                  : dat?.quiz_results.filter(
                                      (data) => data.is_correct === true
                                    ).length}
                              </Td>
                            </Tr>
                          );
                        });
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </>
  );
}
