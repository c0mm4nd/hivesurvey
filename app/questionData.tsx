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

export const initialQuestions: Question[] = [
  {
    id: 0,
    stem: <><Heading>Part I. INTRODUCTION</Heading> <Text>You are invited to participate in a research study conducted by Sichen Dong in the Faculty of Business and Economics at the University of Hong Kong. This is a study on the social DAO Steem chain, aiming to explore the impact of social norms on cooperative behavior within DAOs. <br /> You are required to complete a questionnaire regarding the social experiential changes you have perceived after the takeover of Steemit. Inc by Tron on February 14, 2020. The questionnaire will take approximately 15-20 minutes. There are no risks to participate in this study, beyond the risks associated with normal everyday activity. You are free to withdraw from participation at any point during the study, without providing any reason. However, any information you contribute up to the point at which you choose to withdraw will be retained and may be used in the study unless you request otherwise. <br /> If you complete the entire questionnaire, you will receive a cash reward of $20. Participation in the study is voluntary and confidential. Your data will be anonymized. If it is ever shared with anyone outside of the research team, including in any written publications or oral presentations based on this research, you will be identified only by a participant number (e.g., P12) or a pseudonym. The results of this questionnaire will be retained for a period of three years after the first publication of the study. All collected data will be password protected. <br /> If you have any questions about the research, please feel free to contact Ms. Sichen Dong (u3007640@connect.hku.hk). This study will also be supervised by Professor Michael Chau. If you have questions about your rights as a research participant, contact the Human Research Ethics Committee, HKU (2241-5267). The HREC Reference Number for this research is EA230329.</Text></>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: {
      "Yes": { value: 1, next: 1 },
      "No": { value: 0, next: 32 }
    }
  },
  {
    id: 1,
    stem: <><Heading>Part II. Background Information</Heading><Text>Question 1: Are you a user in Steem chain registered before February 14?</Text></>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 2 }, "No": { value: 0, next: 32 } }
  },
  {
    id: 2,
    stem: <>Question 2: Are you remains active in the community during Feb.14 to Mar. 20? (which means you have posted articles, making comments, power up/down, or votes for at least once during this period of time) </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 3 }, "No": { value: 0, next: 32 } }
  },
  {
    id: 3,
    stem: <>Question 3:  Do you have noticed the takeover event of Steemit. Inc by Tron on February 14, 2020 and its following up events? Details about this takeover event can be found at https://cryptobriefing.com/steemit-migrate-tron-blockchain-year/ </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 4 }, "No": { value: 0, next: 32 } }
  },
  {
    id: 4,
    stem: <>Question 4: When did you learn about the takeover event of Steemit, Inc. by Tron on February 14, 2020? (Multiple choice) </>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: {
      "A.	Immediately after the announcement of takeover after February 14, 2020.": { value: 1, next: 5 },
      "B.	Within a week after February 14, 2020": { value: 2, next: 5 }, "C.	Within two weeks after February 14, 2020": { value: 3, next: 5 },
      "D.	Within three weeks after February 14, 2020": { value: 4, next: 5 }, "E.	None of those options (end of the survey)": { value: 5, next: 31 }
    }
  },
  {
    id: 5,
    stem: <>Question 5: Through which channel you have learned about the takeover event of Steemit. Inc by Tron on February 14, 2020? (Multiple choice) </>,
    type: QuestionType.Multiple,
    options: {
      "A.	Online news platforms (e.g., CoinDesk)": { value: 1, next: 6 },
      "B.	Discussion (e.g., articles or comments) within the Steem community or with other Steem members (e.g., articles posted by other users or discussion in Discord group)": { value: 2, next: 6 },
      "C.	Others": {
        value: 3,
        next: 6,
        addition: { id: 5.1, type: QuestionType.Textarea },
      }
    },
    next: 6
  },
  {
    id: 6,
    stem: <>Question 6: How long have you been using the Steem chain by February 14, 2020? </>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: {
      "A.	Under 3 months": { value: 1, next: 7 }, "B.	3-6 months": { value: 2, next: 7 }, "C.	6-9 months": { value: 3, next: 7 },
      "D.	9-12 months": { value: 4, next: 7 }, "E.	Over one year": { value: 5, next: 7 }
    }
  },
  {
    id: 7,
    stem: <>Question 7: Do you strongly identify yourself as Steemian by February 14, 2020? </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 8 }, "No": { value: 0, next: 8 } }
  },
  {
    id: 8,
    stem: <>Question 8: Have you joined the Discord group of Steem before February 14, 2020? </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 9 }, "No": { value: 0, next: 9 } }
  },
  {
    id: 9,
    stem: <>Question 9: How often do you use Steem by February 14, 2020? </>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: {
      "A.	Once a month ": { value: 1, next: 11 }, "B.	Once a week ": { value: 2, next: 11 }, "C.	Over three times a week ": { value: 3, next: 11 },
      "D.	Over ten times a week": { value: 4, next: 11 }
    }
  },
  {
    id: 10,
    stem: <>Question 10: what is your Steem account name? </>,
    type: QuestionType.Textarea,
    textDesc: "Please input your account name here",
    next: 11,
  },
  {
    id: 11,
    stem: <> <Heading>Part III.  Demographic Information</Heading> <Text> Question 1: Which age group do you belong to by February 14, 2020? </Text> </>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: {
      "A.	Under 15 years old": { value: 1, next: 12 },
      "B.	15 to 30 years old": { value: 2, next: 12 },
      "C.	30 to 45 years old": { value: 3, next: 12 },
      "D.	45 to 60 years old": { value: 4, next: 12 },
      "E.	60 years old and above": { value: 4, next: 12 }
    }
  },
  {
    id: 12,
    stem: <>Question 2: What is your gender?</>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: { "A.	Male": { value: 1, next: 13 }, "B.	Female": { value: 0, next: 13 } }
  },
  {
    id: 13,
    stem: <>Question 3: Which income group do you belong to by February 14, 2020?</>,
    type: QuestionType.Single,
    textDesc: "Pick one",
    options: {
      "A. Less than $9,999": { value: 1, next: 14 },
      "B. $10,000 - $19,999": { value: 2, next: 14 },
      "C. $20,000 - $49,999": { value: 3, next: 14 },
      "D. $50,000 - $99,999": { value: 4, next: 14 },
      "E. $100,000 - $149,999": { value: 5, next: 14 },
      "F. More than $150,000": { value: 6, next: 14 },
      "G. Don’t know": { value: 7, next: 14 },
      "H. Chose not to answer": { value: 8, next: 14 }
    }
  },
  {
    id: 14,
    stem: <>Question 4: Have you used applications based on other blockchains (e.g., Tron, Ethereum) </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 15 }, "No": { value: 0, next: 15 } }
  },
  {
    id: 15,
    stem: <>Question 5: Have you ever traded other cryptocurrencies by February 14, 2020? (e.g., Bitcoin, Ethereum) </>,
    type: QuestionType.Single,
    textDesc: "Yes or No",
    options: { "Yes": { value: 1, next: 16 }, "No": { value: 0, next: 16 } }
  },
  {
    id: 16,
    stem: <>Question 7: How much you agree with the following statement (1 = “fully disagree”, 7 = “fully agree”): “I find it more satisfying to spend money than to save it for the long term” </>,
    type: QuestionType.Slider,
    range: [1, 7], next: 17
  },
  {
    id: 17,
    stem: <>Question 8: How much you agree with the following statement (1 = “fully disagree”, 7 = “fully agree”): “. I set long term financial goals and strive to achieve them</>,
    type: QuestionType.Slider,
    range: [1, 7], next: 18
  },
  {
    id: 18,
    stem: "Part IV. Event-related Information <br /> Question 1: Rate the appropriateness of Tron’s takeover event on February 14, 2020: (1 = “Fully appropriate”, 4 = “No opinion”, 7 = “Fully inappropriate”)",
    type: QuestionType.Slider,
    range: [1, 7], next: 19
  },
  {
    id: 19,
    stem: <>Question 2.	To what extent do you agree with the opinion that Tron’s takeover on February 14, 2020 has violated some implicit community rules or standards? (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
    type: QuestionType.Slider,
    range: [1, 7], next: 20
  },
  {
    id: 20,
    type: QuestionType.Compound,
    stem: <>Question 3:  Based on the scenario described above, please rate the appropriateness of actions that you think one should do before the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
    compound: {
      "A. Contribute high-quality content": { id: 20.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 20.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 20.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 20.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 20.5, type: QuestionType.Slider, range: [1, 7] }
    },
    next: 21
  },
  {
    id: 21,
    type: QuestionType.Compound,
    stem: <>Question 4.	Based on the scenario described above, please rate the appropriateness of actions that you think one should do after the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
    compound: {
      "A. Contribute high-quality content": { id: 21.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 21.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 21.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 21.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 21.5, type: QuestionType.Slider, range: [1, 7] }
    }, next: 22
  },
  {
    id: 22,
    type: QuestionType.Compound,
    stem: <>Question 5.	Based on the scenario described above, please rate the appropriateness of actions that you think others believes should be done before the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
    compound: {
      "A. Contribute high-quality content": { id: 22.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 22.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 22.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 22.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 22.5, type: QuestionType.Slider, range: [1, 7] }
    },
    next: 23
  },
  {
    id: 23,
    type: QuestionType.Compound,
    stem: <>Question 6.	Based on the scenario described above, please rate the appropriateness of actions that you think others believes should be done after the takeover event on February 14, 2020 for the benefit of the Steem chain: </>,
    compound: {
      "A. Contribute high-quality content": { id: 23.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 23.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 23.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 23.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 23.5, type: QuestionType.Slider, range: [1, 7] }
    },
    next: 24
  },
  {
    id: 24,
    type: QuestionType.Compound,
    stem: <>Question 7.	Based on the scenario described above, please mark on the slider what you think others were doing before the takeover event on February 14, 2020. </>,
    compound: {
      "A. Contribute high-quality content": { id: 24.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 24.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 24.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 24.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 24.5, type: QuestionType.Slider, range: [1, 7] }
    },
    next: 25
  },

  {
    id: 25,
    type: QuestionType.Compound,
    stem: <>Question 8.	Based on the scenario described above, please mark on the slider what you think others were doing after the takeover event on February 14, 2020. </>,
    compound: {
      "A. Contribute high-quality content": { id: 25.1, type: QuestionType.Slider, range: [1, 7] },
      "B. Power up STEEM to Steem Power": { id: 25.2, type: QuestionType.Slider, range: [1, 7] },
      "C. Make good comments": { id: 25.3, type: QuestionType.Slider, range: [1, 7] },
      "D. Power down Steem Power to STEEM": { id: 25.4, type: QuestionType.Slider, range: [1, 7] },
      "E. Purchasing votes from bots or others to upvote your content and earn tokens": { id: 25.5, type: QuestionType.Slider, range: [1, 7] }
    },
    next: 27
  },
  {
    id: 26, // placeholder
    type: QuestionType.Textarea,
    stem: <></>,
    next: 27,
  },
  {
    id: 27,
    stem: <>Question 9.	Do you expect STEEM price increase or decrease over the long term after the takeover event on February 14, 2020? </>,
    textDesc: "Pick one",
    type: QuestionType.Single,
    options: { "Increase": { value: 1, next: 29 }, "Decrease": { value: 0, next: 28 } }
  },
  {
    id: 28,
    stem: <>Question 10.	To what extent do you agree with the following sentence before the takeover event on February 14, 2020: “All other members in Steem are collectively working towards the betterment of the community as a whole. </>,
    type: QuestionType.Slider,
    range: [1, 7], next: 29
  },
  {
    id: 29,
    stem: <>Question 11.	To what extent do you agree with the following sentence after the takeover event on February 14, 2020: “All other members in Steem are collectively working towards the betterment of the community as a whole.” (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
    type: QuestionType.Slider,
    range: [1, 7],
    next: 30,
  },
  {
    id: 30,
    stem: <>Question 12.	To what extent do you agree with the following sentence: “Ensuring consensus among community members plays a crucial role in fostering the growth and success of the community.”  (1 = “Fully agree”, 4 = “No opinion”, 7 = “Fully disagree”) </>,
    type: QuestionType.Slider,
    range: [1, 7],
    next: 31
  },
  {
    id: 31,
    stem: <>Thank you for your participation! There will be a coin reward for you after your submit</>,
    type: QuestionType.Single,
    options: {
      "HIVE": { value: 0, next: 33 },
      "Steamit": { value: 1, next: 33 }
    }
  },
  {
    id: 32,
    stem: <>Thank you for your participation! But sorry there is no coin reward for you</>,
    type: QuestionType.Ending,
    reward: false
  },
  {
    id: 33,
    stem: <>Thank you for your participation! There will be a coin reward for you after your submit</>,
    type: QuestionType.Ending,
    reward: true
  },
]
