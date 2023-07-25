import { Checkbox, CheckboxGroup, Flex, FormControl, FormLabel, Heading, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Textarea, Tooltip } from "@chakra-ui/react"
import { Question, QuestionType } from "./questionData"
import { FormValues } from './form'
import React, { ReactNode, useEffect, useState } from "react"

type QuestionListProps = {
  question: Question,
  formValues: FormValues,
  setNext: (step: number) => void
  setFormValues: (formValues: FormValues) => void
}

export default function QuestionCard(props: QuestionListProps) {
  const { question, formValues, setFormValues, setNext } = props;

  const inputBar = (question: Question, setRestrict?: (pass: boolean)=>void) => {
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
                if (setRestrict) setRestrict(true)
              } else {
                const newFormValues = { ...formValues }
                newFormValues[question.id] = null
                setFormValues(newFormValues)
                console.log(formValues)
                setNext(0)
                if (setRestrict) setRestrict(false)
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
            if (setRestrict) setRestrict(false)
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
          if (setRestrict) setRestrict(true)
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
              if (setRestrict) setRestrict(true)
            }
          }} />
      case QuestionType.Ranger:
        const [sliderValueMin, setSliderValueMin] = React.useState(question.range[0])
        const [sliderValueMax, setSliderValueMax] = React.useState(question.range[1])
        return <RangeSlider mt={10} aria-label={['min', 'max']} min={question.range[0]} max={question.range[1]} defaultValue={question.range} onChange={(values) => {
          setSliderValueMin(values[0])
          setSliderValueMax(values[1])
          const newFormValues = { ...formValues }
          newFormValues[question.id] = values
          setFormValues(newFormValues)
          setNext(question.next || 0)
        }}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <Tooltip
            hasArrow
            bg='teal.500'
            color='white'
            placement='top'
            isOpen={true}
            label={`${sliderValueMin}`}
          >
            <RangeSliderThumb index={0} />
          </Tooltip>
          <Tooltip
            hasArrow
            bg='teal.500'
            color='white'
            placement='top'
            isOpen={true}
            label={`${sliderValueMax}`}
          >
            <RangeSliderThumb index={1} />
          </Tooltip>
        </RangeSlider>
      case QuestionType.Slider:
        const [sliderValue, setSliderValue] = React.useState((question.range[0] + question.range[1]) / 2)
        return <Slider mt={10} aria-label={'slider'} min={question.range[0]} max={question.range[1]} onChange={(value) => {
          setSliderValue(value)

          const newFormValues = { ...formValues }
          newFormValues[question.id] = value
          setFormValues(newFormValues)
          setNext(question.next || 0)
          if (setRestrict) setRestrict(true)
        }}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg='teal.500'
            color='white'
            placement='top'
            isOpen={true}
            label={`${sliderValue}`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      case QuestionType.Compound:
        const restricts = [] as boolean[]
        const subQuestionElements: ReactNode[] = Object.entries(question.compound ?? {}).map((entry) => {
          const [compoundRestrict, setCompoundRestrict] = useState(false)
          restricts.push(compoundRestrict)
          const [desc, subQuestion] = entry
          return <div>
            {desc}
            {inputBar(subQuestion, setCompoundRestrict)}
          </div>
        })

        useEffect(()=> {
          let checker = (arr: boolean[]) => arr.every(Boolean);
          if (checker(restricts)) {
            setNext(question.next || 0)
          }
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