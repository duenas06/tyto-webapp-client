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
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { Circles } from "react-loader-spinner";

const IndexNavBar = (props) => {
  return (
    <HStack
      bg={"white"}
      alignItems={"center"}
      width={"100%"}
      paddingX={"2vw"}
      paddingY={"2vh"}
      {...props}
    >
      <Heading
        flex={"7"}
        cursor={"pointer"}
        onClick={() => {
          props.onToggle();
          setTimeout(() => Router.push({ pathname: "/" }), 800);
        }}
      >
        TYTO
      </Heading>
      <Text flex={"1"} fontSize={"xl"} cursor={"pointer"}>
        FAQ
      </Text>
      <Text flex={"2"} fontSize={"xl"} cursor={"pointer"}>
        TYTO Student App
      </Text>
      <Button flex={"1"} variant="solid">
        SIGN IN
      </Button>
    </HStack>
  );
};

const Form = ()=>{
  const [hidePassword,setHidePassword] = useState(true)
  return (
    <VStack alignItems={"stretch"}>
      <Input placeholder={"Account ID"} variant="filled" />
      <Input placeholder={"Password"} variant="filled" type={hidePassword?"password":"text"} />
      <HStack justifyContent={"flex-end"}>
        <Text fontSize="xs">Show Password</Text>
        <Switch paddingTop={"1"} colorScheme={"teal"} size={"md"} onChange={()=>setHidePassword(!hidePassword)}/>
      </HStack>
    </VStack>
  )
};
const AdminSupport = (
  <HStack wrap={"wrap"} justifyContent={"center"} paddingY={"5"}>
    <Text>{"Can't sign in?"}</Text>
    <Text
      color={"tyto_teal"}
      cursor={"pointer"}
      onClick={() => Router.push({ pathname: "/sign-in" })}
    >
      {"Contact Administrator"}
    </Text>
  </HStack>
);
const SignInForm = (props) => {
  const router = useRouter();
  return (
    <ScaleFade initialScale={0.9} in={props.isOpen}>
      <Center>
        <VStack
          alignItems={"stretch"}
          paddingLeft={"3vh"}
          paddingTop={"3vh"}
          paddingRight={"3vh"}
          backgroundColor={"white"}
          borderRadius={"xl"}
          shadow={"dark-lg"}
          minWidth={"20vw"}
          marginX={"10vw"}
          marginTop={"15vh"}
        >
          <Heading>SIGN IN</Heading>
          <Text>to your TYTO Account</Text>
          <Box height={"2"} />
          <Box bg="tyto_teal" padding="1px" width="30%" borderRadius="full" />
          <Box height={"2"} />
          <Form/>
          <Box height={"5"} />
          <Button
            variant="solid"
            onClick={() => {
              props.setIsVerifying(!props.isVerifying);
              setTimeout(() => {
                router.push({ 
                  pathname: "/dashboard",
                });
              }, 2000);
            }}
          >
            SIGN IN
          </Button>
          <Box height={"10"} />

          {AdminSupport}
        </VStack>
      </Center>
    </ScaleFade>
  );
};
const VerifyingSignInLoader = () => {
  return (
    <Center>
      <VStack
        alignItems={"center"}
        padding={"2vh"}
        backgroundColor={"white"}
        borderRadius={"xl"}
        shadow={"lg"}
        minWidth={"10vw"}
        marginX={"10vw"}
        marginTop={"35vh"}
      >
        <Circles
          ariaLabel="loading-indicator"
          height={"50px"}
          width={"50px"}
          color="#00ADB5"
        />
        <Text>Verifying Account</Text>
      </VStack>
    </Center>
  );
};

export default function SignIn() {
  const { isOpen, onToggle } = useDisclosure();
  const [isVerifying, setIsVerifying] = useState(false);
  return (
    <Box minH={"100vh"} bg={"tyto_bg"}>
      <IndexNavBar onToggle={onToggle} />
      {isVerifying ? (
        <VerifyingSignInLoader />
      ) : (
        <SignInForm
          isOpen={!isOpen}
          onToggle={onToggle}
          isVerifying={isVerifying}
          setIsVerifying={setIsVerifying}
        />
      )}
    </Box>
  );
}
