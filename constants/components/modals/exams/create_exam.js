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
import createExam from "../../../services/exams/create_exam";
const CreateExamModal = ({
  isOpen,
  onClose,
  scheduleIDS,
  roomInfo,
  teacherEmail,
}) => {
  const toast = useToast();
  const [examName, setExamName] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomName, setroomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState("");
  const [section, setSection] = useState("");
  const [action, setAction] = useState(["Select Answer"]);
  const [page, setpage] = useState(1);
  const [formFields, setFormFields] = useState([
    {
      index: 0,
      question: "",
      answer: "",
      itemA: "",
      itemB: "",
      itemC: "",
      itemD: "",
    },
  ]);

  const initialItems = {
    index: 0,
    question: "",
    answer: "",
    itemA: "",
    itemB: "",
    itemC: "",
    itemD: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "QUESTION":
        return {
          ...state,
          question: action.value.text,
          index: action.value.index,
        };

      case "ANSWER":
        return {
          ...state,
          answer: action.value.text,
          index: action.value.index,
        };

      case "ITEM_A":
        return {
          ...state,
          itemA: action.value.text,
          index: action.value.index,
        };

      case "ITEM_B":
        return {
          ...state,
          itemB: action.value.text,
          index: action.value.index,
        };

      case "ITEM_C":
        return {
          ...state,
          itemC: action.value.text,
          index: action.value.index,
        };

      case "ITEM_D":
        return {
          ...state,
          itemD: action.value.text,
          index: action.value.index,
        };
    }
  };

  const [item, dispatch] = useReducer(reducer, initialItems);

  const examChoices = ["Select Answer", "itemA", "itemB", "itemC", "itemD"];

  const buttonTextHandler = (idx, value) => {
    const tempo = action;
    tempo[idx] = value;
    setAction(tempo);
  };

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const handleChange = () => {
    if (page == formFields.length - 1) {
      console.log(formFields);
    }
  };

  useEffect(() => {
    let tempa = { ...formFields[item.index], ...item };
    const tempo = formFields;
    tempo[item.index] = tempa;
    setFormFields(tempo);
  }, [item]);

  const submit = (e) => {
    e.preventDefault();
    handleChange();
    console.log(formFields);
    processCreateExam();
  };

  const addFields = () => {
    let p = page + 1;
    let object = {
      question: "",
      answer: "",
      itemA: "",
      itemB: "",
      itemC: "",
      itemD: "",
    };

    const temps = formFields;
    temps.push(object);
    setFormFields(temps);
    setpage(p);
    const tempa = action;
    tempa.push("Select Answer");
    setAction(tempa);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const processCreateExam = async () => {
    setLoading(true);
    const createExams = await createExam({
      exam_name: examName,
      room_id: roomID,
      roomName: roomName,
      teacher_email: teacherEmail,
      schedule_id: scheduleID,
      section: section,
      items: formFields,
    });

    if (createExams.success) {
      toast({
        title: "Exam Created",
        description: createExams.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Exam Creation Failed",
        description: createExams.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
    setLoading(false);
  };

  const MenuButtonAnswer = (props) => {
    const idx = Math.round(Math.random() * 999);
    return (
      <Box>
        <Text>Answer</Text>
        <Menu>
          <MenuButton
            key={idx}
            width={"100%"}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            {action[props.itemIndex]}
          </MenuButton>
          <MenuList>
            {examChoices.map((data, subindex) => {
              return subindex === 0 ? (
                <></>
              ) : (
                <MenuItem
                  key={subindex}
                  onClick={() => {
                    dispatch({
                      type: "ANSWER",
                      value: { text: data, index: props.itemIndex },
                    });
                    buttonTextHandler(props.itemIndex, data);
                  }}
                >
                  {data}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Box>
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        onClose();
        setRoomID("");
        setroomName("");
        setSection("");
        setScheduleID("");
        setFormFields([1]);
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
              <Text>Room ID</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {room === "" ? "Select Room ID" : room}
                </MenuButton>
                <MenuList>
                  {roomInfo.map((data, index) => {
                    if (data.room_id) {
                      const rooms = data.room_id.split("_");
                      let room = rooms[0];
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            setRoomID(data.room_id),
                              setRoom(room),
                              setroomName(data.name);
                            setSection(data.section);
                          }}
                        >
                          {room}
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
                      onChange={(event) =>
                        dispatch({
                          type: "QUESTION",
                          value: { text: event.target.value, index },
                        })
                      }
                    />
                  </Box>
                  <HStack justifyContent="space-between">
                    <Box>
                      <Text>Option A</Text>
                      <Input
                        variant={"filled"}
                        onChange={(event) =>
                          dispatch({
                            type: "ITEM_A",
                            value: { text: event.target.value, index },
                          })
                        }
                      />
                    </Box>

                    <Box>
                      <Text>Option B</Text>
                      <Input
                        variant={"filled"}
                        onChange={(event) =>
                          dispatch({
                            type: "ITEM_B",
                            value: { text: event.target.value, index },
                          })
                        }
                      />
                    </Box>
                  </HStack>

                  <HStack justifyContent="space-between">
                    <Box>
                      <Text>Option C</Text>
                      <Input
                        variant={"filled"}
                        onChange={(event) =>
                          dispatch({
                            type: "ITEM_C",
                            value: { text: event.target.value, index },
                          })
                        }
                      />
                    </Box>

                    <Box>
                      <Text>Option D</Text>
                      <Input
                        variant={"filled"}
                        onChange={(event) =>
                          dispatch({
                            type: "ITEM_D",
                            value: { text: event.target.value, index },
                          })
                        }
                      />
                    </Box>
                  </HStack>
                  <MenuButtonAnswer itemIndex={index} />
                </Box>
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              onClose();
              setRoomID("");
              setroomName("");
              setSection("");
              setScheduleID("");
              setFormFields([1]);
            }}
          >
            Close
          </Button>
          <Button colorScheme="green" mr={3} onClick={addFields}>
            Add Question
          </Button>
          <Button colorScheme="green" mr={3} onClick={removeFields}>
            Remove Question
          </Button>
          <Button
            isDisabled={loading}
            colorScheme="green"
            mr={3}
            onClick={submit}
          >
            SUBMIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateExamModal;
