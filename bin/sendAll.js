import {
  config,
  Transaction,
  PrivateKey,
  PublicKey,
  call,
  Signature,
} from "hive-tx";
import * as hiveTx from "hive-tx";

import "dotenv/config";

console.log(process.env.HIVESURVEY_KEY, process.env.STEEMSURVEY_KEY);

const memo = `By spending just 5-10 minutes of your time to answer an ONLINE SURVEY, you'll receive $1 worth of HIVE or STEEM (4.762 STEEM or 3.125 HIVE) as a token of our appreciation!!! Hello there! I'm Sichen DONG, a research postgraduate student at the University of Hong Kong. I'm currently organizing a paid survey as part of my research study. We kindly invite Steem/Hive members to participate in a survey that focuses on the social changes you've observed since the takeover of Steemit, Inc. by Tron on February 14, 2020. We're delving into the intriguing realm of decentralized autonomous organizations (DAOs) and exploring the impact of social norms on cooperation within these communities. Please note that the survey is conducted in English. Rest assured, your participation involves no more risk than your everyday activities. You retain the freedom to withdraw from the study at any point. Your support is invaluable to our research, and we're eagerly looking forward to your participation! Ready to dive in? Access the survey via this link: https://hivesurvey.vercel.app/`;

async function sendHIVEReward(to) {
  hiveTx.config.node = "https://api.hive.blog";
  hiveTx.config.chain_id =
    "beeab0de00000000000000000000000000000000000000000000000000000000";

  const operations = [
    [
      "transfer",
      {
        from: "hivesurvey",
        to: to,
        amount: "0.001 HIVE",
        memo: memo,
      },
    ],
  ];

  const tx = new Transaction();
  await tx.create(operations);

  const privateKey = PrivateKey.from(process.env.HIVESURVEY_KEY || "");

  tx.sign(privateKey);

  try {
    for (;;) {
      const res = await tx.broadcast();
      if ("error" in res) {
        throw res["error"];
      }
      break;
    }
  } catch (e) {
    // console.error(e);
    throw e;
  }


  const digest = tx.digest();

  return digest;
}

async function sendSteemitReward(to) {
  // https://peakd.com/hf24/@droida/what-changed-in-the-transfer-rpc-request
  hiveTx.config.node = "https://api.steemit.com/";
  hiveTx.config.chain_id =
    "0000000000000000000000000000000000000000000000000000000000000000";

  const operations = [
    [
      "transfer",
      {
        from: "steemsurveyhku",
        to: to,
        amount: "0.001 STEEM",
        memo: memo,
      },
    ],
  ];

  const tx = new Transaction();
  await tx.create(operations);

  const privateKey = PrivateKey.from(process.env.STEEMSURVEY_KEY || "");

  tx.sign(privateKey);

  const res = await tx.broadcast();
  if ("error" in res) {
    throw res["error"];
  }

  const digest = tx.digest();

  return digest;
}

import targets from "./unique_items.json" assert { type: "json" };

// (async () => {
try {
  for (const target of targets) {
    console.log("start", target);
    const addr = target.unique_item;

    for (;;) {
      try {
        let result = await sendHIVEReward(addr);
        console.log(addr, result)
        await new Promise(r => setTimeout(r, 2000));
        break
      } catch (e) {
        console.error(e);
        await new Promise(r => setTimeout(r, 5000));
        continue
      }
    }

    // for (;;) {
    //   try {
    //     let result = await sendSteemitReward(addr);
    //     console.log(result)
    //     break
    //   } catch (e) {
    //     console.error(e);
    //     await new Promise(r => setTimeout(r, 2000));
    //     continue
    //   }
    // }

    console.log("done", addr);
  }
} catch (e) {
  // Deal with the fact the chain failed
  console.error(e);
}
