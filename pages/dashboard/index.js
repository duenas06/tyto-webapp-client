import {
  Box,
  HStack,
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
import { useState } from "react";
import Calendar from "react-calendar";
import { Circles } from "react-loader-spinner";
import "react-calendar/dist/Calendar.css";
const NavBarMenuSection = () => {
  const menuItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Pop Up Quizzes", link: "/" },
    { name: "Recitation Questions", link: "/" },
    { name: "Class Schedules", link: "/" },
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
const DashboardNavigationBar = (
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
        <Text fontWeight={"bold"}>Romeo A.</Text>
        <Text fontSize={"xs"}>Front End Developer</Text>
      </VStack>
    </HStack>

    <Box height={"2vh"} />
    <Divider />
    <Box height={"1vh"} />
    <NavBarMenuSection />
  </VStack>
);
export default function SignIn() {
  const [value, onChange] = useState(new Date());
  const router = useRouter();
  return (
    <Box minH={"100vh"} bg={"white"}>
      <HStack height={"100vh"} alignItems={"stretch"}>
        {DashboardNavigationBar}

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
              <Heading color={"tyto_black"}>Hi Romeo,</Heading>
              <Text color={"tyto_faded_black"}>
                Wishing you a productive day!
              </Text>
            </VStack>
            <Spacer />
            <Heading color={"tyto_black"}>{moment().format("dddd")}</Heading>
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
          <HStack
            alignItems={"stretch"}
            paddingX={"1vw"}
            paddingY={"1vw"}
            borderRadius={"lg"}
          >
            <VStack
              height={"20vh"}
              flex={1}
              backgroundColor={"tyto_teal"}
              paddingX={"1vw"}
              paddingY={"2vh"}
              borderRadius={"lg"}
              justifyContent={"center"}
              cursor={"auto"}
              _hover={{ shadow: "lg" }}
            >
              <Text color="white" fontWeight="bold" fontSize={"2xl"}>
                Saturn
              </Text>
              <Text color="white">08:00 AM - 09:00 AM</Text>
            </VStack>
            <VStack
              height={"20vh"}
              flex={1}
              backgroundColor={"tyto_teal"}
              paddingX={"1vw"}
              paddingY={"2vh"}
              borderRadius={"lg"}
              justifyContent={"center"}
              cursor={"auto"}
              _hover={{ shadow: "lg" }}
            >
              <Text color="white" fontWeight="bold" fontSize={"2xl"}>
                Saturn
              </Text>
              <Text color="white">08:00 AM - 09:00 AM</Text>
            </VStack>
            <VStack
              height={"20vh"}
              flex={1}
              backgroundColor={"tyto_teal"}
              paddingX={"1vw"}
              paddingY={"2vh"}
              borderRadius={"lg"}
              justifyContent={"center"}
              cursor={"auto"}
              _hover={{ shadow: "lg" }}
            >
              <Text color="white" fontWeight="bold" fontSize={"2xl"}>
                Saturn
              </Text>
              <Text color="white">08:00 AM - 09:00 AM</Text>
            </VStack>
          </HStack>
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
                Sapphire
              </Text>
              <Spacer />
              <Button
                variant={"solid"}
                backgroundColor={"#06D7A0"}
                _hover={{ backgroundColor: "#06D7A0" }}
                _active={{ backgroundColor: "#06D7A0" }}
                onClick={()=>
                  router.push({ 
                    pathname: "/classroom/[year_level]/[section]",
                    query:{
                      year_level:"2",
                      section:"Sapphire"
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
  );
}
