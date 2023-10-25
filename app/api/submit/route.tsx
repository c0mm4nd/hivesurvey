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

async function getActiveKeyByAccountName(name: string) {
  const res = await call("condenser_api.get_accounts", [[name]]);
  //   {
  //     id: 2462951,
  //     name: 'steemgrave',
  //     owner: [Object],
  //     active: [Object],
  //     posting: [Object],
  //     memo_key: 'STM8VVehcYw3ZeYPqsQkNWmYamezijU3B19j6cH1cFkBZsESCMf72',
  //     json_metadata: '',
  //     posting_json_metadata: '',
  //     proxy: '',
  //     previous_owner_update: '1970-01-01T00:00:00',
  //     last_owner_update: '1970-01-01T00:00:00',
  //     last_account_update: '1970-01-01T00:00:00',
  //     created: '2023-07-15T14:00:36',
  //     mined: false,
  //     recovery_account: 'hive-recovery',
  //     last_account_recovery: '1970-01-01T00:00:00',
  //     reset_account: 'null',
  //     comment_count: 0,
  //     lifetime_vote_count: 0,
  //     post_count: 0,
  //     can_vote: true,
  //     voting_manabar: [Object],
  //     downvote_manabar: [Object],
  //     voting_power: 0,
  //     balance: '0.003 HIVE',
  //     savings_balance: '0.000 HIVE',
  //     hbd_balance: '0.000 HBD',
  //     hbd_seconds: '0',
  //     hbd_seconds_last_update: '1970-01-01T00:00:00',
  //     hbd_last_interest_payment: '1970-01-01T00:00:00',
  //     savings_hbd_balance: '0.000 HBD',
  //     savings_hbd_seconds: '0',
  //     savings_hbd_seconds_last_update: '1970-01-01T00:00:00',
  //     savings_hbd_last_interest_payment: '1970-01-01T00:00:00',
  //     savings_withdraw_requests: 0,
  //     reward_hbd_balance: '0.000 HBD',
  //     reward_hive_balance: '0.000 HIVE',
  //     reward_vesting_balance: '0.000000 VESTS',
  //     reward_vesting_hive: '0.000 HIVE',
  //     vesting_shares: '0.000000 VESTS',
  //     delegated_vesting_shares: '0.000000 VESTS',
  //     received_vesting_shares: '0.000000 VESTS',
  //     vesting_withdraw_rate: '0.000000 VESTS',
  //     post_voting_power: '0.000000 VESTS',
  //     next_vesting_withdrawal: '1969-12-31T23:59:59',
  //     withdrawn: 0,
  //     to_withdraw: 0,
  //     withdraw_routes: 0,
  //     pending_transfers: 0,
  //     curation_rewards: 0,
  //     posting_rewards: 0,
  //     proxied_vsf_votes: [Array],
  //     witnesses_voted_for: 0,
  //     last_post: '1970-01-01T00:00:00',
  //     last_root_post: '1970-01-01T00:00:00',
  //     last_vote_time: '1970-01-01T00:00:00',
  //     post_bandwidth: 0,
  //     pending_claimed_accounts: 0,
  //     governance_vote_expiration_ts: '1969-12-31T23:59:59',
  //     delayed_votes: [],
  //     open_recurrent_transfers: 0,
  //     vesting_balance: '0.000 HIVE',
  //     reputation: 0,
  //     transfer_history: [],
  //     market_history: [],
  //     post_history: [],
  //     vote_history: [],
  //     other_history: [],
  //     witness_votes: [],
  //     tags_usage: [],
  //     guest_bloggers: []
  //   }
  // ],
  // id: 1
  // }

  // console.log('Get accounts:', res, )
  return res.result[0]["active"]["key_auths"][0][0];
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

  const activePubKeyFromNode = await getActiveKeyByAccountName(name);
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

  await kv.set(name, { time: Date.now(), data: data });

  if (network == "hive") {
    console.log("sending hive")
    const res = await sendHIVEReward(name);
    console.log("result", res)
    return NextResponse.json({ result: { txid: res.txId } });
  }
  if (network == "steemit") {
    console.log("sending steem")
    const res = await sendSteemitReward(name);
    console.log("result", res)
    return NextResponse.json({ result: { txid: res.txId } });
  }

  // const res = await sendHIVEReward(name)
  return NextResponse.json({ result: { txid: null } });
}
