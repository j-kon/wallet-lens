export const SAMPLE_TESTNET_ADDRESS = 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gd';

const TIP_HEIGHT = 2_867_458;

const TXIDS = {
  inboundSeed: '4d9f2d13f8a77cb51a1f8315f7f4993b28a3b1c2ea9b58d47fba1f0a1b8e16d2',
  rebalance: '98ac0b34d8f1e2ab6410c2f99ae34ccf2158a16fa29de3340f5a71d50a1f4b8c',
  inboundTopUp: 'a14d0ecf92ab73f18480c1d5c37e6bb5a22f4de88cb9713ae197cb7d5094afc2',
  payoutSplit: 'c92ab40ff139dd7a14d5ce90ab34f67c521de84fc11a950b73f2ae95d0c1bb64',
  mempoolSpend: 'ef85dc63a71b0cf4582de94bcf10a57dd20b16e57c8fa21390ce7f4d1ab3468f',
};

const MOCK_WALLET_SNAPSHOT = {
  source: 'mock',
  address: SAMPLE_TESTNET_ADDRESS,
  requestedAddress: SAMPLE_TESTNET_ADDRESS,
  network: 'Testnet',
  tipHeight: TIP_HEIGHT,
  summary: {
    balance: 3_235_000,
    confirmedBalance: 4_085_200,
    pendingBalance: -850_200,
    totalReceived: 8_395_200,
    totalSent: 5_160_200,
    transactionCount: 5,
    confirmedTransactions: 4,
    pendingTransactions: 1,
  },
  transactions: [
    {
      txid: TXIDS.mempoolSpend,
      version: 2,
      locktime: 0,
      size: 187,
      weight: 748,
      vsize: 187,
      fee: 900,
      feeRate: 4.81,
      direction: 'outgoing',
      sentValue: 2_760_200,
      receivedValue: 1_910_000,
      netValue: -850_200,
      status: {
        confirmed: false,
      },
      confirmations: 0,
      vin: [
        {
          txid: TXIDS.rebalance,
          vout: 1,
          is_coinbase: false,
          sequence: 4_294_967_293,
          prevout: {
            scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
            scriptpubkey_type: 'v0_p2wpkh',
            value: 810_200,
          },
        },
        {
          txid: TXIDS.inboundTopUp,
          vout: 0,
          is_coinbase: false,
          sequence: 4_294_967_293,
          prevout: {
            scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
            scriptpubkey_type: 'v0_p2wpkh',
            value: 1_950_000,
          },
        },
      ],
      vout: [
        {
          scriptpubkey_address: 'tb1qpy8g4dyt9em9c58ku84g0k55cs2m4svr4skprn',
          scriptpubkey_type: 'v0_p2wpkh',
          value: 849_300,
        },
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 1_910_000,
        },
      ],
    },
    {
      txid: TXIDS.payoutSplit,
      version: 2,
      locktime: 0,
      size: 212,
      weight: 552,
      vsize: 138,
      fee: 680,
      feeRate: 4.93,
      direction: 'incoming',
      sentValue: 0,
      receivedValue: 1_325_000,
      netValue: 1_325_000,
      status: {
        confirmed: true,
        block_height: 2_867_454,
        block_time: 1_773_870_420,
      },
      confirmations: 5,
      vin: [
        {
          txid: '51ad7ec38b0f92cc1e0674dbce390abf1547fc18e63cd2ab7f0ef4ad9046b8d1',
          vout: 0,
          is_coinbase: false,
          sequence: 4_294_967_293,
          prevout: {
            scriptpubkey_address: 'tb1quq7w3yxy7u2n2e0k8j2twyz3a2xrnqzjc8fyqv',
            scriptpubkey_type: 'v0_p2wpkh',
            value: 1_325_680,
          },
        },
      ],
      vout: [
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 1_280_000,
        },
        {
          scriptpubkey_address: 'tb1qrxvn0p7gsgdxts5tcql8lm0r3esgxcm60g6nx8',
          scriptpubkey_type: 'v0_p2wpkh',
          value: 680,
        },
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 45_000,
        },
      ],
    },
    {
      txid: TXIDS.inboundTopUp,
      version: 2,
      locktime: 0,
      size: 223,
      weight: 564,
      vsize: 141,
      fee: 720,
      feeRate: 5.11,
      direction: 'incoming',
      sentValue: 0,
      receivedValue: 1_950_000,
      netValue: 1_950_000,
      status: {
        confirmed: true,
        block_height: 2_867_449,
        block_time: 1_773_869_760,
      },
      confirmations: 10,
      vin: [
        {
          txid: 'a3dff09b74c18ee3c915cdcf06adf38f5f17ab82ce0bf4413e50dc2e78ad1ca4',
          vout: 1,
          is_coinbase: false,
          sequence: 4_294_967_294,
          prevout: {
            scriptpubkey_address: 'tb1q2u85ekzlrnzh5s5vs2eypc9ch4yl8zj5m00ldm',
            scriptpubkey_type: 'v0_p2wpkh',
            value: 1_950_720,
          },
        },
      ],
      vout: [
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 1_950_000,
        },
      ],
    },
    {
      txid: TXIDS.rebalance,
      version: 2,
      locktime: 0,
      size: 223,
      weight: 892,
      vsize: 223,
      fee: 800,
      feeRate: 3.59,
      direction: 'outgoing',
      sentValue: 2_400_000,
      receivedValue: 810_200,
      netValue: -1_589_800,
      status: {
        confirmed: true,
        block_height: 2_867_438,
        block_time: 1_773_867_940,
      },
      confirmations: 21,
      vin: [
        {
          txid: TXIDS.inboundSeed,
          vout: 0,
          is_coinbase: false,
          sequence: 4_294_967_293,
          prevout: {
            scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
            scriptpubkey_type: 'v0_p2wpkh',
            value: 2_400_000,
          },
        },
      ],
      vout: [
        {
          scriptpubkey_address: 'tb1q4tyaz3f2x0n3aznv4mejdhj8h8dps7g6sxmatl',
          scriptpubkey_type: 'v0_p2wpkh',
          value: 1_589_000,
        },
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 810_200,
        },
      ],
    },
    {
      txid: TXIDS.inboundSeed,
      version: 2,
      locktime: 0,
      size: 226,
      weight: 904,
      vsize: 226,
      fee: 612,
      feeRate: 2.71,
      direction: 'incoming',
      sentValue: 0,
      receivedValue: 2_400_000,
      netValue: 2_400_000,
      status: {
        confirmed: true,
        block_height: 2_867_424,
        block_time: 1_773_865_520,
      },
      confirmations: 35,
      vin: [
        {
          txid: '09be6f90ad11c527d823b0a7f9a4d5d56ab83f95aa8b6e847f100ddc4a28ed71',
          vout: 0,
          is_coinbase: false,
          sequence: 4_294_967_294,
          prevout: {
            scriptpubkey_address: 'tb1qfyd54kt9yh0k6wqf9l3azvhj0c2s5jlwmcmehc',
            scriptpubkey_type: 'v0_p2wpkh',
            value: 2_400_612,
          },
        },
      ],
      vout: [
        {
          scriptpubkey_address: SAMPLE_TESTNET_ADDRESS,
          scriptpubkey_type: 'v0_p2wpkh',
          value: 2_400_000,
        },
      ],
    },
  ],
  utxos: [
    {
      txid: TXIDS.mempoolSpend,
      vout: 1,
      value: 1_910_000,
      status: {
        confirmed: false,
      },
      confirmations: 0,
    },
    {
      txid: TXIDS.payoutSplit,
      vout: 0,
      value: 1_280_000,
      status: {
        confirmed: true,
        block_height: 2_867_454,
        block_time: 1_773_870_420,
      },
      confirmations: 5,
    },
    {
      txid: TXIDS.payoutSplit,
      vout: 2,
      value: 45_000,
      status: {
        confirmed: true,
        block_height: 2_867_454,
        block_time: 1_773_870_420,
      },
      confirmations: 5,
    },
  ],
};

export function getMockWalletSnapshot() {
  return JSON.parse(
    JSON.stringify({
      ...MOCK_WALLET_SNAPSHOT,
      lastUpdatedAt: new Date().toISOString(),
    }),
  );
}
