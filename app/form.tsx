'use client'

import { Dispatch, Ref, SetStateAction, useContext, useRef, useState, useTransition } from 'react';
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
  Textarea,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';
import { UserContext } from './providers';
import { ReferenceEntry } from 'typescript';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

enum QuestionType {
  Single = "single",
  Multiple = "multi",
  Textarea = "textarea",
  Ending = "ending"
}

type Question = {
  stem: string,
  type: QuestionType,
  options?: { [option: string]: { value: number, next: number } },
  textDesc?: string,
  next?: number,
}

type SubformProp = {
  step: number,
  question: Question
  formValues: any[],
  setFormValues: Dispatch<SetStateAction<any[]>>
  setNext: Dispatch<SetStateAction<number>>
}

const Subform = (prop: SubformProp) => {
  let formPanel = null
  switch (prop.question.type) {
    case QuestionType.Single:
      formPanel = <Select
        placeholder={prop.question.textDesc}
        onChange={
          event => {
            if (prop.question.options == null) {
              return
            }
            if (event.target.value in prop.question.options) {
              const selected = prop.question.options[event.target.value]
              prop.formValues[prop.step] = selected.value
              prop.setFormValues(prop.formValues)
              prop.setNext(selected.next)
            } else {
              prop.formValues[prop.step] = null
              prop.setFormValues(prop.formValues)
              prop.setNext(0)
            }

            console.log("formValues", prop.formValues)
          }
        }>
        {prop.question.options ? Object.entries(prop.question.options).map(([k, v]) =>
          <option key={`${k}_${v.value}`} value={k}> {k} </option>
        ) : ""}
      </Select>
      break;
    case QuestionType.Textarea:
      formPanel = <Textarea placeholder={prop.question.textDesc} onChange={event => {
        // console.log(event)
        if (prop.question.next && event.target.value.length > 0) {
          prop.formValues[prop.step] = event.target.value
          prop.setFormValues(prop.formValues)
          prop.setNext(prop.question.next)
        }
      }} />
      break;
    case QuestionType.Ending:
      formPanel = prop.question.textDesc
      break
    default:
      formPanel = `unknown type ${prop.question.type}`
  }

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Question {prop.step + 1}
      </Heading>
      <Flex>
        <FormControl>
          <FormLabel>{prop.question.stem}</FormLabel>
          {formPanel}
        </FormControl>
      </Flex>
    </>
  );
};

const Form = () => {
  let [formValues, setFormValues] = useState([] as ReferenceEntry[])

  let [questions, setQuestions] = useState([
    {
      stem: "Are you a user in Steem chain registered before February 14?",
      type: QuestionType.Single,
      textDesc: "Yes or No",
      options: { "Yes": { value: 1, next: 1 }, "No": { value: 0, next: 2 } }
    },
    {
      stem: "test textarea",
      type: QuestionType.Textarea,
      textDesc: "this is a placeholder",
      next: 2
    },
    {
      stem: "Ending",
      type: QuestionType.Ending,
    },
  ] as Question[])

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
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alert?.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {alert?.body}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
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
        <form>
          <input hidden={true} name='name' value={user?.name} readOnly={true}></input>
          <Subform
            step={step}
            question={questions[step]}
            formValues={formValues}
            setFormValues={setFormValues}
            setNext={setNext}
          ></Subform>

          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={() => {
                    // setStep(step - 1); // TODO
                    // setProgress(progress - 33.33); // TODO
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
              {step === questions.length -1 ? (
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
        </form>


      </Box>
    </>
  );
};

export default Form;