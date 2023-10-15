import { Heading, Text } from "@chakra-ui/react"
import next from "next/types"
import React, { ReactElement } from "react"

export enum QuestionType {
  Compound = "compound",
  Single = "single",
  Multiple = "multi",
  Slider = "slider",
  Ranger = "rander",
  Textarea = "textarea",
  Ending = "ending"
}

export type Question = {
  id: number,
  type: QuestionType,

  stem?: ReactElement,
  options?: { [option: string]: { value: number, next: number, addition?: Question } },
  compound?: { [desc: string]: Question },
  textDesc?: string,
  range?: number[],
  next?: number,
  reward?: boolean,
}

export interface Survey {
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  type: 'single_choice' | 'multiple_choice' | 'text' | 'rating';
  text: string;
  answers: SurveyAnswer[];
  range?: number[];
}

export interface SurveyAnswer {
  text: string;
  goto: number;
  input?: boolean;
}


// export const initialQuestions: Question[] = [
//   {
//     id: 0,
//     stem: <><Heading>Part I. INTRODUCTION</Heading> <Text>You are invited to participate in a research study conducted by Sichen Dong in the Faculty of Business and Economics at the University of Hong Kong. This is a study on the social DAO Steem chain, aiming to explore the impact of social norms on cooperative behavior within DAOs. <br /> You are required to complete a questionnaire regarding the social experiential changes you have perceived after the takeover of Steemit. Inc by Tron on February 14, 2020. The questionnaire will take approximately 15-20 minutes. There are no risks to participate in this study, beyond the risks associated with normal everyday activity. You are free to withdraw from participation at any point during the study, without providing any reason. However, any information you contribute up to the point at which you choose to withdraw will be retained and may be used in the study unless you request otherwise. <br /> If you complete the entire questionnaire, you will receive a cash reward of $20. Participation in the study is voluntary and confidential. Your data will be anonymized. If it is ever shared with anyone outside of the research team, including in any written publications or oral presentations based on this research, you will be identified only by a participant number (e.g., P12) or a pseudonym. The results of this questionnaire will be retained for a period of three years after the first publication of the study. All collected data will be password protected. <br /> If you have any questions about the research, please feel free to contact Ms. Sichen Dong (u3007640@connect.hku.hk). This study will also be supervised by Professor Michael Chau. If you have questions about your rights as a research participant, contact the Human Research Ethics Committee, HKU (2241-5267). The HREC Reference Number for this research is EA230329.</Text></>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: {
//       "Yes": { value: 1, next: 1 },
//       "No": { value: 0, next: 32 }
//     }
//   },
//   {
//     id: 1,
//     stem: <><Heading>Part II. Background Information</Heading><Text>Question 1: Are you a user in Steem chain registered before February 14?</Text></>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 2 }, "No": { value: 0, next: 32 } }
//   },
//   {
//     id: 2,
//     stem: <>Question 2: Are you remains active in the community during Feb.14 to Mar. 20? (which means you have posted articles, making comments, power up/down, or votes for at least once during this period of time) </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 3 }, "No": { value: 0, next: 32 } }
//   },
//   {
//     id: 3,
//     stem: <>Question 3:  Do you have noticed the takeover event of Steemit. Inc by Tron on February 14, 2020 and its following up events? Details about this takeover event can be found at https://cryptobriefing.com/steemit-migrate-tron-blockchain-year/ </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 4 }, "No": { value: 0, next: 32 } }
//   },
//   {
//     id: 4,
//     stem: <>Question 4: When did you learn about the takeover event of Steemit, Inc. by Tron on February 14, 2020? (Multiple choice) </>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: {
//       "A.	Immediately after the announcement of takeover after February 14, 2020.": { value: 1, next: 5 },
//       "B.	Within a week after February 14, 2020": { value: 2, next: 5 }, "C.	Within two weeks after February 14, 2020": { value: 3, next: 5 },
//       "D.	Within three weeks after February 14, 2020": { value: 4, next: 5 }, "E.	None of those options (end of the survey)": { value: 5, next: 31 }
//     }
//   },
//   {
//     id: 5,
//     stem: <>Question 5: Through which channel you have learned about the takeover event of Steemit. Inc by Tron on February 14, 2020? (Multiple choice) </>,
//     type: QuestionType.Multiple,
//     options: {
//       "A.	Online news platforms (e.g., CoinDesk)": { value: 1, next: 6 },
//       "B.	Discussion (e.g., articles or comments) within the Steem community or with other Steem members (e.g., articles posted by other users or discussion in Discord group)": { value: 2, next: 6 },
//       "C.	Others": {
//         value: 3,
//         next: 6,
//         addition: { id: 5.1, type: QuestionType.Textarea },
//       }
//     },
//     next: 6
//   },
//   {
//     id: 6,
//     stem: <>Question 6: How long have you been using the Steem chain by February 14, 2020? </>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: {
//       "A.	Under 3 months": { value: 1, next: 7 }, "B.	3-6 months": { value: 2, next: 7 }, "C.	6-9 months": { value: 3, next: 7 },
//       "D.	9-12 months": { value: 4, next: 7 }, "E.	Over one year": { value: 5, next: 7 }
//     }
//   },
//   {
//     id: 7,
//     stem: <>Question 7: Do you strongly identify yourself as Steemian by February 14, 2020? </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 8 }, "No": { value: 0, next: 8 } }
//   },
//   {
//     id: 8,
//     stem: <>Question 8: Have you joined the Discord group of Steem before February 14, 2020? </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 9 }, "No": { value: 0, next: 9 } }
//   },
//   {
//     id: 9,
//     stem: <>Question 9: How often do you use Steem by February 14, 2020? </>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: {
//       "A.	Once a month ": { value: 1, next: 11 }, "B.	Once a week ": { value: 2, next: 11 }, "C.	Over three times a week ": { value: 3, next: 11 },
//       "D.	Over ten times a week": { value: 4, next: 11 }
//     }
//   },
//   {
//     id: 10,
//     stem: <>Question 10: what is your Steem account name? </>,
//     type: QuestionType.Textarea,
//     textDesc: "Please input your account name here",
//     next: 11,
//   },
//   {
//     id: 11,
//     stem: <> <Heading>Part III.  Demographic Information</Heading> <Text> Question 1: Which age group do you belong to by February 14, 2020? </Text> </>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: {
//       "A.	Under 15 years old": { value: 1, next: 12 },
//       "B.	15 to 30 years old": { value: 2, next: 12 },
//       "C.	30 to 45 years old": { value: 3, next: 12 },
//       "D.	45 to 60 years old": { value: 4, next: 12 },
//       "E.	60 years old and above": { value: 4, next: 12 }
//     }
//   },
//   {
//     id: 12,
//     stem: <>Question 2: What is your gender?</>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: { "A.	Male": { value: 1, next: 13 }, "B.	Female": { value: 0, next: 13 } }
//   },
//   {
//     id: 13,
//     stem: <>Question 3: Which income group do you belong to by February 14, 2020?</>,
//     type: QuestionType.Single,
//     textDesc: "Pick one",
//     options: {
//       "A. Less than $9,999": { value: 1, next: 14 },
//       "B. $10,000 - $19,999": { value: 2, next: 14 },
//       "C. $20,000 - $49,999": { value: 3, next: 14 },
//       "D. $50,000 - $99,999": { value: 4, next: 14 },
//       "E. $100,000 - $149,999": { value: 5, next: 14 },
//       "F. More than $150,000": { value: 6, next: 14 },
//       "G. Don’t know": { value: 7, next: 14 },
//       "H. Chose not to answer": { value: 8, next: 14 }
//     }
//   },
//   {
//     id: 14,
//     stem: <>Question 4: Have you used applications based on other blockchains (e.g., Tron, Ethereum) </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 15 }, "No": { value: 0, next: 15 } }
//   },
//   {
//     id: 15,
//     stem: <>Question 5: Have you ever traded other cryptocurrencies by February 14, 2020? (e.g., Bitcoin, Ethereum) </>,
//     type: QuestionType.Single,
//     textDesc: "Yes or No",
//     options: { "Yes": { value: 1, next: 16 }, "No": { value: 0, next: 16 } }
//   },
//   {
//     id: 16,
//     stem: <>Question 7: How much you agree with the following statement (1 = “fully disagree”, 7 = “fully agree”): “I find it more satisfying to spend money than to save it for the long term” </>,
//     type: QuestionType.Slider,
//     range: [1, 7], next: 17
//   },
//   {
//     id: 17,
//     stem: <>Question 8: How much you agree with the following statement (1 = “fully disagree”, 7 = “fully agree”): “. I set long term financial goals and strive to achieve them</>,
//     type: QuestionType.Slider,
//     range: [1, 7], next: 18
//   },
//   {
//     id: 18,
//     stem: "Part IV. Event-related Information <br /> Question 1: Rate the appropriateness of Tron’s takeover event on February 14, 2020: (1 = “Fully appropriate”, 4 = “No opinion”, 7 = “Fully inappropriate”)",
//     type: QuestionType.Slider,
//     range: [1, 7], next: 19
//   },
//   {
//     id: 19,
//     stem: <>Question 2.	To what extent do you agree with the opinion that Tron’s takeover on February 14, 2020 has violated some implicit community rules or standards? (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
//     type: QuestionType.Slider,
//     range: [1, 7], next: 20
//   },
//   {
//     id: 20,
//     type: QuestionType.Compound,
//     stem: <>Question 3:  Based on the scenario described above, please rate the appropriateness of actions that you think one should do before the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 20.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 20.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 20.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 20.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 20.5, type: QuestionType.Slider, range: [1, 7] }
//     },
//     next: 21
//   },
//   {
//     id: 21,
//     type: QuestionType.Compound,
//     stem: <>Question 4.	Based on the scenario described above, please rate the appropriateness of actions that you think one should do after the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 21.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 21.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 21.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 21.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 21.5, type: QuestionType.Slider, range: [1, 7] }
//     }, next: 22
//   },
//   {
//     id: 22,
//     type: QuestionType.Compound,
//     stem: <>Question 5.	Based on the scenario described above, please rate the appropriateness of actions that you think others believes should be done before the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 22.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 22.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 22.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 22.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 22.5, type: QuestionType.Slider, range: [1, 7] }
//     },
//     next: 23
//   },
//   {
//     id: 23,
//     type: QuestionType.Compound,
//     stem: <>Question 6.	Based on the scenario described above, please rate the appropriateness of actions that you think others believes should be done after the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 23.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 23.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 23.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 23.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 23.5, type: QuestionType.Slider, range: [1, 7] }
//     },
//     next: 24
//   },
//   {
//     id: 24,
//     type: QuestionType.Compound,
//     stem: <>Question 7.	Based on the scenario described above, please mark on the slider what you think others were doing before the takeover event on February 14, 2020. </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 24.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 24.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 24.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 24.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 24.5, type: QuestionType.Slider, range: [1, 7] }
//     },
//     next: 25
//   },

//   {
//     id: 25,
//     type: QuestionType.Compound,
//     stem: <>Question 8.	Based on the scenario described above, please mark on the slider what you think others were doing after the takeover event on February 14, 2020. </>,
//     compound: {
//       "A. Contribute high-quality content": { id: 25.1, type: QuestionType.Slider, range: [1, 7] },
//       "B. Power up STEEM to Steem Power": { id: 25.2, type: QuestionType.Slider, range: [1, 7] },
//       "C. Make good comments": { id: 25.3, type: QuestionType.Slider, range: [1, 7] },
//       "D. Power down Steem Power to STEEM": { id: 25.4, type: QuestionType.Slider, range: [1, 7] },
//       "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 25.5, type: QuestionType.Slider, range: [1, 7] }
//     },
//     next: 27
//   },
//   {
//     id: 26, // placeholder
//     type: QuestionType.Textarea,
//     stem: <></>,
//     next: 27,
//   },
//   {
//     id: 27,
//     stem: <>Question 9.	Do you expect STEEM price increase or decrease over the long term after the takeover event on February 14, 2020? </>,
//     textDesc: "Pick one",
//     type: QuestionType.Single,
//     options: { "Increase": { value: 1, next: 29 }, "Decrease": { value: 0, next: 28 } }
//   },
//   {
//     id: 28,
//     stem: <>Question 10.	To what extent do you agree with the following sentence before the takeover event on February 14, 2020: “All other members in Steem are collectively working towards the betterment of the community as a whole. </>,
//     type: QuestionType.Slider,
//     range: [1, 7], next: 29
//   },
//   {
//     id: 29,
//     stem: <>Question 11.	To what extent do you agree with the following sentence after the takeover event on February 14, 2020: “All other members in Steem are collectively working towards the betterment of the community as a whole.” (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
//     type: QuestionType.Slider,
//     range: [1, 7],
//     next: 30,
//   },
//   {
//     id: 30,
//     stem: <>Question 12.	To what extent do you agree with the following sentence: “Ensuring consensus among community members plays a crucial role in fostering the growth and success of the community.”  (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
//     type: QuestionType.Slider,
//     range: [1, 7],
//     next: 31
//   },
//   {
//     id: 31,
//     stem: <>Thank you for your participation! There will be a coin reward for you after your submit</>,
//     type: QuestionType.Single,
//     options: {
//       "HIVE": { value: 0, next: 33 },
//       "Steamit": { value: 1, next: 33 }
//     }
//   },
//   {
//     id: 32,
//     stem: <>Thank you for your participation! But sorry there is no coin reward for you</>,
//     type: QuestionType.Ending,
//     reward: false
//   },
//   {
//     id: 33,
//     stem: <>Thank you for your participation! There will be a coin reward for you after your submit</>,
//     type: QuestionType.Ending,
//     reward: true
//   },
// ]

export const survey: Survey = {
  questions: [
    {
      type: 'single_choice',
      text: 'Are you a user registered on the Steem blockchain on or before February 14, 2020?',
      answers: [
        { text: 'Yes', goto: 1 },
        { text: 'No (If \'No\', this marks the end of the survey.)', goto: -1 }
      ]
    },
    {
      type: 'single_choice',
      text: 'Between February 14, 2020, when Tron\'s takeover of Steemit, Inc. was announced, and March 20, 2020, when the community initiated the hard fork, did you remain active in the Steem community by engaging in at least one of the following activities: posting articles, making comments, powering up/down, or voting?',
      answers: [
        { text: 'Yes', goto: 2 },
        { text: 'No (If \'No\', this marks the end of the survey.)', goto: -1 }
      ]
    },
    {
      type: 'single_choice',
      text: 'On February 14, 2020, Tron\'s takeover of Steemit, Inc. was announced. This takeover has a substantial impact on the Steem community. Before proceeding, you may learn more about this event at https://cryptobriefing.com/steemit-migrate-tron-blockchain-year/ Were you aware of this takeover event and its subsequent developments before the hard fork on March 20, 2020?',
      answers: [
        { text: 'Yes', goto: 3 },
        { text: 'No (If \'No\', this marks the end of the survey.)', goto: -1 }
      ]
    },
    {
      type: 'text',
      text: 'What is your Steem account name?',
      answers: [
        { text: '', goto: 4 }
      ]
    },
    {
      type: 'rating',
      text: 'Please rate the appropriateness of Tron\'s takeover on February 14, 2020, based on your opinion.',
      range: [1, 5],
      answers: [
        { text: '1 = Completely appropriate', goto: 5 },
        { text: '2 = Appropriate', goto: 5 },
        { text: '3 = Neutral', goto: 5 },
        { text: '4 = Inappropriate', goto: 5 },
        { text: '5 = Completely inappropriate', goto: 5 }
      ]
    },
    {
      type: 'rating',
      text: 'To what extent do you agree with the opinion that Tron\'s takeover on February 14, 2020, violated certain implicit community rules or standards in Steem?',
      range: [1, 5],
      answers: [
        { text: '1 = Fully agree', goto: 6 },
        { text: '2 = Agree', goto: 6 },
        { text: '3 = Neutral', goto: 6 },
        { text: '4 = Disagree', goto: 6 },
        { text: '5 = Fully disagree', goto: 6 }
      ]
    },
    {
      type: 'text',
      text: 'How many individuals do you believe would agree with the viewpoint that Tron\'s takeover was inappropriate and might have breached certain implicit community rules or standards? Please provide an estimate of the number of people out of 100:',
      answers: [
        { text: '', goto: 7 }
      ]
    },
    {
      type: 'multiple_choice',
      text: 'Cooperative behaviors contribute to the growth and success of the Steem community, which can benefit all Steem members. Which of the following behaviors do you believe is a cooperative behavior? (Please select all that apply.)',
      answers: [
        { text: 'A. Posting high-quality content (e.g., articles)', goto: 8 },
        { text: 'B. Making good and constructive comments on others’ articles', goto: 8 },
        { text: 'C. Purchasing votes from bots or other members to upvote their content and thereby earn tokens', goto: 8 }
      ]
    },
    {
      type: 'multiple_choice',
      text: 'Opportunistic behaviors impede the growth and success of the Steem community, which may also undermine other Steem members’ interests. Which of the following behaviors do you believe is an opportunistic behavior? (Please select all that apply.)',
      answers: [
        { text: 'A. Posting high-quality content (e.g., articles)', goto: 9 },
        { text: 'B. Making good and constructive comments on others’ articles', goto: 9 },
        { text: 'C. Purchasing votes from bots or other members to upvote their content and thereby earn tokens', goto: 9 }
      ]
    },
    {
      type: 'text', // 9
      text: '(1) "Cooperative behaviors contribute to the growth and success of the Steem community, which can benefit all Steem members. Thus, Steem members should engage in cooperative behaviors." Please provide an estimate of the number of people out of 100 who you think would AGREE with this statement before Tron\'s takeover:',
      answers: [
        { text: '', goto: 10 }
      ]
    },
    {
      type: 'text',
      text: '(1) "Cooperative behaviors contribute to the growth and success of the Steem community, which can benefit all Steem members. Thus, Steem members should engage in cooperative behaviors." Please provide an estimate of the number of people out of 100 who you think would AGREE with this statement after Tron\'s takeover:',
      answers: [
        { text: '', goto: 11 }
      ]
    },
    {
      type: 'text',
      text: '(2) "Opportunistic behaviors impede the growth and success of the Steem community, which may also undermine other Steem members’ interests. Thus, Steem members should NOT engage in opportunistic behaviors." Please provide an estimate of the number of people out of 100 who you think would AGREE with this statement before Tron\'s takeover:',
      answers: [
        { text: '', goto: 12 }
      ]
    },
    {
      type: 'text',
      text: '(2) "Opportunistic behaviors impede the growth and success of the Steem community, which may also undermine other Steem members’ interests. Thus, Steem members should NOT engage in opportunistic behaviors." Please provide an estimate of the number of people out of 100 who you think would AGREE with this statement after Tron\'s takeover:',
      answers: [
        { text: '', goto: 13 }
      ]
    },
    {
      type: 'text',
      text: '(1) How many members you believe are engaging in cooperative behaviors that contribute to the growth and success of the Steem community and benefit all Steem members. Please provide an estimate of the number of people out of 100 before Tron\'s takeover:',
      answers: [
        { text: '', goto: 14 }
      ]
    },
    {
      type: 'text',
      text: '(1) How many members you believe are engaging in cooperative behaviors that contribute to the growth and success of the Steem community and benefit all Steem members. Please provide an estimate of the number of people out of 100 after Tron\'s takeover:',
      answers: [
        { text: '', goto: 15 }
      ]
    },
    {
      type: 'text',
      text: '(2) How many members you believe are engaging in opportunistic behaviors that impede the growth and success of the Steem community and undermine other Steem members’ interests. Please provide an estimate of the number of people out of 100 before Tron\'s takeover:',
      answers: [
        { text: '', goto: 16 }
      ]
    },
    {
      type: 'text',
      text: '(2) How many members you believe are engaging in opportunistic behaviors that impede the growth and success of the Steem community and undermine other Steem members’ interests. Please provide an estimate of the number of people out of 100 after Tron\'s takeover:',
      answers: [
        { text: '', goto: 17 }
      ]
    },
    {
      type: 'single_choice',
      text: 'Considering that cooperation is defined as contributing to the growth and success of the Steem community while avoiding undermining other Steem members’ interests. Have you observed decreased cooperation among Steem members following Tron\'s takeover?',
      answers: [
        { text: 'Yes', goto: 18 },
        { text: 'No', goto: 19 }
      ]
    },
    {
      type: 'multiple_choice', // 18
      text: 'You answered yes to decreased cooperation. What do you believe are the primary reasons for this decrease? (Select all that apply)',
      answers: [
        { text: 'A. This takeover led to increased disagreement and conflicts among Steem members', goto: 19 },
        { text: 'B. A perception that, for some Steem members, individual financial gains have become prioritized over contributing to the community', goto: 19 },
        { text: 'C. A rise in unpredictable behaviors from other members, generating a sense of uncertainty', goto: 19 },
        { text: 'D. A sense of disappointment stemming from the lack of mechanisms to punish individuals who were violating community rules and agreements', goto: 19 },
        { text: 'E. Other (please specify): ', input: true, goto: 19 }
      ]
    },
    {
      type: 'single_choice', // 19
      text: 'Have you ever bought votes from others or from bots to increase the upvotes on your articles in order to earn token rewards?',
      answers: [
        { text: 'Yes', goto: 20 },
        { text: 'No', goto: 21 }
      ]
    },
    {
      type: 'rating', // 20
      text: 'How do you expect the value of STEEM over the next 5 years just after Tron\'s takeover?',
      range: [1, 5],
      answers: [
        { text: '1 = Very Pessimistic (I believe STEEM will significantly decrease in value)', goto: 23 },
        { text: '2 = Pessimistic (I believe STEEM will decrease in value)', goto: 23 },
        { text: '3 = Neutral (I am unsure about the future value of STEEM)', goto: 23 },
        { text: '4 = Optimistic (I believe STEEM will increase in value)', goto: 23 },
        { text: '5 = Very Optimistic (I believe STEEM will significantly increase in value)', goto: 23 }
      ]
    },
    {
      type: 'multiple_choice', // 21
      text: 'If you have NOT purchased votes from others, please select the most applicable reason below:',
      answers: [
        { text: 'A. You were unaware of the opportunity for vote purchasing/You are unsure where to purchase votes.', goto: 22 },
        { text: 'B. You believe that vote purchasing would have a detrimental impact on the Steem community.', goto: 22 },
        { text: 'C. You consider vote purchasing to earn token rewards a form of “cheating.”', goto: 22 },
        { text: 'D. You are concerned that your friends within the Steem community might become aware of your actions if you were to purchase votes.', goto: 24 },
        { text: 'E. Other (please specify): ', input: true, goto: 22 }
      ]
    },
    {
      type: 'single_choice', // 22
      text: '(1) Consider a scenario where 90% of the Steem community members are actively participating cooperative behaviors that contribute to the growth and success of the Steem community and benefit all Steem members. In this context, would you be inclined to engage in cooperative behaviors as well? Yes/No',
      answers: [
        { text: 'Yes', goto: 23 },
        { text: 'No', goto: 23 }
      ]
    },
    {
      type: 'single_choice', // 23
      text: '(2) Now, envision a different scenario where only 10% of the Steem community members are actively participating cooperative behaviors that contribute to the growth and success of the Steem community and benefit all Steem members. In this context, would you be inclined to engage in cooperative behaviors as well? Yes/No',
      answers: [
        { text: 'Yes', goto: 24 },
        { text: 'No', goto: 24 }
      ]
    }
  ]
}