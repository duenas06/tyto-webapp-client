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

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState, useReducer } from "react";
import createExam from "../../../services/exams/create_exam"
const CreateExamModal = ({ isOpen, onClose, scheduleIDS, roomInfo, teacherEmail }) => {
  const [examName, setExamName] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const [roomID, setRoomID] = useState("")
  const [roomName, setroomName] = useState("")
  const toast = useToast();
  const [answerI, setAnswerI] = useState("")
  const [output, setOutput] = useState(null)
  const [page, setpage] = useState(1)
  const [formFields, setFormFields] = useState([
    {
      question: '',
      answer: '',
      itemA: '',
      itemB: '',
      itemC: '',
      itemD: '',
    },
  ])

  const initialItems = {
    index:0,
    question: '',
    answer: '',
    itemA: '',
    itemB: '',
    itemC: '',
    itemD: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "QUESTION":
       return {
         ...state, question: action.value.text, index: action.value.index
       }

      case "ANSWER":
        return {
         ...state, answer: action.value
        };

      case "ITEM_A":
        return {
         ...state, itemA: action.value
        };

      case "ITEM_B":
        return {
         ...state, itemB: action.value
        };

      case "ITEM_C":
        return {
         ...state, itemC: action.value
        };

      case "ITEM_D":
        return {
          ...state, itemD: action.value
        };
    }
  };

  const [item, dispatch] = useReducer(reducer, initialItems);

  const examChoices = [
    'itemA',
    'itemB',
    'itemC',
    'itemD',

  ]

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const handleChange = () => {
    if (page == formFields.length - 1) {
    console.log(formFields)
    }
  }


  useEffect(() => {
    let tempa = {...formFields[item.index], ...item}
    const tempo = formFields;
    tempo[item.index]=tempa
    setFormFields(tempo)
  }, [item])
  

  const submit = (e) => {
    e.preventDefault();
    handleChange()
    console.log(formFields)
  }

  const addFields = () => {
    let p = page + 1;
    let object = {
      question: '',
      answer: '',
      itemA: '',
      itemB: '',
      itemC: '',
      itemD: '',

    }

    const temps = formFields
    temps.push(object)
    setFormFields(temps)
    setpage(p)
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  const processCreateAccount = async () => {
    const createExams = await createExam({
      examName: examName,
      room_id: roomID,
      roomName: roomName,
      teacher_email: teacherEmail,
      schedule_id: scheduleID,
    });

    if (createExams.success) {
      toast({
        title: "Account Created",
        description: createExams.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Account Creation Failed",
        description: createAccountResult.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        onClose();
        setPassword("");
        setRoomID("");
        setroomName("");
        setScheduleID("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE EXAM</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Kindly fill out the form below to proceed.</Text>
          <VStack paddingY={"10"} spacing={"5"}>
            <Box width={"100%"}>
              <Text>Schedule ID</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {scheduleID === "" ? "Select Schedule ID" : scheduleID}
                </MenuButton>
                <MenuList>
                  {scheduleIDS.map((data, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => setScheduleID(data.id)}
                      >
                        {data.id}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>

            <Box width={"100%"}>
              <Text>Schedule ID</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {roomID === "" ? "Select Subject ID" : roomID}
                </MenuButton>
                <MenuList>
                  {roomInfo.map((data, index) => {
                    if (data.room_id) {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => { setRoomID(data.room_id), setroomName(data.name) }}
                        >
                          {data.room_id}
                        </MenuItem>
                      );
                    }
                  })}
                </MenuList>
              </Menu>
            </Box>
            <Box width={"100%"}>
              <Text>Exam Title</Text>
              <Input
                variant={"filled"}
                onChange={(event) => setExamName(event.target.value)}
              />
            </Box>
            {formFields.map((form, index) => {
              return (
                <Box width={"100%"} key={index}>
                  <Divider orientation="horizontal" />
                  <Box>
                    <Text>Question</Text>
                    <Input
                      variant={"filled"}
                      onChange={(event) => dispatch({type: 'QUESTION', value: {text: event.target.value, index}})}
                    />
                  </Box>
                  <HStack justifyContent="space-between">
                    <Box>
                      <Text>Option A</Text>
                      <Input
                        variant={"filled"}
                        onChange={event => handleFormChange(event, index)}
                        value={form.itemA}
                      />
                    </Box>

                    <Box>
                      <Text>Option B</Text>
                      <Input
                        variant={"filled"}
                        onChange={event => handleFormChange(event, index)}
                        value={form.itemB}
                      />
                    </Box>
                  </HStack>

                  <HStack justifyContent="space-between">
                    <Box>
                      <Text>Option C</Text>
                      <Input
                        variant={"filled"}
                        onChange={event => handleFormChange(event, index)}
                        value={form.itemC}
                      />
                    </Box>

                    <Box>
                      <Text>Option D</Text>
                      <Input
                        variant={"filled"}
                        onChange={event => handleFormChange(event, index)}
                        value={form.itemD}
                      />
                    </Box>
                  </HStack>
                  <Box>
                    <Text>Answer</Text>
                    <Menu>
                      <MenuButton
                        width={"100%"}
                        as={Button}
                        rightIcon={<ChevronDownIcon

                        />}
                      >
                        {answerI === "" ? "Select Answer" : answerI}
                      </MenuButton>
                      <MenuList  >
                        {examChoices.map((data, subindex) => {
                          return (
                            <MenuItem
                              key={subindex}
                              onClick={() => { form.answer = data, setAnswerI(data) }}
                            // value={form.answer=(data)}
                            >
                              {data}
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </Menu>
                  </Box>
                </Box>
              )
            })}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" mr={3} onClick={addFields}>
            Add Question
          </Button>
          <Button colorScheme="green" mr={3} onClick={removeFields}>
            Remove Question
          </Button>
          <Button colorScheme="green" mr={3} onClick={submit}>
            SUBMIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateExamModal;
