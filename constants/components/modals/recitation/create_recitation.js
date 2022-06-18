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
import createQuiz from "../../../services/quiz/create_quiz";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import createRecitation from "../../../services/recitation/create_recitation";
const CreateRecitationModal = ({
  isOpen,
  onClose,
  scheduleIDS,
  roomInfo,
  teacherEmail,
}) => {
  const toast = useToast();
  const [quizName, setQuizName] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomName, setroomName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentEmails, setStudentEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("");
  const [room, setRoom] = useState("");
  let sched = "";
  let studentEmailss = [];
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

  const quizChoices = ["Select Answer", "itemA", "itemB", "itemC", "itemD"];

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
    processCreateRecitation();
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

  const processCreateRecitation = async () => {
    setLoading(true);
    const createRecit = await createRecitation({
      recitation_name: quizName,
      room_id: roomID,
      roomName: roomName,
      teacher_email: teacherEmail,
      student_email: studentEmail,
      schedule_id: scheduleID,
      section: section,
      items: formFields,
    });

    if (createRecit.success) {
      toast({
        title: "Recitation Created",
        description: createRecit.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Recitation Creation Failed",
        description: createRecit.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
    setLoading(false);
  };

  let getEmails = async () => {
    let collectionRef = query(
      collection(db, "accounts_student"),
      where("schedule_id", "==", sched)
    );
    let docData = await getDocs(collectionRef);
    docData.forEach((doc) => {
      studentEmailss.push({ email: doc.id });
    });
    setStudentEmails(studentEmailss);
    console.log(sched);
    console.log(studentEmailss);
    return studentEmailss;
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
            {quizChoices.map((data, subindex) => {
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
        setScheduleID("");
        setSection("");
        setRoomID("");
        setFormFields([1]);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE RECITATION</ModalHeader>
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
                        onClick={() => {
                          (sched = data.id),
                            getEmails(),
                            setScheduleID(data.id);
                        }}
                      >
                        {data.id}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>

            <Box width={"100%"}>
              <Text>Student Email</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {studentEmail === "" ? "Select Student Email" : studentEmail}
                </MenuButton>
                <MenuList>
                  {studentEmails.map((data, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          setStudentEmail(data.email);
                        }}
                      >
                        {data.email}
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
              <Text>Recitation Title</Text>
              <Input
                variant={"filled"}
                onChange={(event) => setQuizName(event.target.value)}
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
              setRoomID("");
              setroomName("");
              setScheduleID("");
              setSection("");
              setRoomID("");
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

export default CreateRecitationModal;
