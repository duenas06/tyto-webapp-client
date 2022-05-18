import {
  Box,
  HStack,
  Stack,
  VStack,
  Text,
  Heading,
  Button,
  Input,
  Switch,
  Center,
  useDisclosure,
  ScaleFade,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import { Circles } from "react-loader-spinner";
import UserDataContext from "../../src/context/UserDataContext";
import "react-calendar/dist/Calendar.css";
import { db } from "../../firebase";
import { collection, query, where, getDoc, doc, getDocs } from "@firebase/firestore";
import Head from "next/head";

const NavBarMenuSection = () => {
  const menuItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Exam", link: "/exam" },
    { name: "Quiz", link: "/quiz" },
    { name: "Recitation", link: "/recitation" },
    { name: "Sign Out", link: "/sign-in" },
  ];
  const currentMenuSelected = 0;
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
}

export default function SignIn() {
  const [value, onChange] = useState(new Date());
  const router = useRouter();
  const userDataContext = useContext(UserDataContext);
  const [data, setData] = useState({});
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState({})
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

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH={"100vh"} bg={"white"}>
        <HStack height={"100vh"} alignItems={"stretch"}>
          <DashboardNavigationBar />

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
                <Heading color={"tyto_black"}>Hi {data.fullname}!</Heading>
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
              {"Today's Schedule"}
            </Text>
            <Box minH={"100%"} bg={"white"} >
              <Stack direction={["column", "column", "row"]}
                alignItems={"stretch"}
                paddingX={"1vw"}
                paddingY={"1vw"}
                borderRadius={"lg"}
              >
                {schedule[0]?.map((val, index) => {
                  if (val) {
                    return (
                      <VStack
                        height={"18vh"}
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
                        <Text color="white" fontWeight="bold" fontSize={"2xl"} textAlign={"center"}>
                          {val?.name}
                        </Text>
                        <Text color="white">{val?.time}</Text>
                        <Spacer />
                        <Button
                          variant={"solid"}
                          width={"100%"}
                          alignSelf="flex-end"
                          backgroundColor={"#06D7A0"}
                          _hover={{ backgroundColor: "#06D7A0" }}
                          _active={{ backgroundColor: "#06D7A0" }}
                          onClick={() => {
                            router.push({
                              pathname: "/classroom/[room_id]/[section]",
                              query: {
                                room_id: val?.room_id,
                                section: val?.name
                              }
                            })
                            setRoomInfo(val)
                          }}
                        >
                          Join
                        </Button>
                      </VStack>
                    )
                  }
                })}
              </Stack>
            </Box>
          </VStack>
          <Divider orientation="vertical" />
          <VStack
            minWidth={"350px"}
            paddingY={"1vh"}
            paddingRight={"1vw"}
            alignItems={"stretch"}
            backgroundColor={"white"}
          >
            <VStack
              alignItems={"stretch"}
              paddingX={"1vw"}
              paddingY={"1vw"}
              borderRadius={"lg"}
              spacing={"5"}
            >
              <Text fontWeight={"bold"} fontSize={"xl"} color={"tyto_black"}>
                {"Ongoing Class"}
              </Text>
              <HStack
                backgroundColor={"tyto_teal"}
                paddingX={"1vw"}
                paddingY={"2vh"}
                borderRadius={"lg"}
              >
                <Text color="white" fontWeight="bold">
                  {roomInfo.name} Section
                </Text>
                <Spacer />
                <Button
                  variant={"solid"}
                  backgroundColor={"#06D7A0"}
                  _hover={{ backgroundColor: "#06D7A0" }}
                  _active={{ backgroundColor: "#06D7A0" }}
                  onClick={() =>
                    router.push({
                      pathname: "/classroom/[room_id]/[section]",
                      query: {
                        room_id: roomInfo?.room_id || "2",
                        section: roomInfo?.name || "Sapphire"
                      }
                    })}
                >
                  Join
                </Button>
              </HStack>
            </VStack>
            <VStack
              alignItems={"stretch"}
              paddingX={"1vw"}
              paddingY={"1vw"}
              borderRadius={"lg"}
              spacing={"5"}
            >
              <Text fontWeight={"bold"} fontSize={"xl"} color={"tyto_black"}>
                {"My Calendar"}
              </Text>
              <Calendar
                onChange={onChange}
                value={value}
                onClickDay={(val) => alert(val)}
                calendarType="US"
              />
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}
