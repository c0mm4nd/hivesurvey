import React, { useState } from 'react';
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
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type Question = {
  q: string,
  options: { [option: string]: number },
}

type SubformProp = {
  step: number,
  q: Question
}

const Subform = (prop: SubformProp) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Question {prop.step}
      </Heading>
      <Flex>
        <FormControl>
          <FormLabel>{prop.q.q}</FormLabel>
          <Select>
            {Object.entries(prop.q.options).map(([k, v]) => <option key={`${k}_${v}`} value={v}> {k} </option>)}
          </Select>
        </FormControl>
      </Flex>
    </>
  );
};

const Form = () => {
  let [questions, setQuestions] = useState([
    {
      q: "Are you a user in Steem chain registered before February 14",
      options: { "Yes": 1, "No": -1 }
    },
    {
      q: "WIP",
      options: { "Finish": -1 }
    },
  ] as Question[])

  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(100 / questions.length);

  return (
    <>
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
        { <Subform step={step} q={questions[step-1]}></Subform> }
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1); // TODO
                  setProgress(progress - 33.33); // TODO
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === questions.length ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  // TODO
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