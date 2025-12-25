import { i as indexBrowserExports, l as libExports, a as indexBrowserExports$1, B as Buffer, o as otplibExports, Q as QRCode, b as lookup } from './vendor.js';

var Chain = /* @__PURE__ */ ((Chain2) => {
  Chain2["BLURT"] = "BLURT";
  Chain2["HIVE"] = "HIVE";
  Chain2["STEEM"] = "STEEM";
  return Chain2;
})(Chain || {});
var ViewState = /* @__PURE__ */ ((ViewState2) => {
  ViewState2["LANDING"] = "LANDING";
  ViewState2["WALLET"] = "WALLET";
  ViewState2["BULK"] = "BULK";
  ViewState2["MULTISIG"] = "MULTISIG";
  ViewState2["MANAGE"] = "MANAGE";
  ViewState2["HELP"] = "HELP";
  ViewState2["CHAT"] = "CHAT";
  return ViewState2;
})(ViewState || {});

const HIVE_CANDIDATES = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://hive-api.arcange.eu",
  "https://techcoderx.com",
  "https://api.deathwing.me"
];
const STEEM_CANDIDATES = [
  "https://api.steemit.com",
  "https://api.steem.fans",
  // Often reliable
  // 'https://steem.61dom.com', // REMOVED (DNS Error)
  "https://api.steememory.com"
];
const BLURT_CANDIDATES = [
  "https://rpc.beblurt.com",
  // 'https://rpc.blurt.one', // REMOVED (502 Error)
  "https://blurt-rpc.saboin.com",
  "https://rpc.blurt.world",
  "https://kentzz.blurt.world"
];
let activeNodes = {
  [Chain.HIVE]: HIVE_CANDIDATES[0],
  [Chain.STEEM]: STEEM_CANDIDATES[0],
  [Chain.BLURT]: BLURT_CANDIDATES[0]
};
const checkNodeLatency = async (url) => {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5e3);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_dynamic_global_properties",
        params: [],
        id: 1
      }),
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (!json.result) throw new Error("Invalid response structure");
    return Date.now() - start;
  } catch (e) {
    return 99999;
  }
};
const benchmarkNodes = async () => {
  await Promise.all([
    findBestNode(Chain.HIVE, HIVE_CANDIDATES),
    findBestNode(Chain.STEEM, STEEM_CANDIDATES),
    findBestNode(Chain.BLURT, BLURT_CANDIDATES)
  ]);
};
const findBestNode = async (chain, candidates) => {
  const latencies = await Promise.all(
    candidates.map(async (url) => {
      const latency = await checkNodeLatency(url);
      return { url, latency };
    })
  );
  latencies.sort((a, b) => a.latency - b.latency);
  const best = latencies[0];
  if (best.latency < 99999) {
    activeNodes[chain] = best.url;
  }
};
const getActiveNode = (chain) => {
  return activeNodes[chain];
};

const CHAIN_CONFIGS = {
  [Chain.HIVE]: {
    chain: Chain.HIVE,
    name: "Hive",
    primaryToken: "HIVE",
    secondaryToken: "HBD",
    vestingToken: "VESTS",
    addressPrefix: "STM",
    chainId: "beeab0de00000000000000000000000000000000000000000000000000000000",
    rpcNodes: [
      "https://api.hive.blog",
      "https://api.deathwing.me",
      "https://hive-api.arcange.eu",
      "https://api.openhive.network"
    ],
    explorerUrl: {
      transaction: "https://hivexplorer.com/tx/{tx}",
      account: "https://hivexplorer.com/@{account}"
    },
    api: {
      hasSecondaryToken: true,
      balanceFields: {
        primary: "balance",
        secondary: "hbd_balance",
        savings: "savings_balance"
      }
    }
  },
  [Chain.BLURT]: {
    chain: Chain.BLURT,
    name: "Blurt",
    primaryToken: "BLURT",
    secondaryToken: null,
    vestingToken: "VESTS",
    addressPrefix: "BLT",
    chainId: "cd8d90f29ae273abec3eaa7731e25934c63eb654d55080caff2ebb7f5df6381f",
    rpcNodes: [
      "https://rpc.beblurt.com",
      "https://blurt-rpc.saboin.com",
      "https://rpc.blurt.world",
      "https://api.blurt.blog"
    ],
    explorerUrl: {
      transaction: "https://blocks.blurtwallet.com/#/tx/{tx}",
      account: "https://blurtwallet.com/@{account}"
    },
    api: {
      hasSecondaryToken: false,
      balanceFields: {
        primary: "balance"
      }
    }
  },
  [Chain.STEEM]: {
    chain: Chain.STEEM,
    name: "Steem",
    primaryToken: "STEEM",
    secondaryToken: "SBD",
    vestingToken: "VESTS",
    addressPrefix: "STM",
    chainId: "79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd6a698",
    rpcNodes: [
      "https://api.steem.fans",
      "https://api.steemit.com"
    ],
    explorerUrl: {
      transaction: "https://steemit.com/tx/{tx}",
      account: "https://steemit.com/@{account}"
    },
    api: {
      hasSecondaryToken: true,
      balanceFields: {
        primary: "balance",
        secondary: "sbd_balance",
        savings: "savings_balance"
      }
    }
  }
};
function getChainConfig(chain) {
  return CHAIN_CONFIGS[chain];
}
function isChainSupported(chain) {
  return Object.values(Chain).includes(chain);
}

const broadcastHiveTransaction = async (nodeUrl, operations, key) => {
  const propsResponse = await fetch(nodeUrl, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "condenser_api.get_dynamic_global_properties",
      params: [],
      id: 1
    }),
    headers: { "Content-Type": "application/json" }
  });
  const propsJson = await propsResponse.json();
  if (!propsJson.result) throw new Error("Failed to fetch props from " + nodeUrl);
  const props = propsJson.result;
  const ref_block_num = props.head_block_number & 65535;
  const ref_block_prefix = Buffer.from(props.head_block_id, "hex").readUInt32LE(4);
  const expiration = new Date(Date.now() + 60 * 1e3).toISOString().slice(0, -5);
  const tx = {
    ref_block_num,
    ref_block_prefix,
    expiration,
    operations,
    extensions: []
  };
  const privateKey = indexBrowserExports$1.PrivateKey.fromString(key);
  const signedTx = indexBrowserExports$1.cryptoUtils.signTransaction(tx, [privateKey]);
  const broadcastResponse = await fetch(nodeUrl, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "condenser_api.broadcast_transaction_synchronous",
      params: [signedTx],
      id: 1
    }),
    headers: { "Content-Type": "application/json" }
  });
  const broadcastResult = await broadcastResponse.json();
  if (broadcastResult.error) {
    throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
  }
  return broadcastResult.result;
};
const fetchGlobalProps = async (chain) => {
  try {
    const nodeUrl = await getActiveNode(chain);
    const response = await fetch(nodeUrl, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_dynamic_global_properties",
        params: [],
        id: 1
      }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await response.json();
    return json.result;
  } catch (error) {
    console.error(`Error fetching global props for ${chain}:`, error);
    return null;
  }
};
const convertToVests = async (chain, amountInPower) => {
  const props = await fetchGlobalProps(chain);
  if (!props) throw new Error("Could not fetch global properties for conversion");
  const totalVestingFund = parseFloat(String(props.total_vesting_fund_hive || props.total_vesting_fund_steem || props.total_vesting_fund_blurt || "0").split(" ")[0]);
  const totalVestingShares = parseFloat(String(props.total_vesting_shares).split(" ")[0]);
  if (totalVestingFund === 0) return "0.000000 VESTS";
  const vests = amountInPower * totalVestingShares / totalVestingFund;
  return `${vests.toFixed(6)} VESTS`;
};
const fetchBalances = async (chain, username) => {
  const nodeUrl = getActiveNode(chain);
  try {
    const response = await fetch(nodeUrl, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_accounts",
        params: [[username]],
        id: 1
      }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await response.json();
    if (!json.result || json.result.length === 0) return { primary: 0, secondary: 0, staked: 0 };
    const acc = json.result[0];
    const config = getChainConfig(chain);
    const props = await fetchGlobalProps(chain);
    let stakedPower = 0;
    if (props) {
      const totalVests = parseFloat(acc.vesting_shares.split(" ")[0]);
      const totalFund = parseFloat(props.total_vesting_fund_steem || props.total_vesting_fund_hive || props.total_vesting_fund_blurt || "0");
      const totalVestingShares = parseFloat(props.total_vesting_shares.split(" ")[0]);
      if (totalVestingShares > 0) {
        stakedPower = totalVests * totalFund / totalVestingShares;
      }
    }
    const primaryStr = acc[config.api.balanceFields.primary] || "0";
    const secondaryStr = config.api.balanceFields.secondary ? acc[config.api.balanceFields.secondary] || "0" : "0";
    const nextWithdrawal = acc.next_vesting_withdrawal;
    const powerDownActive = nextWithdrawal && !nextWithdrawal.startsWith("1969") && !nextWithdrawal.startsWith("1970");
    let powerDownAmount = 0;
    if (powerDownActive && props) {
      const withdrawRateVests = parseFloat(acc.vesting_withdraw_rate.split(" ")[0]);
      const totalFund = parseFloat(props.total_vesting_fund_steem || props.total_vesting_fund_hive || props.total_vesting_fund_blurt || "0");
      const totalVestingShares = parseFloat(props.total_vesting_shares.split(" ")[0]);
      powerDownAmount = withdrawRateVests * totalFund / totalVestingShares;
    }
    return {
      primary: parseFloat(String(primaryStr).split(" ")[0]),
      secondary: parseFloat(String(secondaryStr).split(" ")[0]),
      staked: stakedPower,
      powerDownActive,
      nextPowerDown: nextWithdrawal,
      powerDownAmount
    };
  } catch (error) {
    console.error(`Error fetching balance for ${username} on ${chain}:`, error);
    return { primary: 0, secondary: 0, staked: 0 };
  }
};
const fetchAccountData = async (chain, username) => {
  const nodeUrl = getActiveNode(chain);
  try {
    const response = await fetch(nodeUrl, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_accounts",
        params: [[username]],
        id: 1
      }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await response.json();
    if (json.result && json.result.length > 0) {
      return json.result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching account data for ${username} on ${chain}:`, error);
    return null;
  }
};
const validateAccountKeys = async (chain, username, keys) => {
  try {
    const accountData = await fetchAccountData(chain, username);
    if (!accountData) return { valid: false, error: "Account not found or network error" };
    const config = getChainConfig(chain);
    const prefix = config.addressPrefix;
    let errors = [];
    const verifyKey = (keyStr, auths, type) => {
      try {
        let pub = indexBrowserExports$1.PrivateKey.fromString(keyStr).createPublic().toString();
        if (prefix !== "STM" && pub.startsWith("STM")) {
          pub = prefix + pub.substring(3);
        }
        const found = auths.some((auth) => auth[0] === pub);
        if (!found) errors.push(`${type} key does not match account`);
      } catch (e) {
        errors.push(`Invalid ${type} key format`);
      }
    };
    if (keys.active) verifyKey(keys.active, accountData.active.key_auths, "Active");
    if (keys.posting) verifyKey(keys.posting, accountData.posting.key_auths, "Posting");
    if (keys.memo && keys.memo !== accountData.memo_key) {
      try {
        let pub = indexBrowserExports$1.PrivateKey.fromString(keys.memo).createPublic().toString();
        if (prefix !== "STM" && pub.startsWith("STM")) {
          pub = prefix + pub.substring(3);
        }
        if (pub !== accountData.memo_key) errors.push("Memo key does not match");
      } catch (e) {
        errors.push("Invalid Memo key format");
      }
    }
    if (errors.length > 0) return { valid: false, error: errors.join(", ") };
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
};
const broadcastTransfer = async (chain, from, activeKey, to, amount, memo, tokenSymbol) => {
  const formattedAmount = parseFloat(amount).toFixed(3);
  const nodeUrl = getActiveNode(chain);
  const defaultToken = chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT";
  const symbol = tokenSymbol || defaultToken;
  try {
    if (chain === Chain.HIVE) {
      const transfer = ["transfer", { from, to, amount: `${formattedAmount} ${symbol}`, memo }];
      const result = await broadcastHiveTransaction(nodeUrl, [transfer], activeKey);
      return { success: true, txId: result.id, opResult: result };
    } else if (chain === Chain.STEEM) {
      const client = new indexBrowserExports.Client(nodeUrl);
      const key = indexBrowserExports.PrivateKey.fromString(activeKey);
      const transfer = { from, to, amount: `${formattedAmount} ${symbol}`, memo };
      const result = await client.broadcast.transfer(transfer, key);
      return { success: true, txId: result.id };
    } else if (chain === Chain.BLURT) {
      const config = getChainConfig(Chain.BLURT);
      libExports.config.set("address_prefix", config.addressPrefix);
      libExports.config.set("chain_id", config.chainId);
      libExports.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
      const result = await new Promise((resolve, reject) => {
        libExports.broadcast.transfer(activeKey, from, to, `${formattedAmount} BLURT`, memo, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
      return { success: true, txId: result.id };
    }
    return { success: false, error: "Chain not supported" };
  } catch (e) {
    console.error("Transfer Error:", e);
    return { success: false, error: e.message || "Broadcast failed" };
  }
};
const broadcastVote = async (chain, voter, key, author, permlink, weight) => {
  const nodeUrl = getActiveNode(chain);
  try {
    if (chain === Chain.HIVE) {
      const vote = ["vote", { voter, author, permlink, weight }];
      const result = await broadcastHiveTransaction(nodeUrl, [vote], key);
      return { success: true, txId: result.id, opResult: result };
    } else if (chain === Chain.STEEM) {
      const client = new indexBrowserExports.Client(nodeUrl);
      const privateKey = indexBrowserExports.PrivateKey.fromString(key);
      const result = await client.broadcast.vote({ voter, author, permlink, weight }, privateKey);
      return { success: true, txId: result.id };
    } else if (chain === Chain.BLURT) {
      const config = getChainConfig(Chain.BLURT);
      libExports.config.set("address_prefix", config.addressPrefix);
      libExports.config.set("chain_id", config.chainId);
      libExports.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
      const result = await new Promise((resolve, reject) => {
        libExports.broadcast.vote(key, voter, author, permlink, weight, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
      return { success: true, txId: result.id };
    }
    return { success: false, error: "Chain not supported" };
  } catch (e) {
    return { success: false, error: e.message || "Vote failed" };
  }
};
const broadcastCustomJson = async (chain, username, key, id, json, keyType) => {
  const nodeUrl = getActiveNode(chain);
  try {
    const required_auths = keyType === "Active" ? [username] : [];
    const required_posting_auths = keyType === "Posting" ? [username] : [];
    if (chain === Chain.HIVE) {
      const op = ["custom_json", {
        required_auths,
        required_posting_auths,
        id,
        json: typeof json === "string" ? json : JSON.stringify(json)
      }];
      const result = await broadcastHiveTransaction(nodeUrl, [op], key);
      return { success: true, txId: result.id, opResult: result };
    } else if (chain === Chain.STEEM) {
      const client = new indexBrowserExports.Client(nodeUrl);
      const privateKey = indexBrowserExports.PrivateKey.fromString(key);
      const result = await client.broadcast.json({ id, json, required_auths, required_posting_auths }, privateKey);
      return { success: true, txId: result.id };
    } else if (chain === Chain.BLURT) {
      const config = getChainConfig(Chain.BLURT);
      libExports.config.set("address_prefix", config.addressPrefix);
      libExports.config.set("chain_id", config.chainId);
      libExports.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
      const result = await new Promise((resolve, reject) => {
        libExports.broadcast.customJson(key, required_auths, required_posting_auths, id, json, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
      return { success: true, txId: result.id };
    }
    return { success: false, error: "Chain not supported" };
  } catch (e) {
    return { success: false, error: e.message || "Custom JSON failed" };
  }
};
const formatChainError = (error) => {
  const msg = error.message || String(error);
  if (msg.includes("op.vesting_shares >= min_delegation")) {
    try {
      const match = msg.match(/minimum delegation amount of ({.*})/);
      if (match && match[1]) {
        const data = JSON.parse(match[1]);
        const amount = (parseFloat(data.amount) / Math.pow(10, data.precision)).toFixed(6);
        return `Delegation too small. Minimum required: ${amount} VESTS (roughly 35 BLURT/BP)`;
      }
    } catch (e) {
    }
    return "Delegation amount is too small. Please enter a larger amount (at least ~35 BP for Blurt).";
  }
  if (msg.includes("balance")) return "Insufficient balance for this operation.";
  if (msg.includes("authority")) return "Missing required authority. Check your Active key.";
  if (msg.includes("Error Signature") || msg.includes("32602")) {
    return "Signature Error (-32602). This often happens if the data sent by the website is malformed or if there is a mismatch in serialization. Please try reloading the website.";
  }
  return msg;
};
const broadcastOperations = async (chain, activeKey, operations) => {
  const nodeUrl = getActiveNode(chain);
  try {
    if (chain === Chain.HIVE) {
      const result = await broadcastHiveTransaction(nodeUrl, operations, activeKey);
      return { success: true, txId: result.id, opResult: result };
    } else if (chain === Chain.STEEM) {
      const client = new indexBrowserExports.Client(nodeUrl);
      const key = indexBrowserExports.PrivateKey.fromString(activeKey);
      const result = await client.broadcast.sendOperations(operations, key);
      return { success: true, txId: result.id, opResult: result };
    } else if (chain === Chain.BLURT) {
      const config = getChainConfig(Chain.BLURT);
      libExports.config.set("address_prefix", config.addressPrefix);
      libExports.config.set("chain_id", config.chainId);
      libExports.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
      const cleanOperations = operations.map((op) => {
        const opName = op[0];
        const opData = { ...op[1] };
        const metadataFields = ["json_metadata", "posting_json_metadata"];
        metadataFields.forEach((field) => {
          if (opData[field] !== void 0 && opData[field] !== null) {
            if (typeof opData[field] === "object") {
              try {
                opData[field] = JSON.stringify(opData[field]);
              } catch (e) {
                console.error(`[ChainService] Failed to stringify ${field}:`, e);
              }
            }
          } else {
            if (opName === "comment" && field === "json_metadata") {
              opData[field] = "";
            }
          }
        });
        if (opData.tags) {
          try {
            let meta = {};
            if (opData.json_metadata) {
              try {
                meta = typeof opData.json_metadata === "string" ? JSON.parse(opData.json_metadata) : opData.json_metadata;
              } catch (e) {
              }
            }
            meta.tags = opData.tags;
            opData.json_metadata = JSON.stringify(meta);
            delete opData.tags;
          } catch (e) {
            console.error("[ChainService] Error merging tags into metadata:", e);
          }
        }
        if (opData.extensions !== void 0 && !Array.isArray(opData.extensions)) {
          opData.extensions = [];
        }
        return [opName, opData];
      });
      const result = await new Promise((resolve, reject) => {
        libExports.broadcast.send({ extensions: [], operations: cleanOperations }, [activeKey], (err, res) => {
          if (err) {
            console.error("[ChainService] Blurt Broadcast Error:", err);
            console.error("[ChainService] Failed Payload:", JSON.stringify(cleanOperations));
            reject(err);
          } else {
            console.log("[ChainService] Blurt Success:", res.id);
            resolve(res);
          }
        });
      });
      return { success: true, txId: result.id, opResult: result };
    }
    return { success: false, error: "Chain not supported" };
  } catch (e) {
    console.error("Broadcast Ops Error:", e);
    return { success: false, error: formatChainError(e) };
  }
};
const broadcastBulkTransfer = async (chain, from, activeKey, items, tokenSymbol) => {
  const defaultToken = chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT";
  const symbol = tokenSymbol || defaultToken;
  const ops = items.map((item) => {
    return ["transfer", {
      from,
      to: item.to,
      amount: `${item.amount.toFixed(3)} ${symbol}`,
      memo: item.memo
    }];
  });
  return broadcastOperations(chain, activeKey, ops);
};
const broadcastPowerUp = async (chain, username, activeKey, to, amount) => {
  const op = ["transfer_to_vesting", {
    from: username,
    to,
    amount
  }];
  return broadcastOperations(chain, activeKey, [op]);
};
const broadcastPowerDown = async (chain, username, activeKey, amountPower) => {
  try {
    let vestingShares;
    if (typeof amountPower === "string" && amountPower.includes("VESTS")) {
      vestingShares = amountPower;
    } else {
      const numericAmount = typeof amountPower === "string" ? parseFloat(amountPower) : amountPower;
      vestingShares = numericAmount === 0 ? "0.000000 VESTS" : await convertToVests(chain, numericAmount);
    }
    const op = ["withdraw_vesting", {
      account: username,
      vesting_shares: vestingShares
    }];
    return broadcastOperations(chain, activeKey, [op]);
  } catch (e) {
    return { success: false, error: e.message || "Failed to convert power to vests" };
  }
};
const broadcastDelegation = async (chain, username, activeKey, delegatee, amountPower) => {
  try {
    let vestingShares;
    if (typeof amountPower === "string" && amountPower.includes("VESTS")) {
      vestingShares = amountPower;
    } else {
      const numericAmount = typeof amountPower === "string" ? parseFloat(amountPower) : amountPower;
      vestingShares = numericAmount === 0 ? "0.000000 VESTS" : await convertToVests(chain, numericAmount);
    }
    const op = ["delegate_vesting_shares", {
      delegator: username,
      delegatee,
      vesting_shares: vestingShares
    }];
    return broadcastOperations(chain, activeKey, [op]);
  } catch (e) {
    return { success: false, error: e.message || "Failed to convert power to vests" };
  }
};
const broadcastSavingsDeposit = async (chain, username, activeKey, amount) => {
  if (chain === Chain.BLURT) {
    return { success: false, error: "Blurt does not support savings" };
  }
  const op = ["transfer_to_savings", {
    from: username,
    to: username,
    amount,
    memo: ""
  }];
  return broadcastOperations(chain, activeKey, [op]);
};
const broadcastSavingsWithdraw = async (chain, username, activeKey, amount, requestId) => {
  if (chain === Chain.BLURT) {
    return { success: false, error: "Blurt does not support savings" };
  }
  const op = ["transfer_from_savings", {
    from: username,
    request_id: requestId,
    to: username,
    amount,
    memo: ""
  }];
  return broadcastOperations(chain, activeKey, [op]);
};
const broadcastRCDelegate = async (chain, username, activeKey, delegatee, amountHP) => {
  if (chain !== Chain.HIVE) {
    return { success: false, error: "RC delegation is only available on Hive" };
  }
  try {
    const vestingShares = await convertToVests(chain, amountHP);
    const maxRC = parseInt(vestingShares.split(" ")[0].replace(".", ""));
    const op = ["delegate_rc", {
      from: username,
      delegatees: [delegatee],
      max_rc: maxRC
    }];
    return broadcastOperations(chain, activeKey, [op]);
  } catch (e) {
    return { success: false, error: e.message || "Failed to convert HP to RC" };
  }
};
const broadcastRCUndelegate = async (chain, username, activeKey, delegatee) => {
  if (chain !== Chain.HIVE) {
    return { success: false, error: "RC delegation is only available on Hive" };
  }
  const op = ["delegate_rc", {
    from: username,
    delegatees: [delegatee],
    max_rc: 0
  }];
  return broadcastOperations(chain, activeKey, [op]);
};
const fetchAccountHistory = async (chain, username) => {
  const node = getActiveNode(chain);
  const processOp = (op, timestamp, trx_id) => {
    const type = op[0];
    const data = op[1];
    if (type === "transfer") {
      if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: "send", txId: trx_id };
      if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: "receive", txId: trx_id };
    }
    return null;
  };
  try {
    if (chain === Chain.HIVE) {
      const response = await fetch(node, {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", method: "condenser_api.get_account_history", params: [username, -1, 500], id: 1 }),
        headers: { "Content-Type": "application/json" }
      });
      const json = await response.json();
      if (json.result) return json.result.map((h) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h) => h !== null).reverse();
    }
    if (chain === Chain.STEEM) {
      const client = new indexBrowserExports.Client(node);
      const history = await client.database.call("get_account_history", [username, -1, 500]);
      return history.map((h) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h) => h !== null).reverse();
    }
    if (chain === Chain.BLURT) {
      const response = await fetch(node, { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", method: "condenser_api.get_account_history", params: [username, -1, 500], id: 1 }), headers: { "Content-Type": "application/json" } });
      const json = await response.json();
      if (json.result) return json.result.map((h) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h) => h !== null).reverse();
    }
  } catch (e) {
    console.error("Fetch History Error:", e);
  }
  return [];
};
const detectWeb3Context = () => {
  if (typeof window === "undefined") return null;
  let hostname;
  try {
    hostname = new URL(window.location.href).hostname;
  } catch {
    return null;
  }
  if (hostname === "steemit.com" || hostname.endsWith(".steemit.com")) return "steemit";
  if (hostname === "hive.blog" || hostname.endsWith(".hive.blog") || hostname === "peakd.com" || hostname.endsWith(".peakd.com")) return "hive";
  if (hostname === "blurt.blog" || hostname.endsWith(".blurt.blog") || hostname === "beblurt.com" || hostname.endsWith(".beblurt.com")) return "blurt";
  return null;
};
const signMessage = (chain, message, keyStr, _useLegacySigner = false) => {
  try {
    if (chain === Chain.HIVE || chain === Chain.STEEM || chain === Chain.BLURT) {
      const key = indexBrowserExports$1.PrivateKey.fromString(keyStr);
      const prefix = getChainConfig(chain).addressPrefix;
      let msgBuf;
      if (typeof message === "object" && !Buffer.isBuffer(message)) {
        if (message.type === "Buffer" && Array.isArray(message.data)) {
          msgBuf = Buffer.from(message.data);
        } else {
          msgBuf = Buffer.from(JSON.stringify(message));
        }
      } else if (Buffer.isBuffer(message)) {
        msgBuf = message;
      } else if (typeof message === "string") {
        try {
          const parsed = JSON.parse(message);
          if (parsed.type === "Buffer" && Array.isArray(parsed.data)) {
            msgBuf = Buffer.from(parsed.data);
          } else {
            msgBuf = Buffer.from(message);
          }
        } catch (e) {
          msgBuf = Buffer.from(message);
        }
      } else {
        msgBuf = Buffer.from(String(message));
      }
      if (chain === Chain.BLURT && typeof message === "string" && message.length > 200 && /^[0-9a-fA-F]+$/.test(message)) {
        try {
          msgBuf = Buffer.from(message, "hex");
        } catch (e) {
        }
      }
      let hash;
      if (chain === Chain.BLURT && msgBuf.length > 200) {
        const challengePrefix = Buffer.from("ImageSigningChallenge", "utf-8");
        const alreadyHasPrefix = msgBuf.slice(0, challengePrefix.length).equals(challengePrefix);
        if (alreadyHasPrefix) {
          hash = indexBrowserExports$1.cryptoUtils.sha256(msgBuf);
        } else {
          const combined = Buffer.concat([challengePrefix, msgBuf]);
          hash = indexBrowserExports$1.cryptoUtils.sha256(combined);
        }
      } else {
        hash = indexBrowserExports$1.cryptoUtils.sha256(msgBuf);
      }
      const sig = key.sign(hash);
      const signature = sig.toString();
      let publicKey = key.createPublic().toString();
      if (prefix !== "STM" && publicKey.startsWith("STM")) {
        publicKey = prefix + publicKey.substring(3);
      }
      return { success: true, result: signature, publicKey };
    } else {
      return { success: false, error: "Chain not supported" };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
};

const authenticateWithGoogle = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "google_user_123", email: "user@example.com" });
    }, 1e3);
  });
};
const authenticateWithDevice = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "device_user_123" });
    }, 1e3);
  });
};
const isBiometricsAvailable = async () => {
  if (!window.PublicKeyCredential) return false;
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (e) {
    console.warn("Biometric check failed or not supported in this context", e);
    return false;
  }
};
const registerBiometrics = async () => {
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    const host = window.location.hostname || "";
    const isValidDomain = host.includes(".") && host.length < 40;
    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Gravity Wallet",
        id: isValidDomain ? host : void 0
      },
      user: {
        id: window.crypto.getRandomValues(new Uint8Array(16)),
        name: "gravity_user_" + Math.floor(Math.random() * 1e4),
        displayName: "Gravity Wallet Owner"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        // ES256
        { alg: -257, type: "public-key" },
        // RS256
        { alg: -8, type: "public-key" }
        // Ed25519
      ],
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred"
      },
      timeout: 12e4,
      attestation: "none"
    };
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });
    return !!credential;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    return false;
  }
};

const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 6e5;
const ALGO = "AES-GCM";
const HASH = "SHA-256";
const enc = new TextEncoder();
const dec = new TextDecoder();
let cachedKey = null;
let cachedSalt = null;
async function getKey(password, salt) {
  const encPassword = enc.encode(password);
  return getKeyFromBytes(encPassword, salt);
}
async function getKeyFromBytes(passwordBytes, salt) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HASH
    },
    keyMaterial,
    { name: ALGO, length: 256 },
    true,
    // Extractable (needed for session persistence)
    ["encrypt", "decrypt"]
  );
}
async function storeInternalKey(key) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ "device_auth_struct": key });
  } else {
    localStorage.setItem("device_auth_struct", key);
  }
}
async function getInternalKey() {
  let val;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get(["device_auth_struct"]);
    val = res.device_auth_struct;
  } else {
    val = localStorage.getItem("device_auth_struct");
  }
  if (!val) return null;
  try {
    if (typeof val === "string" && val.trim().startsWith("{")) {
      val = JSON.parse(val);
    }
    if (typeof val === "object" && val !== null) {
      if (val.k) return val.k;
      if (val.key) return val.key;
    }
  } catch (e) {
  }
  return typeof val === "string" ? val : String(val);
}
async function hasPinProtectedKey() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get(["device_pin_data"]);
    return !!res.device_pin_data;
  }
  return !!localStorage.getItem("device_pin_data");
}
async function saveInternalKeyWithPin(keyStr, pin) {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const pinKey = await getKey(pin, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encData = new TextEncoder().encode(keyStr);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    pinKey,
    encData
  );
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);
  const base64 = btoa(String.fromCharCode(...bundle));
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ "device_pin_data": base64 });
    await chrome.storage.local.remove("device_auth_struct");
  } else {
    localStorage.setItem("device_pin_data", base64);
    localStorage.removeItem("device_auth_struct");
  }
}
async function loadInternalKeyWithPin(pin) {
  let base64;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get(["device_pin_data"]);
    base64 = res.device_pin_data;
  } else {
    base64 = localStorage.getItem("device_pin_data");
  }
  if (!base64) return null;
  try {
    const bundle = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);
    const key = await getKey(pin, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("PIN Decryption failed", e);
    return null;
  }
}
async function initVault(password) {
  const emptyVault = { accounts: [], lastUpdated: Date.now() };
  await saveVault(password, emptyVault);
  return emptyVault;
}
async function initVaultWithGeneratedKey(pin) {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (pin) {
    await saveInternalKeyWithPin(internalKey, pin);
  } else {
    throw new Error("Security Violation: Cannot initialize vault without a PIN or password protection.");
  }
  const emptyVault = { accounts: [], lastUpdated: Date.now() };
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;
  await saveVault(internalKey, emptyVault);
  return { vault: emptyVault, internalKey };
}
async function enablePasswordless(accounts) {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
  await storeInternalKey(internalKey);
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;
  const vault = { accounts, lastUpdated: Date.now() };
  await saveVault(internalKey, vault);
}
async function saveVault(password, vault) {
  let salt;
  let key;
  if (password === "cached") {
    if (cachedKey && cachedSalt) {
      key = cachedKey;
      salt = cachedSalt;
    } else {
      throw new Error("Attempted to save with cached key but cache is empty!");
    }
  } else {
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
    key = await getKey(password, salt);
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();
  }
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encodedData = enc.encode(JSON.stringify(vault));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encodedData
  );
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);
  const base64 = btoa(String.fromCharCode(...bundle));
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ vaultData: base64 });
  } else {
    localStorage.setItem("vaultData", base64);
  }
}
async function getVault() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get(["vaultData"]);
    return res.vaultData || null;
  } else {
    return localStorage.getItem("vaultData");
  }
}
async function tryDecrypt(password, base64Vault) {
  try {
    const bundle = Uint8Array.from(atob(base64Vault), (c) => c.charCodeAt(0));
    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);
    const key = await getKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();
    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    return null;
  }
}
async function unlockVault(password) {
  let base64 = null;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get(["vaultData"]);
    base64 = res.vaultData;
  } else {
    base64 = localStorage.getItem("vaultData");
  }
  if (!base64) return null;
  let vault = await tryDecrypt(password, base64);
  if (vault) return vault;
  console.warn("Standard decryption failed, trying Base64 decode fallback...");
  try {
    if (/^[A-Za-z0-9+/=]+$/.test(password)) {
      const decoded = atob(password);
      vault = await tryDecrypt(decoded, base64);
      if (vault) {
        console.log("Success with Base64 decoded password");
        return vault;
      }
    }
  } catch (e) {
  }
  console.error("All decryption attempts failed.");
  return null;
}
function clearCryptoCache() {
  cachedKey = null;
  cachedSalt = null;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    chrome.storage.session.remove("crypto_session");
  }
}
async function persistSession() {
  if (!cachedKey || !cachedSalt) return;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    const exported = await window.crypto.subtle.exportKey("raw", cachedKey);
    const saltArr = Array.from(cachedSalt);
    const keyArr = Array.from(new Uint8Array(exported));
    chrome.storage.session.set({
      crypto_session: { key: keyArr, salt: saltArr }
    });
  }
}
async function tryRestoreSession() {
  if (cachedKey) return true;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    return new Promise((resolve) => {
      chrome.storage.session.get(["crypto_session"], async (res) => {
        if (res.crypto_session) {
          try {
            const { key, salt } = res.crypto_session;
            const importedKey = await window.crypto.subtle.importKey(
              "raw",
              new Uint8Array(key),
              ALGO,
              // 'AES-GCM'
              true,
              ["encrypt", "decrypt"]
            );
            cachedKey = importedKey;
            cachedSalt = new Uint8Array(salt);
            resolve(true);
          } catch (e) {
            console.warn("Session restore failed", e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }
  return false;
}

otplibExports.authenticator.options = { window: 1 };
const STORAGE_KEY = "device_totp_secret";
const generateSetup = async (accountName = "GravityWallet") => {
  const secret = otplibExports.authenticator.generateSecret();
  const otpauth = otplibExports.authenticator.keyuri(accountName, "Gravity Wallet", secret);
  try {
    const qrCode = await QRCode.toDataURL(otpauth);
    return { secret, qrCode };
  } catch (err) {
    console.error("QR Gen Error:", err);
    throw err;
  }
};
const verifyTOTP = (token, secret) => {
  try {
    return otplibExports.authenticator.check(token, secret);
  } catch (e) {
    return false;
  }
};
const saveTOTPSecret = async (secret) => {
  const storedValue = btoa(secret);
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ [STORAGE_KEY]: storedValue });
  } else {
    localStorage.setItem(STORAGE_KEY, storedValue);
  }
};
const getTOTPSecret = async () => {
  let val;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get([STORAGE_KEY]);
    val = res[STORAGE_KEY];
  } else {
    val = localStorage.getItem(STORAGE_KEY);
  }
  if (!val) return null;
  try {
    return atob(val);
  } catch (e) {
    return val;
  }
};
const hasTOTPConfigured = async () => {
  const secret = await getTOTPSecret();
  return !!secret;
};

const validateUsername = (username) => {
  if (!username) return "Username is required";
  const trimmed = username.trim().toLowerCase();
  const usernameRegex = /^[a-z][a-z0-9\-.]{2,15}$/;
  if (!usernameRegex.test(trimmed)) {
    return "Invalid username format (3-16 chars, lowercase)";
  }
  return null;
};
const validatePrivateKey = (key) => {
  if (!key) return null;
  const trimmed = key.trim();
  const wifRegex = /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/;
  if (!wifRegex.test(trimmed)) {
    return "Invalid Private Key format";
  }
  return null;
};
const verifyKeyAgainstChain = async (chain, username, privateKey, type) => {
  try {
    if (!privateKey) return true;
    const accountData = await fetchAccountData(chain, username);
    if (!accountData) return false;
    let derivedPub;
    if (chain === Chain.HIVE || chain === Chain.BLURT) {
      derivedPub = indexBrowserExports$1.PrivateKey.fromString(privateKey).createPublic().toString();
    } else {
      derivedPub = indexBrowserExports.PrivateKey.fromString(privateKey).createPublic().toString();
    }
    const validPrefixes = ["STM", "BLT", "TST", "GLS"];
    const pubKeyBody = derivedPub.slice(3);
    const possibleKeys = validPrefixes.map((prefix) => prefix + pubKeyBody);
    possibleKeys.push(derivedPub);
    if (type === "memo") {
      return possibleKeys.includes(accountData.memo_key);
    } else {
      const auths = type === "active" ? accountData.active.key_auths : accountData.posting.key_auths;
      return auths.some((auth) => possibleKeys.includes(auth[0]));
    }
  } catch (e) {
    console.error("Key Verification Error:", e);
    return false;
  }
};

class ChatService {
  socket = null;
  userId = null;
  username = null;
  // Callbacks for UI updates
  onMessage = null;
  onRoomUpdated = null;
  onRoomAdded = null;
  onAuthSuccess = null;
  onAuthenticated = null;
  // Alias for AuthSuccess
  onError = null;
  onStatusChange = null;
  rooms = [];
  serverUrl = "https://gravity-chat-serve.onrender.com";
  init() {
    if (this.socket?.connected) return;
    this.socket = lookup(this.serverUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1e3,
      autoConnect: true
    });
    this.socket.on("connect", async () => {
      console.log("Connected to Chat Server");
      if (this.onStatusChange) this.onStatusChange("connected");
      window.dispatchEvent(new Event("chat-connected"));
      const storedUser = localStorage.getItem("gravity_chat_username");
      const storedKey = localStorage.getItem("gravity_chat_priv");
      const storedId = localStorage.getItem("gravity_chat_id");
      if (storedUser && storedKey) {
        console.log("Auto-logging in as", storedUser);
        await this.authenticateWithSignature(storedId, storedUser);
      }
    });
    this.setupListeners();
  }
  setupListeners() {
    if (!this.socket) return;
    this.socket.on("disconnect", () => {
      if (this.onStatusChange) this.onStatusChange("disconnected");
      window.dispatchEvent(new Event("chat-disconnected"));
    });
    this.socket.on("connect_error", (err) => {
      if (this.onStatusChange) this.onStatusChange("disconnected", err.message);
    });
    this.socket.on("auth_challenge", async (data) => {
      console.log("Received auth challenge");
      const storedKey = localStorage.getItem("gravity_chat_priv");
      if (storedKey) {
        try {
          const signature = await this.signChallenge(data.challenge, storedKey);
          this.socket?.emit("verify_signature", { signature });
        } catch (e) {
          console.error("Auto-signing challenge failed", e);
        }
      }
    });
    this.socket.on("auth_success", (data) => {
      if (this.userId === data.id && this.rooms.length > 0) {
        console.log(`⚠️ Ignoring duplicate auth_success for ${data.username}`);
        return;
      }
      this.userId = data.id;
      this.username = data.username;
      this.rooms = data.rooms.map((r) => ({
        ...r,
        messages: [],
        unreadCount: 0
      }));
      console.log(`✅ Auth Success! Received ${this.rooms.length} rooms:`, this.rooms.map((r) => r.name));
      localStorage.setItem("gravity_chat_id", data.id);
      localStorage.setItem("gravity_chat_username", data.username);
      if (this.onAuthSuccess) this.onAuthSuccess({ id: data.id, username: data.username });
      if (this.onAuthenticated) this.onAuthenticated(data.id, data.username);
      if (this.onRoomUpdated) this.onRoomUpdated(this.rooms);
    });
    this.socket.on("new_message", (data) => {
      this.handleNewMessage(data.roomId, data.message);
    });
    this.socket.on("room_history", (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        room.messages = data.messages;
        room.memberDetails = data.memberDetails;
        if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
      }
    });
    this.socket.on("member_joined", (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        if (!room.memberDetails) room.memberDetails = [];
        if (!room.memberDetails.find((u) => u.id === data.userId)) {
          room.memberDetails.push({ id: data.userId, username: data.username });
          if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
        }
      }
    });
    this.socket.on("room_added", (roomData) => {
      console.log(`🆕 room_added event received:`, roomData);
      if (this.rooms.find((r) => r.id === roomData.id)) {
        console.log(`⚠️ Room ${roomData.name} already exists, skipping`);
        return;
      }
      const newRoom = { ...roomData, messages: [], unreadCount: 0 };
      this.rooms.push(newRoom);
      console.log(`✅ Added room to local list. Total rooms: ${this.rooms.length}`);
      if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
      if (this.onRoomAdded) this.onRoomAdded(newRoom);
    });
    this.socket.on("room_joined", (roomData) => {
      if (this.rooms.find((r) => r.id === roomData.id)) return;
      const newRoom = { ...roomData, messages: [], unreadCount: 0 };
      this.rooms.push(newRoom);
      if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
      if (this.onRoomAdded) this.onRoomAdded(newRoom);
    });
    this.socket.on("room_removed", (roomId) => {
      this.rooms = this.rooms.filter((r) => r.id !== roomId);
      if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
    });
    this.socket.on("user_kicked", (data) => {
      if (data.userId === this.userId) {
        if (this.onError) this.onError(`You were kicked from room`);
        window.dispatchEvent(new CustomEvent("chat-room-kicked", { detail: data }));
      }
    });
    this.socket.on("user_banned", (data) => {
      if (data.userId === this.userId) {
        if (this.onError) this.onError(`You were BANNED from room`);
        window.dispatchEvent(new CustomEvent("chat-room-kicked", { detail: data }));
      }
    });
    this.socket.on("error", (msg) => {
      console.error("Socket Error:", msg);
      if (msg.includes("User not found") || msg.includes("no public key registered")) {
        console.warn("Server identity lost. Clearing local chat identity.");
        const storedName = localStorage.getItem("gravity_chat_username");
        localStorage.removeItem("gravity_chat_id");
        localStorage.removeItem("gravity_chat_priv");
        localStorage.removeItem("gravity_chat_pub");
        if (storedName && !storedName.startsWith("!RESET!")) {
          console.log(`Auto-repairing identity for ${storedName}...`);
          setTimeout(() => {
            this.register(storedName).catch(console.error);
          }, 500);
          return;
        }
      }
      if (this.onError) this.onError(msg);
    });
    this.socket.on("search_results", (results) => {
      window.dispatchEvent(new CustomEvent("chat-search-results", { detail: results }));
    });
    this.socket.on("user_online", (userId) => this.handleUserStatusChange(userId, true));
    this.socket.on("user_offline", (userId) => this.handleUserStatusChange(userId, false));
  }
  // --- CRYPTO & AUTH ---
  async generateAndSaveIdentity() {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );
    const exportedPub = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const exportedPriv = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const publicKeyHex = this.bufferToHex(new Uint8Array(exportedPub));
    const privateKeyHex = this.bufferToHex(new Uint8Array(exportedPriv));
    localStorage.setItem("gravity_chat_priv", privateKeyHex);
    localStorage.setItem("gravity_chat_pub", publicKeyHex);
    return { publicKey: publicKeyHex, privateKey: privateKeyHex };
  }
  async authenticateWithSignature(userId, username) {
    if (!this.socket) return;
    this.socket.emit("request_challenge", { userId, username });
  }
  async signChallenge(challenge, privateKeyHex) {
    const privateKeyBuffer = this.hexToBuffer(privateKeyHex);
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);
    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      privateKey,
      data
    );
    return this.bufferToHex(new Uint8Array(signature));
  }
  hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }
  bufferToHex(buffer) {
    return Array.from(buffer).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // --- PUBLIC METHODS ---
  createRoom(name, isPrivate = false) {
    this.socket?.emit("create_room", { name, isPrivate });
  }
  getCurrentUser() {
    if (this.userId && this.username) return { id: this.userId, username: this.username };
    return null;
  }
  async register(username) {
    if (!this.socket) await this.init();
    const storedUser = this.getStoredUsername();
    const storedKey = this.getStoredPrivateKey();
    if (storedUser?.toLowerCase() === username.toLowerCase() && storedKey) {
      console.log("Local keys found, performing cryptographic login recovery...");
      return this.authenticateWithSignature(null, username);
    }
    const keys = await this.generateAndSaveIdentity();
    if (!username.startsWith("!RESET!")) {
      localStorage.setItem("gravity_chat_username", username);
    }
    this.socket?.emit("register", {
      username,
      publicKey: keys.publicKey
    });
  }
  async sendMessage(roomId, content) {
    if (!this.socket) return;
    const privateKeyHex = localStorage.getItem("gravity_chat_priv");
    if (!privateKeyHex) {
      if (this.onError) this.onError("Security Error: No identity found. Please re-login.");
      return;
    }
    try {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const messageToSign = content + timestamp;
      const signature = await this.signChallenge(messageToSign, privateKeyHex);
      this.socket.emit("send_message", {
        roomId,
        content,
        timestamp,
        signature
      });
    } catch (err) {
      console.error("Failed to sign message:", err);
      if (this.onError) this.onError("Failed to securely sign message.");
    }
  }
  joinRoom(roomId) {
    this.socket?.emit("join_room", roomId);
  }
  createDM(targetId) {
    this.socket?.emit("create_dm", targetId);
  }
  searchUsers(query) {
    this.socket?.emit("search_users", query);
  }
  inviteUser(roomId, user) {
    this.socket?.emit("invite_user", { roomId, targetUsername: user });
  }
  closeRoom(roomId) {
    this.socket?.emit("close_room", roomId);
  }
  kickUser(roomId, userId) {
    this.socket?.emit("kick_user", { roomId, targetUserId: userId });
  }
  banUser(roomId, userId) {
    this.socket?.emit("ban_user", { roomId, targetUserId: userId });
  }
  muteUser(roomId, userId) {
    this.socket?.emit("mute_user", { roomId, targetUserId: userId });
  }
  unmuteUser(roomId, userId) {
    this.socket?.emit("unmute_user", { roomId, targetUserId: userId });
  }
  logout() {
    localStorage.removeItem("gravity_chat_id");
    localStorage.removeItem("gravity_chat_username");
    localStorage.removeItem("gravity_chat_priv");
    localStorage.removeItem("gravity_chat_pub");
    this.userId = null;
    this.username = null;
    this.rooms = [];
    this.socket?.disconnect();
    this.socket = null;
  }
  handleNewMessage(roomId, message) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (room) {
      room.messages.push(message);
      if (this.onMessage) this.onMessage(roomId, message);
      if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
    }
  }
  getStoredPrivateKey() {
    return localStorage.getItem("gravity_chat_priv");
  }
  getStoredUsername() {
    return localStorage.getItem("gravity_chat_username");
  }
  handleUserStatusChange(userId, isOnline) {
    let updated = false;
    this.rooms.forEach((room) => {
      const member = room.memberDetails?.find((m) => m.id === userId);
      if (member) {
        member.isOnline = isOnline;
        updated = true;
      }
    });
    if (updated && this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
  }
}
const chatService = new ChatService();

export { broadcastSavingsDeposit as A, broadcastSavingsWithdraw as B, Chain as C, fetchAccountData as D, broadcastRCDelegate as E, broadcastRCUndelegate as F, broadcastBulkTransfer as G, validateUsername as H, validatePrivateKey as I, verifyKeyAgainstChain as J, validateAccountKeys as K, fetchAccountHistory as L, chatService as M, saveVault as N, fetchBalances as O, clearCryptoCache as P, getVault as Q, tryRestoreSession as R, detectWeb3Context as S, benchmarkNodes as T, ViewState as V, broadcastVote as a, broadcastTransfer as b, broadcastCustomJson as c, broadcastOperations as d, broadcastPowerUp as e, broadcastPowerDown as f, getChainConfig as g, broadcastDelegation as h, isChainSupported as i, isBiometricsAvailable as j, hasPinProtectedKey as k, getTOTPSecret as l, getInternalKey as m, initVaultWithGeneratedKey as n, loadInternalKeyWithPin as o, initVault as p, authenticateWithGoogle as q, authenticateWithDevice as r, signMessage as s, hasTOTPConfigured as t, unlockVault as u, verifyTOTP as v, generateSetup as w, saveTOTPSecret as x, enablePasswordless as y, registerBiometrics as z };
