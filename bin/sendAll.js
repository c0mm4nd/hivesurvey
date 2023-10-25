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
