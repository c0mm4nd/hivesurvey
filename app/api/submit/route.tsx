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

const memo = `Thank you for participating in our ONLINE SURVEY! You have received your 4.762 STEEM/3.125 HIVE as a token of our appreciation!!! You may want to share details of this ONLINE SURVEY with your friends in Hive/Steem! We kindly invite Steem/Hive members to participate in a survey that focuses on the social changes you've observed since the takeover of Steemit, Inc. by Tron on February 14, 2020. We're delving into the intriguing realm of decentralized autonomous organizations (DAOs) and exploring the impact of social norms on cooperation within these communities. Your support is invaluable to our research, and we're eagerly looking forward to your participation! Ready to dive in? Access the survey via this link: https://hivesurvey.vercel.app/`;

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
        amount: "3.125 HIVE",
        memo: memo,
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
        amount: "4.762 STEEM",
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

  if (JSON.stringify(data).includes("affiliateportal")) {
    return NextResponse.json({ result: { txid: "0xABANDON" } });
  }


  if (["abacaton", "affiliateportal", "ahmedsherra", "ailegoy", "ailgoy", "alanasteemit", "alchemia", "alpha-omega", "annu", "aqeelahmed18k", "ara-hire", "arenkeman", "arras", "atombot", "atyh", "axelalanis119", "axle1992", "babynaya", "bamtx", "barbarask", "bobby95", "bolajija", "burza", "callmecrypto", "carlosega", "choin1234", "chrisluke", "cn-datui", "cogollo", "com-lab", "cryptokant", "dammylohar", "dele", "demostene", "deszcz", "detoye", "dineronline", "dragonrider", "dulaldulal", "dwas", "elity-sitio", "emma321", "emonandels", "eondas", "eowina", "ereq21", "eriador", "erode", "esan", "eveonsteemit", "falastre", "famefighter", "fawaazghost", "food-speedy", "freebornangel", "freebornsociety", "fundacja", "fundakantoria", "future-yi", "g15-14", "gallanonim", "gamersayu907", "ghie.cacal", "gondor", "graface", "grota", "guillermolugo", "gwaihir", "hakan0356", "hallmann", "haroldmateria", "helenkim", "hikari03", "hive.agents", "hobbiton", "hollaturboy", "holuwa-seun", "hope.uzo", "hoshikinsei", "how2steemit", "hxming", "iamalisha", "ibrahimo", "ifegee", "intermarium", "isacrist59", "ithilien", "jabril", "janicisz", "jazzman123", "jenny123", "joannawana", "jordana", "jorgenjoy", "joy.madu", "js3", "juanmolina", "jucobox", "keensleigh", "knowledge.clime", "koenau", "koske", "kraina", "kresykresow", "krishool", "ksgamer", "kumpadre", "kuya-paul", "la-piovra", "lamochilademaye", "lebu", "leo-bank", "leo-exchange", "leomarysleon", "linna188", "livingstonenice", "loracsinaco", "lorellin", "lothlorien", "lovelingling", "m11", "machaca", "makecrypto", "marabara", "marcoy2j", "marjuanm", "mcdavids", "meaprilia", "meechit", "melooo182", "michellec", "midas-bar", "minprawdy", "misslasvegas", "misterme00", "moonbbs", "mosharraf", "mrpointp", "mrspointm", "mychidera-eu", "naijaboost", "nbm", "neverpowerdown", "nurulafsar03", "obatala", "ola-play", "omo-ope", "onegame", "onweber", "owenbenjamin", "owo-paki", "owolabi-ojo", "pablitopif", "palp", "pantheon-rj", "paulade", "ph-reviews", "photomonkey8", "pielgrzym", "positive.vibe", "quinish-jenny", "quizhou", "rcr", "reborca", "rekpoma", "rivalhw", "rockerinalaph", "rojasruth69", "roxyal85", "royalfinest", "rvag5", "sabarniati.aceh", "sagarray", "sakdo", "scooby2", "seishiroyaro", "shahriarjoy55", "shamunnabi", "shikharpanwar", "shinigami240713", "shop-midas", "silmarillion", "skryptorium", "sky2028", "slappyer", "smart-shaegxy", "spy.toxic", "steaks", "steaks-info", "steemit-virus", "stimburgarin", "sumb", "sumc", "sumd", "sumf", "sumg", "sumh", "sumj", "sumk", "suml", "summ", "technicalsns", "teenage-girl", "tejumola", "temidayo", "teni", "thelooter", "theri-sae", "thesnaps", "thomisin", "titanium007", "tommyrobinson", "ueue", "valinor", "varia", "venom-web", "vesselintel"].includes(user.name)) {
    await kv.set(name, { time: Date.now(), txId: null, data: data });
    return NextResponse.json({ result: { txid: "thanks for your submission again" } });
  }

  let txId = null;
  if (network == "hive") {
    console.log("sending hive");
    const res = await sendHIVEReward(name);
    console.log("result", res);

    txId = res.txId;
  }
  if (network == "steemit") {
    console.log("sending steem");
    const res = await sendSteemitReward(name);
    console.log("result", res);

    txId = res.txId;
  }

  await kv.set(name, { time: Date.now(), txId: txId, data: data });

  // const res = await sendHIVEReward(name)
  if (txId) {
    return NextResponse.json({ result: { txId: txId } });
  } else {
    return NextResponse.json({ result: { txid: null } });
  }
}
