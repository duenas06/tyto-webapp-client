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
  Progress
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Jutsu } from 'react-jutsu';
import Head from "next/head";

export default function ClassRoom() {
  const router = useRouter();
  const [startMeeting, setStartMeeting] = useState(false)
  const [student, setStudent] = useState([])
  const [exam, setExam] = useState({})


  useEffect(() => {
    const roomData = localStorage.getItem('room')
    const datas = JSON.parse(roomData)

    if (datas) {
      const docRef = query(collection(db, "exams", datas.schedule_id, "exam_answer"), where("room_id", "==", datas.room_id), 
      where("schedule_id", "==", datas.schedule_id),
      where("exam_submitted", "==", true))
      const unsub = onSnapshot(docRef, (studentInfo) => {
        const students = []
        studentInfo.forEach(docs => {
          students = students.concat(docs.data())
          setStudent([...student, students])
        })
      })
    }
    setExam(datas)
  }, [])

  useEffect(() => {
    console.log(student)
    setStartMeeting(!startMeeting)
  }, [])




  return (
    <>
      <Head>
        <title>Class Room</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH={"100vh"} bg={"tyto_bg"}>
        <HStack spacing={0}>
            <Box width={(exam? "50%" : "80%")} bg={"cyan"}>
              {
                startMeeting && <Jutsu
                  // all values will come from the server
                  roomName={router.query.room_id} // will define where they will enter
                  // displayName={'FIXED_NAME_FROM_API'} // users display name
                  subject={router.query.section} // subject name
                  // password={'sampl3Passw0rd'} // encrypted password to avoid unexpected audience
                  // end
                  containerStyles={{
                    height: '100vh',
                    width: '100%'
                  }}
                  loadingComponent={<p>loading ...</p>}
                  errorComponent={<p>Oops, something went wrong</p>}
                  onMeetingEnd={() => {
                    router.push({ pathname: '/dashboard' })
                    setStudent([]);
                    setExam({})}}

                  configOverwrite={{
                    "add-people.disabled": false,
                    "invite.enabled": false,
                    'meeting-name.enabled': false,
                  }}
                  interfaceConfigOverwrite={{
                    "add-people.disabled": false,
                    "invite.enabled": false,
                    'meeting-name.enabled': false,
                  }}
                />
              }
            </Box>
            {student.length === 0 ?
            <></>
            :

            <Box minH={"100vh"} width={"60%"} maxH={"100vh"} paddingLeft={20} alignSelf="flex-end" bg={"tyto_bg"}>
              <VStack
                alignItems={"stretch"}
                spacing={"10"}
                mt={"5rem"}
              >
                <VStack alignItems={"stretch"}>
                  <Text
                    fontWeight={"bold"}
                    fontSize={"xl"}
                    color={"tyto_black"}
                    paddingX={"1vw"}
                    paddingY={"1vw"}
                  >
                    {"Students Exams"}
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
                          <Th >Items</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {student.map((val, index) => {
                          return (
                            val.map((dat) => {
                              return (
                                <Tr key={index}>
                                  <Td>{dat?.student_name}</Td>
                                  <Td><Progress hasStripe
                                    isAnimated
                                    size='lg'
                                    borderRadius={'md'}
                                    value={dat?.number_answered}
                                    max={exam.items.length} /></Td>
                                  <Td>{dat?.number_answered}/{exam.items.length}</Td>
                                </Tr>
                              )
                            })
                          )
                        })}
                      </Tbody>

                    </Table>
                  </TableContainer>
                </VStack>
              </VStack>
            </Box>

          }
        </HStack>
      </Box>
    </>
  );
}
