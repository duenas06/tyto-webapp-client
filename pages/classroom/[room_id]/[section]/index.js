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
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";

import { Jutsu } from 'react-jutsu';

export default function ClassRoom() {
  const router = useRouter();
  const [startMeeting,setStartMeeting] = useState(false)
  useEffect(()=>{
    setTimeout(()=>{
      setStartMeeting(!startMeeting)
    },[2000])
  },[])
  return (
    <Box minH={"100vh"} bg={"tyto_bg"}>
      {
        startMeeting && <Jutsu
        // all values will come from the server
        roomName={'MobileApplicationDevelopment'} // will define where they will enter
        // displayName={'FIXED_NAME_FROM_API'} // users display name
        subject={'Mobile Application Development'} // subject name
        // password={'sampl3Passw0rd'} // encrypted password to avoid unexpected audience
        // end
        containerStyles={{
          height:'100vh',
          width:'100vw'
        }}
        loadingComponent={<p>loading ...</p>}
        errorComponent={<p>Oops, something went wrong</p>}
         onMeetingEnd={()=>router.push({pathname:'/dashboard'})}
         
        configOverwrite={{
          "add-people.disabled": false,
          "invite.enabled":false,
          'meeting-name.enabled': false,
        }}
        interfaceConfigOverwrite={{
          "add-people.disabled": false,
          "invite.enabled":false,
          'meeting-name.enabled': false,
        }}
      />
      }
    </Box>
  );
}
