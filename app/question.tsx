import { Checkbox, CheckboxGroup, Flex, FormControl, FormLabel, Heading, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Select, Stack, Textarea } from "@chakra-ui/react"
import { Question, QuestionType } from "./questionData"
import { FormValues } from './form'
import React, { ReactNode } from "react"

type QuestionListProps = {
  question: Question,
  formValues: FormValues,
  setNext: (step: number) => void
  setFormValues: (formValues: FormValues) => void
}

export default function QuestionCard(props: QuestionListProps) {
  const { question, formValues, setFormValues, setNext } = props;

  const inputBar = (question: Question) => {
    switch (question.type) {
      case QuestionType.Single:
        return <Select
          placeholder={question.textDesc}
          onChange={
            event => {
              if (question.options == null) {
                return
              }

              console.log(event.target.value in question.options)
              if (event.target.value in question.options) {
                const selected = question.options[event.target.value]
                const newFormValues = { ...formValues }
                newFormValues[question.id] = selected.value
                setFormValues(newFormValues)
                setNext(selected.next)
              } else {
                const newFormValues = { ...formValues }
                newFormValues[question.id] = null
                setFormValues(newFormValues)
                console.log(formValues)
                setNext(0)
              }
            }
          }>
          {question.options ? Object.entries(question.options).map(([k, v]) =>
            <option key={`${k}_${v.value}`} value={k}> {k} </option>
          ) : ""}
        </Select>
      case QuestionType.Multiple:
        const options = Object.entries(question.options || {}).map(([k, v]) => {
          if (v.addition) {
            return <>
              <Checkbox key={`${k}_${v.value}`} value={k}> {k} </Checkbox>
              {inputBar(v.addition)}
            </>

          } else {
            return <Checkbox key={`${k}_${v.value}`} value={k}> {k} </Checkbox>
          }
        }
        )

        return <CheckboxGroup defaultValue={[]} onChange={(values) => {
          if (question.options == null) {
            return
          }

          if (values.length == 0) {
            setNext(0)
            return
          }

          let selected_value = [] as any[]
          for (const value in values) {
            if (value in question.options) {
              const selected = question.options[value]
              selected_value.push(selected.value)
            }
          }

          const newFormValues = { ...formValues }
          newFormValues[question.id] = selected_value
          setFormValues(newFormValues)

          setNext(question.next || 0)
        }}>
          <Stack spacing={[1, 5]} direction={['column']}>
            {options}
          </Stack>
        </CheckboxGroup>
      case QuestionType.Textarea:
        return <Textarea
          placeholder={question.textDesc}
          onChange={event => {
            // console.log(event)
            let newFormValues = { ...formValues }
            if (question.next && event.target.value.length > 0) {
              newFormValues[question.id] = event.target.value
              setFormValues(newFormValues)
              setNext(question.next || 0)
            }
          }} />
      case QuestionType.Slider:
        return <RangeSlider aria-label={['min', 'max']} onChange={(values) => {
          const newFormValues = { ...formValues }
          newFormValues[question.id] = values
          setFormValues(newFormValues)
          setNext(question.next || 0)
        }}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      case QuestionType.Compound:
        const subQuestionElements: ReactNode[] = Object.entries(question.compound ?? {}).map((entry) => {
          const [desc, subQuestion] = entry
          return <div onClick={() => setNext(question.next || 0)}>
            {desc}
            {inputBar(subQuestion)}
          </div>
        })

        return subQuestionElements
      case QuestionType.Ending:
        if (question.reward == true) {
          setNext(255)
        } else {
          setNext(-1)
        }
        return question.textDesc
      default:
        return `unknown type ${question.type}`
    }
  }

  return <Flex>
    {/* <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
          Question
        </Heading> */}
    <FormControl>
      <FormLabel>{question.stem}</FormLabel>
      {inputBar(question)}
    </FormControl>
  </Flex>

}