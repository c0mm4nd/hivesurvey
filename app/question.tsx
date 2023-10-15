import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
} from "@chakra-ui/react";
import { Question, QuestionType, SurveyQuestion } from "./questionData";
import { FormValues } from "./form";
import React, {
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

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

  useImperativeHandle(
    ref,
    () => ({
      getAnswer: () => {
        return answer;
      },
    }),
    [answer]
  );

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
      case "multiple_choice":
        const options = Object.entries(question.answers || []).map(([k, v]) => {
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
                    onChange={(val) => {
                      setInputValue(val.target.value);
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
        });

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
              for (const value of values) {
                // console.log(value)
                const answerElem = question.answers.find((answer) => {
                  return answer.text == value;
                });
                // const answerElem = question.answers[value]
                // console.log(answerElem)
                if (answerElem) {
                  if (answerElem.input) {
                    selected.push(answerElem.text + inputValue);
                    props.setNext(answerElem.goto || 0);
                  } else {
                    selected.push(answerElem.text);
                    props.setNext(answerElem.goto || 0);
                  }
  
                }
              }
              setAnswer(selected);
              console.log(selected);

              if (setRestrict) setRestrict(true);
            }}
          >
            <Stack spacing={[1, 5]} direction={["column"]}>
              {options}
            </Stack>
          </CheckboxGroup>
        );
      case "text":
        return (
          <Textarea
            placeholder={question.text}
            onChange={(event) => {
              // console.log(event)
              if (event.target.value) {
                setAnswer(event.target.value);
                props.setNext(question.answers[0].goto || 0);
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
