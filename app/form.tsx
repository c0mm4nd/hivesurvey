'use client'

import { Dispatch, ReactNode, Ref, SetStateAction, createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';
import { UserContext } from './providers';
import { Question, QuestionType, initialQuestions } from './questionData';
import QuestionCard from './question'


export type FormValues = { [id: number]: number | number[] | string }

// type SubformProps = {
//   step: number,
//   question: Question | Question[],
//   formValues: FormValues,
//   setFormValues: (values: FormValues) => void,
//   setNext: (num: number) => void
// }

// const Subform = (props: SubformProps) => {
//   let questions = [] as Question[]

//   return (
//     <>
//       {
//         questions.map((question) => <div key={question.id}>
//           <Flex>
//             <FormControl>
//               <FormLabel>{question.stem}</FormLabel>

//               {() => {

//               }()}
//             </FormControl>
//           </Flex>
//         </div>

//         )
//       }
//     </>
//   );
// };

const Form = () => {
  let [formValues, setFormValues] = useState({} as FormValues)

  let [questions, setQuestions] = useState(initialQuestions)

  console.log(questions.length)

  const toast = useToast();
  const [step, setStep] = useState(0);
  const [next, setNext] = useState(0);

  const [progress, setProgress] = useState(100 / questions.length);

  const { user, setUser } = useContext(UserContext);

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure()

  const cancelRef = useRef()
  interface IAlert {
    title: string
    body: string,
  }
  const [alert, setAlert] = useState<IAlert | null>(null)

  let [isPending, startTransition] = useTransition()

  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose} leastDestructiveRef={null}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alert?.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {alert?.body}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onAlertClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>


      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated></Progress>
        <input hidden={true} name='name' value={user?.name} readOnly={true}></input>

        {
          <QuestionCard question={questions[step]} formValues={formValues} setNext={setNext} setFormValues={setFormValues} key={questions[step].id} ></QuestionCard>
        }
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(0)
                  setProgress(100 / questions.length)
                  setNext(0)
                }}
                isDisabled={step === 0}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Reset
              </Button>
              <Button
                w="7rem"
                hidden={step == questions.length - 1}
                isDisabled={
                  next == 0 ||
                  false // user == null
                }
                onClick={() => {
                  setStep(next);

                  if (next == questions.length - 1) {
                    setProgress(100);
                  } else {
                    setProgress((next + 1) * 100 / questions.length);
                  }

                  setNext(0)
                }}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === questions.length - 1 ? (
              <Button
                // type='submit'
                w="7rem"
                colorScheme="red"
                variant="solid" onClick={async event => {

                  if (user == null) {
                    setAlert({ title: "Require Login", body: "Login is required to submit your survey and gain the reward!" })
                    onAlertOpen()
                  } else {
                    const response = await fetch("/api/submit", {
                      method: "POST",
                      body: JSON.stringify({
                        user: user,
                        form: formValues,
                      }),
                    });
                    const resp = await response.json();
                    console.log(resp);

                    if (resp.error) {
                      setAlert({ title: "Error", body: `detail: ${resp.error}` })
                      onAlertOpen()
                    } else {
                      setAlert({ title: "Reward Claimed", body: `txid: ${resp.result.txId}` })
                      onAlertOpen()
                    }
                  }

                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default Form;
