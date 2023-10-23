import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Question, QuestionType, SurveyQuestion } from "./questionData";
import { FormValues } from "./form";
import React, {
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { match } from "assert";
import Markdown from "react-markdown";

interface QuestionCardProps {
  question: SurveyQuestion;
  setNext: (step: number) => void;
}

export type QuestionCardRef = {
  getAnswer: () => any;
};

export function QuestionCard(props: QuestionCardProps, ref: Ref<any>) {
  const [answer, setAnswer] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [inputWarn, setInputWarn] = useState(false);
  const toast = useToast();

  useImperativeHandle(ref, () => ({
    getAnswer: () => {
      return answer;
    },
  }));

  const inputBar = (
    question: SurveyQuestion,
    setRestrict?: (pass: boolean) => void
  ) => {
    switch (question.type) {
      case "single_choice":
        return (
          <Select
            placeholder={"Select one"}
            onChange={(event) => {
              const answerElem = question.answers.find((answer) => {
                return answer.text == event.target.value;
              });
              console.log(answerElem);
              if (answerElem) {
                setAnswer(answerElem.text);
                props.setNext(answerElem.goto);
                if (setRestrict) setRestrict(true);
              } else {
                setAnswer(null);
                props.setNext(0);
                if (setRestrict) setRestrict(false);
              }
            }}
          >
            {Object.entries(question.answers).map(([k, v]) => (
              <option key={`${k}_${v.text}`} value={v.text}>
                {v.text}
              </option>
            ))}
          </Select>
        );
      case "multiple_choice_with_input":
        const checkOpts = Object.entries(question.answers || []).map(
          ([k, v]) => {
            if (v.input) {
              const [checked, setChecked] = useState(false);
              return (
                <>
                  <Checkbox
                    key={`${k}_${v.text}`}
                    isChecked={checked}
                    value={v.text}
                  >
                    {v.text}
                  </Checkbox>
                  <Input
                    type="text"
                    value={inputValue}
                    disabled={inputDisabled}
                    placeholder={inputPlaceholder}
                    onChange={(val) => {
                      setInputValue(val.target.value);
                      // inputRef.current = val.target.value;

                      let selected = { ...answer };
                      if (val.target.value.length > 0) {
                        selected.push(val.target.value);
                      }

                      setAnswer(selected);
                      console.log(selected);

                      const answerElem = question.answers.find((answer) => {
                        return answer.input != null;
                      });

                      props.setNext(answerElem?.goto || 0);

                      setChecked(true);
                    }}
                  />
                </>
              );
            } else {
              return (
                <Checkbox key={`${k}_${v.text}`} value={v.text}>
                  {v.text}
                </Checkbox>
              );
            }
          }
        );

        return (
          <CheckboxGroup
            defaultValue={[]}
            onChange={(values) => {
              console.log(values);
              if (question.answers == null) {
                return;
              }

              if (values.length == 0) {
                props.setNext(0);
                if (setRestrict) setRestrict(false);
                return;
              }

              let selected = [] as any[];

              let enableInput = false;

              for (const value of values) {
                // console.log(value)
                const answerElem = question.answers.find((answer) => {
                  return answer.text == value;
                });
                // const answerElem = question.answers[value]
                // console.log(answerElem)
                if (answerElem) {
                  if (answerElem.input) {
                    // when require input
                    // if (inputRef.current.length > 0) {
                    // if (inputValue.length > 0) {
                    //   props.setNext(answerElem.goto);
                    // } else {
                    //   props.setNext(0); // disbale next when no input
                    // }

                    enableInput = true;

                    props.setNext(0); // disbale next when no input
                  } else {
                    selected.push(answerElem.text);
                    props.setNext(answerElem.goto);
                  }
                }
              }

              if (enableInput == true) {
                setInputDisabled(false); // allow edit
                // // add input to the end
                // if (inputValue.length > 0) {
                //   selected.push(inputValue);
                // }
                setInputPlaceholder("please input your answer here")
              } else {
                setInputValue("");
                setInputDisabled(true); // disable edit and clear input
              }

              setAnswer(selected);
              console.log(selected);

              if (setRestrict) setRestrict(true);
            }}
          >
            <Stack spacing={[1, 5]} direction={["column"]}>
              {checkOpts}
            </Stack>
          </CheckboxGroup>
        );
      case "single_choice_with_input":
        const radioOpts = Object.entries(question.answers || []).map(
          ([k, v]) => {
            if (v.input) {
              const [checked, setChecked] = useState(false);
              return (
                <>
                  <Radio
                    key={`${k}_${v.text}`}
                    isChecked={checked}
                    value={v.text}
                  >
                    {v.text}
                  </Radio>
                  <Input
                    type="text"
                    value={inputValue}
                    disabled={inputDisabled}
                    placeholder={inputPlaceholder}
                    onChange={(val) => {
                      setInputValue(val.target.value);
                      // inputRef.current = val.target.value;

                      let selected = { ...answer };
                      if (val.target.value.length > 0) {
                        selected.push(val.target.value);
                      }

                      setAnswer(selected);
                      console.log(selected);

                      setChecked(true);
                    }}
                  />
                </>
              );
            } else {
              return (
                <Radio key={`${k}_${v.text}`} value={v.text}>
                  {v.text}
                </Radio>
              );
            }
          }
        );

        return (
          <RadioGroup
            // defaultValue={[]}
            onChange={(value) => {
              const answerElem = question.answers.find((answer) => {
                return answer.text == value;
              });
              // const answerElem = question.answers[value]
              // console.log(answerElem)

              let answer: string[];
              let enableInput = false;
              // console.log(value)
              if (answerElem) {
                if (answerElem.input) {
                  // when require input
                  answer = [answerElem.text, inputValue]; // inputRef.current;
                  enableInput = true;
                  // if (inputRef.current.length > 0) {
                  // if (inputValue.length > 0) {
                  //   props.setNext(answerElem.goto);
                  // } else {
                  props.setNext(0); // disbale next when no input
                  // }
                } else {
                  answer = [answerElem.text];
                  props.setNext(answerElem.goto);
                }

                if (enableInput == true) {
                  setInputDisabled(false); // allow edit
                  // // add input to the end
                  // if (inputValue.length > 0) {
                  //   selected.push(inputValue);
                  // }
                  setInputPlaceholder("please input your answer here")
                } else {
                  setInputValue("");
                  setInputDisabled(true); // disable edit and clear input
                }

                setAnswer(answer);
                console.log(answer);

                if (setRestrict) setRestrict(true);
              }
            }}
          >
            <Stack spacing={[1, 5]} direction={["column"]}>
              {radioOpts}
            </Stack>
          </RadioGroup>
        );
      case "text":
        return (
          <Textarea
            placeholder={"Type your answer here"}
            onChange={(event) => {
              // console.log(event)
              if (event.target.value) {
                setAnswer(event.target.value);
                props.setNext(question.answers[0].goto);
              }

              if (setRestrict) setRestrict(true);
            }}
          />
        );
      // case QuestionType.Ranger:
      //   const [sliderValueMin, setSliderValueMin] = React.useState(question.range[0])
      //   const [sliderValueMax, setSliderValueMax] = React.useState(question.range[1])
      //   return <RangeSlider mt={10} aria-label={['min', 'max']} min={question.range[0]} max={question.range[1]} defaultValue={question.range} onChange={(values) => {
      //     setSliderValueMin(values[0])
      //     setSliderValueMax(values[1])
      //     setAnswer(values)
      //     props.setNext(question.next || 0)
      //   }}>
      //     <RangeSliderTrack>
      //       <RangeSliderFilledTrack />
      //     </RangeSliderTrack>
      //     <Tooltip
      //       hasArrow
      //       bg='teal.500'
      //       color='white'
      //       placement='top'
      //       isOpen={true}
      //       label={`${sliderValueMin}`}
      //     >
      //       <RangeSliderThumb index={0} />
      //     </Tooltip>
      //     <Tooltip
      //       hasArrow
      //       bg='teal.500'
      //       color='white'
      //       placement='top'
      //       isOpen={true}
      //       label={`${sliderValueMax}`}
      //     >
      //       <RangeSliderThumb index={1} />
      //     </Tooltip>
      //   </RangeSlider>
      case "number":
        return (
          <NumberInput
            // type="number"
            min={0}
            max={100}
            placeholder={"Type your answer here"}
            onChange={(valueAsString: string, valueAsNumber: number) => {
              // console.log(event)
              // if (valueAsNumber) {
                // const num = parseInt(event.target.value);
                if (valueAsNumber > 100 || valueAsNumber < 0) {
                  toast({
                    title: "Error",
                    description: "Please enter a number between 0 and 100",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  props.setNext(0);
                  return;
                }

                setAnswer(valueAsNumber);
                props.setNext(question.answers[0].goto);
              // }

              if (setRestrict) setRestrict(true);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );
      case "rating":
        const [sliderValue, setSliderValue] = React.useState(
          (question.range ? question.range[0] + question.range[1] : 10) / 2
        );
        return (
          <Slider
            mt={10}
            aria-label={"slider"}
            min={question.range ? question.range[0] : 0}
            max={question.range ? question.range[1] : 10}
            onChange={(value) => {
              value = value | 0;
              setSliderValue(value);

              const answerElem = question.answers.find((answer) => {
                return answer.text[0] == value.toString();
              });
              if (answerElem) {
                setAnswer(answerElem.text);
                props.setNext(question.answers[0].goto || 0);
              }

              if (setRestrict) setRestrict(true);
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              // isOpen={true}
              label={`${sliderValue}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        );
      case "compound":
        const doneRef = useRef({} as { [key: string]: boolean });
        let allDoneCount = 0;
        if (question.subQuestions) {
          return Object.entries(question.subQuestions).map(
            ([text, questions], index) => {
              return (
                <div style={{ padding: "1rem" }}>
                  <FormLabel>
                    <Markdown>{text}</Markdown>
                  </FormLabel>
                  {questions.map((q, i) => {
                    allDoneCount++;

                    switch (q.type) {
                      case "single_choice":
                        return (
                          <div style={{ padding: "1rem" }}>
                            <FormLabel>{q.text}</FormLabel>
                            <Select
                              placeholder={"Select one"}
                              key={index.toString() + i.toString()}
                              onChange={(event) => {
                                const answerElem = q.answers?.find((answer) => {
                                  return answer.text == event.target.value;
                                });
                                console.log(answerElem);
                                if (answerElem) {
                                  let newAnswer = answer ?? {};
                                  newAnswer[q.text.toString()] =
                                    answerElem.text;
                                  setAnswer(newAnswer);
                                  doneRef.current[
                                    index.toString() + i.toString()
                                  ] = true;
                                  const doneCount = Object.entries(
                                    doneRef.current
                                  ).length;
                                  console.log(doneCount, allDoneCount);
                                  if (doneCount == allDoneCount) {
                                    props.setNext(question.answers[0].goto);
                                  }

                                  if (setRestrict) setRestrict(true);
                                } else {
                                  let newAnswer = answer ?? {};
                                  newAnswer[q.text.toString()] = null;
                                  setAnswer(newAnswer);
                                  props.setNext(0);
                                  if (setRestrict) setRestrict(false);
                                }
                              }}
                            >
                              {Object.entries(q.answers ?? {}).map(([k, v]) => (
                                <option key={`${k}_${v.text}`} value={v.text}>
                                  {v.text}
                                </option>
                              ))}
                            </Select>
                          </div>
                        );
                      case "text":
                        return (
                          <div style={{ padding: "1rem" }}>
                            <FormLabel>
                              <Markdown>{text}</Markdown>
                            </FormLabel>
                            <Textarea
                              placeholder={"Type your answer here"}
                              key={index + i}
                              onChange={(event) => {
                                // console.log(event)
                                if (event.target.value) {
                                  let newAnswer = answer ?? {};
                                  newAnswer[q.text.toString()] =
                                    event.target.value;
                                  setAnswer(newAnswer);

                                  doneRef.current[
                                    index.toString() + i.toString()
                                  ] = true;
                                  const doneCount = Object.entries(
                                    doneRef.current
                                  ).length;
                                  console.log(
                                    doneRef.current,
                                    doneCount,
                                    allDoneCount
                                  );
                                  if (doneCount == allDoneCount) {
                                    props.setNext(question.answers[0].goto);
                                  }
                                }

                                if (setRestrict) setRestrict(true);
                              }}
                            />
                          </div>
                        );
                      case "number":
                        return (
                          <div style={{ padding: "1rem" }}>
                            <FormLabel>{q.text}</FormLabel>
                            <NumberInput
                              // type="number"
                              min={0}
                              max={100}
                              placeholder={"Type your answer here"}
                              key={index.toString() + i.toString()}
                              onChange={(valueAsString: string, valueAsNumber: number) => {
                                // console.log(event)
                                // if (valueAsNumber !== null) {
                                  // const num = parseInt(valueAsNumber);
                                  if (valueAsNumber > 100 || valueAsNumber < 0) {
                                    toast({
                                      title: "Error",
                                      description:
                                        "Please enter a number between 0 and 100",
                                      status: "error",
                                      duration: 9000,
                                      isClosable: true,
                                    });
                                    delete doneRef.current[
                                      index.toString() + i.toString()
                                    ];
                                    props.setNext(0);
                                    return;
                                  }

                                  let newAnswer = answer ?? {};
                                  newAnswer[q.text.toString()] = valueAsNumber;
                                  setAnswer(newAnswer);

                                  doneRef.current[
                                    index.toString() + i.toString()
                                  ] = true;
                                  const doneCount = Object.entries(
                                    doneRef.current
                                  ).length;
                                  console.log(
                                    doneRef.current,
                                    doneCount,
                                    allDoneCount
                                  );
                                  if (doneCount == allDoneCount) {
                                    props.setNext(question.answers[0].goto);
                                  }
                                // }

                                if (setRestrict) setRestrict(true);
                              }}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </div>
                        );
                    }
                  })}
                </div>
              );
            }
          );
        }

      // case QuestionType.Compound:
      //   const restricts = [] as boolean[]
      //   const subQuestionElements: ReactNode[] = Object.entries(question.compound ?? {}).map((entry) => {
      //     const [compoundRestrict, setCompoundRestrict] = useState(false)
      //     restricts.push(compoundRestrict)
      //     const [desc, subQuestion] = entry
      //     return <div>
      //       {desc}
      //       {inputBar(subQuestion, setCompoundRestrict)}
      //     </div>
      //   })

      //   useEffect(()=> {
      //     let checker = (arr: boolean[]) => arr.every(Boolean);
      //     if (checker(restricts)) {
      //       props.setNext(question.next || 0)
      //     }
      //   })

      //   return subQuestionElements
      // case QuestionType.Ending:
      //   if (question.reward == true) {
      //     props.setNext(255)
      //   } else {
      //     props.setNext(-1)
      //   }
      //   return question.textDesc
      default:
        return `unknown type ${question.type}`;
    }
  };

  return (
    <>
      <FormLabel>{props.question.text}</FormLabel> {inputBar(props.question)}
    </>
  );
}

export default forwardRef<QuestionCardRef, QuestionCardProps>(QuestionCard);
