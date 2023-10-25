import { NextRequest, NextResponse } from "next/server";
import {
  config,
  Transaction,
  PrivateKey,
  PublicKey,
  call,
  Signature,
} from "hive-tx";
import * as hiveTx from "hive-tx";
import { kv } from "@vercel/kv";
import { sha256 } from "@noble/hashes/sha256";
import { User } from "@/app/providers";
import { time } from "console";

async function sendHIVEReward(to: string) {
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
        memo: "thanks for completing our survey",
      },
    ],
  ];

  const tx = new Transaction();
  await tx.create(operations);

  const privateKey = PrivateKey.from(process.env.HIVESURVEY_KEY || "");

  tx.sign(privateKey);

  const res = await tx.broadcast();
  if ("error" in res) {
    throw res["error"];
  }

  const digest = tx.digest();

  return digest;
}

async function sendSteemitReward(to: string) {
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
        memo: "thanks for completing our survey",
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

async function getActiveKeyByAccountName(name: string, network: string) {
  if (network == "steemit") {
    hiveTx.config.node = "https://api.steemit.com/";
    hiveTx.config.chain_id =
      "0000000000000000000000000000000000000000000000000000000000000000";
  
    const res = await call("condenser_api.get_accounts", [[name]]);
    return res.result[0]["active"]["key_auths"][0][0];
  } else {
    hiveTx.config.node = "https://api.hive.blog";
    hiveTx.config.chain_id =
      "beeab0de00000000000000000000000000000000000000000000000000000000";
  
    const res = await call("condenser_api.get_accounts", [[name]]);
    return res.result[0]["active"]["key_auths"][0][0];
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);
  const user: User = data.user;
  const name = user.name;
  const strSignature = user.signature;
  const strActivePubKey = user.active;
  const network = user.network;

  if (name == null) {
    console.error("name is null");
    return NextResponse.json({ error: "name is null" }, { status: 400 });
  }

  const activePubKeyFromNode = await getActiveKeyByAccountName(name, network);
  if (activePubKeyFromNode != strActivePubKey) {
    return NextResponse.json({
      error: `invalid account name or pubkey: ${activePubKeyFromNode} != ${strActivePubKey}`,
    });
  }

  const activePubKey = PublicKey.fromString(strActivePubKey);
  if (
    !activePubKey.verify(
      Buffer.from(sha256("hivesurvey login")),
      Signature.from(strSignature)
    )
  ) {
    return NextResponse.json({ error: "invalid signature" });
  }

  const exists = await kv.exists(name);
  if (exists) {
    return NextResponse.json({
      error: `account ${name} has already submited!`,
    });
  }

  let txId = null;
  if (network == "hive") {
    console.log("sending hive")
    const res = await sendHIVEReward(name);
    console.log("result", res)
    
    txId = res.txId
  }
  if (network == "steemit") {
    console.log("sending steem")
    const res = await sendSteemitReward(name);
    console.log("result", res)

    txId = res.txId
  }

  await kv.set(name, { time: Date.now(), data: data });

  // const res = await sendHIVEReward(name)
  if (txId) {
    return NextResponse.json({ result: { txId: txId } });
  } else {
    return NextResponse.json({ result: { txid: null } });
  }
}
