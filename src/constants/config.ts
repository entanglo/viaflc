export const POOL_URL: string = process.env.NEXT_PUBLIC_POOL_URL!;
export const POOL_FEE: string = process.env.NEXT_PUBLIC_POOL_FEE!;
export const SHARES_URL = process.env.NEXT_PUBLIC_SHARES_URL!;
export const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL!;

export const SOCIAL_URLS: Record<string, string> = {
  github: 'https://github.com/entanglo/viaflc'
};

export const MERGE_MINING_COINS = [
  { code: 'LTC', icon: '/img/ltc.png', active: true },
  { code: 'DOGE', icon: '/img/doge.png', active: true },
  { code: 'BELLS', icon: '/img/bells.png', active: true },
  { code: 'PEP', icon: '/img/pep.png', active: true },
  { code: 'TRMP', icon: '/img/trmp.png', active: true }
];

// Merge Mining Coin Configurations
export const MERGE_COIN_VALIDATORS: Record<string, RegExp> = {
  // FLOKICOIN (FLC) validation is handled by flokicoinjs-lib
  LKY: /^[L][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
  CRC: /^[Q][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
  LTC: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/, // Legacy & P2SH
  DOGE: /^[D][a-km-zA-HJ-NP-Z1-9]{33}$/,
  DINGO: /^[D][a-km-zA-HJ-NP-Z1-9]{33}$/,
  JKC: /^[7][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
  PEP: /^[P][a-km-zA-HJ-NP-Z1-9]{33}$/,
  TRMP: /^[T][a-km-zA-HJ-NP-Z1-9]{33}$/,
  SHIC: /^[S][a-km-zA-HJ-NP-Z1-9]{33}$/,
  BELLS: /^bel1[a-z0-9]{39,59}$/
};

export const FAQ_LINKS: Record<string, { label: string; link: string }> = {
  discord: { label: '#mining on Discord', link: 'https://flokicoin.org/discord' },
  shareNote: { label: 'sharenote.xyz', link: 'https://sharenote.xyz' },
  wofDocs: { label: 'WoF paper', link: 'https://docs.flokicoin.org/wof' },
  twalletGuide: { label: 'tWallet guide', link: 'https://docs.flokicoin.org/wallets/twallet/v1' },
  sharenotePrintPlanner: {
    label: 'Sharenote Print Planner',
    link: 'https://sharenote.streamlit.app/Planner'
  },
  tWallet: { label: 'tWallet', link: 'https://docs.flokicoin.org/wallets/twallet/v1/' }
};
