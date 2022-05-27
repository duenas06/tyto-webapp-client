import { Box, HStack, VStack, Text, Heading, Button } from "@chakra-ui/react";
import Router from "next/router";
import { useState } from "react";
import Head from "next/head";

import { Jutsu } from "react-jutsu";

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
        onClick={() => Router.push({ pathname: "/" })}
      >
        TYTO
      </Heading>
      <Text flex={"2"} fontSize={"xl"} cursor={"pointer"}>
        TYTO Student App
      </Text>
      <Button
        flex={"1"}
        variant="solid"
        onClick={() => Router.push({ pathname: "/sign-in" })}
      >
        SIGN IN
      </Button>
    </HStack>
  );
};

export default function Home() {
  const [start, setStart] = useState(false);
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH={"100vh"} bg={"tyto_bg"}>
        <VStack alignItems={"flex-start"}>
          <IndexNavBar />
        </VStack>
      </Box>
    </>
  );
}
