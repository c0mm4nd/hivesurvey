"use client";

import {
  Dispatch,
  ReactNode,
  Ref,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  VisuallyHidden,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { UserContext } from "./providers";
import { Question, QuestionType, survey } from "./questionData";
import QuestionCard, { QuestionCardRef } from "./question";
import React from "react";

export type FormValues = { [id: number]: number | number[] | string };

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
  console.log("survey.questions.length", survey.questions.length);

  const toast = useToast();
  const [step, setStep] = useState(0);
  const [next, setNext] = useState(0);

  const [progress, setProgress] = useState(100 / survey.questions.length);

  const { user, setUser } = useContext(UserContext);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const cardsRef = useRef({} as { [k: number]: QuestionCardRef | null });

  const getQuestionAnswers = function () {
    let answers = {} as { [k: number]: any };
    if (cardsRef.current) {
      Object.entries(cardsRef.current).forEach(([key, value]) => {
        if (value != null) {
          answers[key] = value.getAnswer();
        }
      });
    }
    return answers;
  };

  const cancelRef = useRef();
  interface IAlert {
    title: string;
    body: string;
  }
  const [alert, setAlert] = useState<IAlert | null>(null);

  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        leastDestructiveRef={null}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alert?.title}
            </AlertDialogHeader>

            <AlertDialogBody>{alert?.body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onAlertClose}>Close</Button>
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
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        <input
          hidden={true}
          name="name"
          value={user?.name}
          readOnly={true}
        ></input>

        <Flex>
          <FormControl>
            {survey.questions.map((question, index) => {
              // console.log("index", index, "step", step, "next", next);

              return (
                <div style={{ display: index == step ? "block" : "none" }}>
                  <QuestionCard
                    question={question}
                    setNext={setNext}
                    key={index}
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                  ></QuestionCard>
                </div>
              );
            })}
          </FormControl>
        </Flex>
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  const newStep = step - 1;
                  const newNext = step;
                  setStep(newStep);
                  setProgress((newStep * 100) / survey.questions.length);
                  setNext(newNext);
                }}
                isDisabled={step === 0}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Previous
              </Button>
              <Button
                w="7rem"
                hidden={step == survey.questions.length - 1}
                isDisabled={
                  next == 0 ||
                  next == 255 ||
                  next == -1 ||
                  next == survey.questions.length // user == null
                }
                onClick={() => {
                  const newStep = next;
                  if (newStep == -1 || newStep == 255) {
                    setProgress(100);
                  } else {
                    setProgress((newStep * 100) / survey.questions.length);
                  }

                  const newNext = cardsRef.current[newStep]?.getPrivateNext();

                  setStep(newStep);
                  setNext(newNext || 0);
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {next == 255 || next == -1 || next == survey.questions.length ? (
              <Button
                // type='submit'
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={async (event) => {
                  // toast({
                  //   title: "Submitting...",
                  //   description: JSON.stringify({
                  //     user: user,
                  //     form: getQuestionAnswers(),
                  //   }),
                  //   status: "info",
                  //   duration: 9000,
                  //   isClosable: true,
                  // });
                  if (user == null) {
                    setAlert({
                      title: "Require Login",
                      body: "Login is required to submit your survey and gain the reward!",
                    });
                    onAlertOpen();
                  } else {
                    const response = await fetch("/api/submit", {
                      method: "POST",
                      body: JSON.stringify({
                        user: user,
                        form: getQuestionAnswers(),
                      }),
                    });
                    const resp = await response.json();
                    console.log(resp);

                    if (resp.error) {
                      setAlert({
                        title: "Error",
                        body: `detail: ${resp.error}`,
                      });
                      onAlertOpen();
                    } else {
                      if (resp.result.txId) {
                        setAlert({
                          title: "Thanks for your submission",
                          body: `Your reward has beed claimed by txid: ${resp.result.txId}`,
                        });
                      } else {
                        setAlert({
                          title: "Thanks for your submission",
                          body: ``,
                        });
                      }

                      onAlertOpen();
                    }
                  }
                }}
              >
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
