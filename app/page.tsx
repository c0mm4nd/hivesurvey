"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Form from "./form";
import Topbar, { TopbarHandler } from "./topbar";
import { useRef } from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const topbarRef = useRef<TopbarHandler>(null)

  return (
    <>
      <Topbar ref={topbarRef}></Topbar>
      <Form></Form>
      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Introduction</ModalHeader>

          <ModalBody>
            We are inviting current Steem/Hive members who{" "}
            <b>
              1) registered before February 14, 2020; 2) engaged in at least one
              of the following activities from February 14 to March 20: posting
              articles, making comments, powering up/down, or voting; and 3)
              were conscious of the takeover event involving Steemit, Inc. by
              Tron on February 14, 2020.
            </b>{" "}
            <span style={{ color: "red" }}>
              (Please withdraw from the questionnaire if you do not meet the
              above three criteria)
            </span>
            . This invitation is to participate in a research study by Sichen
            Dong from the Faculty of Business and Economics at the University of
            Hong Kong.
            <br />
            The study centers around Steem community and seeks to delve into the
            influence of social norms on cooperative behavior within
            decentralized autonomous organizations (DAOs). If you complete all
            questions in this questionnaire,{" "}
            <b>
              {" "}
              you will be entitled to a token reward in an equivalent amount of
              $1, which will be provided in either Hive or Steem
            </b>
            . It will take about XX minutes to complete this questionnaire.
            Kindly be informed that only eligible members who successfully
            complete all questions will be eligible for the rewards. Individuals
            who do not meet the pre-defined eligibility criteria will not be
            granted awards, even if they successfully complete the
            questionnaire.
            <br />
            This questionnaire is written in ENGLISH. You are required to
            complete a questionnaire regarding the social experiential changes
            you have perceived after the takeover of Steemit. Inc by Tron on
            February 14, 2020. There are no risks to participating in this study
            beyond the risks associated with normal everyday activity. You are
            free to withdraw from participation at any point during the study
            without providing any reason. However, any information you
            contribute up to the point you withdraw will be retained and may be
            used in the study unless you request otherwise.
            <br />
            Participation in the study is voluntary and confidential. Your data
            will be anonymized. Suppose it is ever shared with anyone outside
            the research team, including in any written publications or oral
            presentations based on this research. In that case, you will be
            identified only by a participant number (e.g., P12) or a pseudonym.
            The results of this questionnaire will be retained for three years
            after the first publication of the study. All collected data will be
            password-protected.
            <br />
            If you have any questions about the research, please feel free to
            contact <a href="mailto:u3007640@connect.hku.hk">Ms. Sichen Dong</a>
            . This study will also be supervised by Professor{" "}
            <a href="mailto:mchau@business.hku.hk">Michael Chau</a>. If you have
            questions about your rights as a research participant, contact the
            Human Research Ethics Committee, HKU (2241-5267). The HREC Reference
            Number for this research is EA230329.
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={(e) => {
                window.close();
              }}
            >
              Disagree and exit
            </Button>
            <Button colorScheme="blue" mr={3} onClick={()=>{
              onClose()
              // topbarRef.current?.onOpenLogin()
            }}>
              I understand and agree to participate in this online survey
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
