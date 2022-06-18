import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Heading,
    Text,
    Divider,
    VStack,
  } from '@chakra-ui/react'
import Router from 'next/router';

export default function ActivityPreviewModal({ 
    isOpen, 
    onOpen, 
    onClose,
    val,
    type, 
    giveActivity, 
    route, 
    localStorageRoomData,
    pushRouteQuery,
}) {
    console.log(val)
    function pushRoute(){
        giveActivity(val)
        Router.push({
            pathname: route,
            query: pushRouteQuery,
          });
          localStorage.setItem(
            localStorageRoomData,
            JSON.stringify(val)
        );
    }

    const activityName = [
        {
            type:'Exam',
            title:val?.exam_name
        },
        {
            type:'Quiz',
            title:val?.quiz_name
        },
        {
            type:'Recitation',
            title:val?.recitation_name
        },
    ]

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{`${type} Preview`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Heading fontSize={'md'}>
                    Name 
                </Heading>
                {activityName.map(data => {
                    return data.type === type && <Text>{data.title}</Text>
                })}
                <Divider my={'5'}/>
                <Heading fontSize={'md'}>
                   {`${type} Items`}
                </Heading>
                <Text>{`Below is the preview of the ${type.toLowerCase()} item${type !== 'Recitation' ? 's':''}`}</Text>
                <VStack alignItems={'stretch'}>
                {
                    val.items && val?.items.map((data,index)=>{
                        return(
                            <>
                                <Heading mt={'5'} alignSelf={'end'} fontSize={'lg'}>
                                    {`ITEM #${index+1}`}
                                </Heading>                            
                                <Heading mt={'5'} fontSize={'sm'}>
                                    {`Question`}
                                </Heading>
                                <Text>{`${data.question}`}</Text>
                                <Heading  mt={'5'} fontSize={'sm'}>
                                    {`Correct Answer`}
                                </Heading>
                                <Text>{`${data.answer}`}</Text>
                                <Heading  mt={'5'} fontSize={'sm'}>
                                    {`Answer Choices`}
                                </Heading>
                                <Text>{`A. ${data.itemA}`}</Text>
                                <Text>{`B. ${data.itemB}`}</Text>
                                <Text>{`C. ${data.itemC}`}</Text>
                                <Text>{`D. ${data.itemD}`}</Text>
                            <Divider/>
                            </>
                        )
                    })
                }
                </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>Cancel</Button>
              <Button onClick={pushRoute} colorScheme='blue'>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    )
  }