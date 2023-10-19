import { Heading, Text } from "@chakra-ui/react";
import next from "next/types";
import React, { ReactElement } from "react";

export enum QuestionType {
  Compound = "compound",
  Single = "single",
  Multiple = "multi",
  Slider = "slider",
  Ranger = "rander",
  Textarea = "textarea",
  Ending = "ending",
}

export type Question = {
  id: number;
  type: QuestionType;

  stem?: ReactElement;
  options?: {
    [option: string]: { value: number; next: number; addition?: Question };
  };
  compound?: { [desc: string]: Question };
  textDesc?: string;
  range?: number[];
  next?: number;
  reward?: boolean;
};

export interface Survey {
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  type:
    | "single_choice"
    | "multiple_choice"
    | "text"
    | "rating"
    | "compound"
    | "number";
  text: string | ReactElement;
  answers: SurveyAnswer[];
  range?: number[];
  subQuestions?: { [text: string]: SubQuestion[] };
}

export interface SubQuestion {
  type: "text" | "single_choice" | "number";
  text: string | ReactElement;
  answers?: SubAnswer[];
}

export interface SubAnswer {
  text: string;
}

export interface SurveyAnswer {
  text: string;
  goto: number;
  input?: boolean;
}

export const survey: Survey = {
  questions: [
    {
      type: "single_choice", // 0
      text: "Are you a user registered on the Steem blockchain on or before February 14, 2020?",
      answers: [
        { text: "Yes", goto: 1 },
        { text: "No (If 'No', this marks the end of the survey.)", goto: -1 },
      ],
    },
    {
      type: "single_choice", // 1
      text: "Between February 14, 2020, when Tron's takeover of Steemit, Inc. was announced, and March 20, 2020, when the community initiated the hard fork, did you remain active in the Steem community by engaging in at least one of the following activities: posting articles, making comments, powering up/down, or voting?",
      answers: [
        { text: "Yes", goto: 2 },
        { text: "No (If 'No', this marks the end of the survey.)", goto: -1 },
      ],
    },
    {
      type: "single_choice", // 2
      text: "On February 14, 2020, Tron's takeover of Steemit, Inc. was announced. This takeover has a substantial impact on the Steem community. Before proceeding, you may learn more about this event at https://cryptobriefing.com/steemit-migrate-tron-blockchain-year/ Were you aware of this takeover event and its subsequent developments before the hard fork on March 20, 2020?",
      answers: [
        { text: "Yes", goto: 3 },
        { text: "No (If 'No', this marks the end of the survey.)", goto: -1 },
      ],
    },
    {
      type: "text", // 3
      text: "What is your Steem account name?",
      answers: [{ text: "", goto: 4 }],
    },
    {
      type: "single_choice", // 4
      text: "Please rate the appropriateness of Tron's takeover on February 14, 2020, based on your opinion.",
      range: [1, 5],
      answers: [
        { text: "1 = Completely appropriate", goto: 5 },
        { text: "2 = Appropriate", goto: 5 },
        { text: "3 = Neutral", goto: 5 },
        { text: "4 = Inappropriate", goto: 5 },
        { text: "5 = Completely inappropriate", goto: 5 },
      ],
    },
    {
      type: "single_choice", // 5
      text: "To what extent do you agree with the opinion that Tron's takeover on February 14, 2020, violated certain implicit community rules or standards in Steem?",
      range: [1, 5],
      answers: [
        { text: "1 = Fully disagree", goto: 6 },
        { text: "2 = Disagree", goto: 6 },
        { text: "3 = Neutral", goto: 6 },
        { text: "4 = Agree", goto: 6 },
        { text: "5 = Fully agree", goto: 6 },
      ],
    },
    {
      type: "number", // 6
      text: "How many individuals do you believe would agree with the viewpoint that Tron's takeover was inappropriate and might have breached certain implicit community rules or standards? Please provide an estimate of the number of people out of 100:",
      answers: [{ text: "", goto: 7 }],
    },
    {
      type: "multiple_choice", // 7
      text: "Cooperative behaviors are the pursuit of the success and growth of the Steem community that can benefit all community members. Which of the following behaviors do you believe is a cooperative behavior? (Please select all that apply.)",
      answers: [
        { text: "A. Posting high-quality content (e.g., articles)", goto: 8 },
        {
          text: "B. Making good and constructive comments on others' articles",
          goto: 8,
        },
        {
          text: "C. Purchasing votes from bots or other members to upvote their content and thereby earn tokens",
          goto: 8,
        },
      ],
    },
    {
      type: "multiple_choice", // 8
      text: "Opportunistic behaviors are the pursuit of one's own interest at the expense of the success and growth of the Steem community that can benefit all community members. Which of the following behaviors do you believe is an opportunistic behavior? (Please select all that apply.)",
      answers: [
        { text: "A. Posting high-quality content (e.g., articles)", goto: 9 },
        {
          text: "B. Making good and constructive comments on others' articles",
          goto: 9,
        },
        {
          text: "C. Purchasing votes from bots or other members to upvote their content and thereby earn tokens",
          goto: 9,
        },
      ],
    },
    {
      type: "compound", // 9
      text: (
        <>
          <p>
            Cooperative behaviors are the pursuit of the success and growth of
            the Steem community that can benefit all community members.
          </p>
          <br />
          <p >
            Opportunistic behaviors are the pursuit of one's own interest at the
            expense of the success and growth of the Steem community that can
            benefit all community members.
          </p>
          <br />
        </>
      ),
      answers: [{ text: "", goto: 10 }],
      subQuestions: {
        '(1) "Steem members should engage in cooperative behaviors."': [
          {
            type: "number",
            text: (
              <>
                (a) Please provide an estimate of the number of people out of
                100 who you think would AGREE with this statement
                <b> before Tron's takeover</b>:
              </>
            ),
          },
          {
            type: "number",
            text: (
              <>
                (b) Please provide an estimate of the number of people out of
                100 who you think would AGREE with this statement
                <b> after Tron's takeover</b>:
              </>
            ),
          },
        ],
        '(2) "Steem members should NOT engage in opportunistic behaviors."': [
          {
            type: "number",
            text: (
              <>
                (a) Please provide an estimate of the number of people out of
                100 who you think would AGREE with this statement
                <b> before Tron's takeover</b>:
              </>
            ),
          },
          {
            type: "number",
            text: (
              <>
                (b) Please provide an estimate of the number of people out of
                100 who you think would AGREE with this statement
                <b> after Tron's takeover</b>:
              </>
            ),
          },
        ],
      },
    },
    {
      type: "compound", // 10
      text: (
        <>
          <p >
            Cooperative behaviors are the pursuit of the success and growth of
            the Steem community that can benefit all community members.
          </p>
          <br />
          <p >
            Opportunistic behaviors are the pursuit of one's own interest at the
            expense of the success and growth of the Steem community that can
            benefit all community members.
          </p>
          <br />
        </>
      ),
      answers: [{ text: "", goto: 11 }],
      subQuestions: {
        "(1) How many members you believe are engaging in cooperative behaviors?":
          [
            {
              type: "number",
              text: (
                <>
                  (a) Please provide an estimate of the number of people out of
                  100 <b> before Tron's takeover</b>:
                </>
              ),
            },
            {
              type: "number",
              text: (
                <>
                  (b) Please provide an estimate of the number of people out of
                  100 <b> after Tron's takeover</b>:
                </>
              ),
            },
          ],
        "(2) How many members you believe are engaging in opportunistic behaviors?":
          [
            {
              type: "number",
              text: (
                <>
                  (2) Please provide an estimate of the number of people out of
                  100 <b> before Tron's takeover</b>:
                </>
              ),
            },
            {
              type: "number",
              text: (
                <>
                  (2) Please provide an estimate of the number of people out of
                  100 <b> after Tron's takeover</b>:
                </>
              ),
            },
          ],
      },
    },
    {
      type: "single_choice", // 11
      text: (
        <>
          Considering that cooperation is defined as the pursuit of the success
          and growth of the Steem community that can benefit all community
          members rather than pursuit of one's own interest at the expense of
          other Steem members' interests. Have you observed{" "}
          <b> decreased cooperation</b> among Steem members following Tron's
          takeover?
        </>
      ),
      answers: [
        { text: "Yes", goto: 12 },
        { text: "No", goto: 13 },
      ],
    },
    {
      type: "multiple_choice", // 12
      text: "You answered yes to decreased cooperation. What do you believe are the primary reasons for this decrease? (Select all that apply)",
      answers: [
        {
          text: "A. This takeover led to increased disagreement and conflicts among Steem members",
          goto: 13,
        },
        {
          text: "B. A perception that, for some Steem members, individual financial gains have become prioritized over contributing to the community",
          goto: 13,
        },
        {
          text: "C. A rise in unpredictable behaviors from other members, generating a sense of uncertainty",
          goto: 13,
        },
        {
          text: "D. A sense of disappointment stemming from the lack of mechanisms to punish individuals who were violating community rules and agreements",
          goto: 13,
        },
        { text: "E. Other (please specify): ", input: true, goto: 13 },
      ],
    },
    {
      type: "single_choice", // 13
      text: "Have you ever bought votes from others or from bots to earn STEEM/STEEM POWER as rewards?",
      answers: [
        { text: "Yes", goto: 14 },
        { text: "No", goto: 15 },
      ],
    },
    {
      type: "single_choice", // 14
      text: "How do you expect the value of STEEM over the next 5 years just after Tron's takeover on February 14, 2020?",
      range: [1, 5],
      answers: [
        {
          text: "1 = Very Pessimistic (I believe STEEM will significantly decrease in value)",
          goto: 16,
        },
        {
          text: "2 = Pessimistic (I believe STEEM will decrease in value)",
          goto: 16,
        },
        {
          text: "3 = Neutral (I am unsure about the future value of STEEM)",
          goto: 16,
        },
        {
          text: "4 = Optimistic (I believe STEEM will increase in value)",
          goto: 16,
        },
        {
          text: "5 = Very Optimistic (I believe STEEM will significantly increase in value)",
          goto: 16,
        },
      ],
    },
    {
      type: "multiple_choice", // 15
      text: "If you have NOT purchased votes from others, please select the most applicable reason below:",
      answers: [
        {
          text: "A. You were unaware of the opportunity for vote purchasing/You are unsure where to purchase votes.",
          goto: 16,
        },
        {
          text: "B. You believe that vote purchasing would have a detrimental impact on the Steem community.",
          goto: 16,
        },
        {
          text: "C. You consider vote purchasing to earn token rewards a form of “cheating.”",
          goto: 16,
        },
        {
          text: "D. You are concerned that your friends within the Steem community might become aware of your actions if you were to purchase votes.",
          goto: 17,
        },
        { text: "E. Other (please specify): ", input: true, goto: 16 },
      ],
    },
    {
      type: "compound",
      text: "",
      answers: [{ text: "", goto: 17 }],
      subQuestions: {
        "": [
          {
            type: "single_choice",
            text: (
              <>
                (1) Consider a scenario where
                <b> 90% </b> of the Steem community members are actively
                participating cooperative behaviors that contribute to the
                growth and success of the Steem community and benefit all Steem
                members. In this context, would you be inclined to engage in
                cooperative behaviors as well?
              </>
            ),
            answers: [{ text: "Yes" }, { text: "No" }],
          },
          {
            type: "single_choice",
            text: (
              <>
                (2) Now, envision a different scenario where only <b> 10% </b>{" "}
                of the Steem community members are actively participating
                cooperative behaviors that contribute to the growth and success
                of the Steem community and benefit all Steem members. In this
                context, would you be inclined to engage in cooperative
                behaviors as well?
              </>
            ),
            answers: [{ text: "Yes" }, { text: "No" }],
          },
        ],
      },
    },
  ],
};
