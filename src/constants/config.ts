export const POOL_URL: string = process.env.NEXT_PUBLIC_POOL_URL!;
export const POOL_FEE: string = process.env.NEXT_PUBLIC_POOL_FEE!;
export const SHARES_URL = process.env.NEXT_PUBLIC_SHARES_URL!;

export const SOCIAL_URLS: Record<string, string> = {
  github: 'https://github.com/entanglo/viaflc'
};

export const MERGE_MINING_COINS = [
  { code: 'FLC', icon: '/img/flc.png', active: true },
  { code: 'DOGE', icon: '/img/doge.png', active: false },
  //{ code: 'DOGE', icon: '/img/doge.png', active: false, mergeProgress: 0 },
  { code: 'PEP', icon: '/img/pep.png', active: false },
  { code: 'JKC', icon: '/img/jkc.png', active: false },
  { code: 'SHIC', icon: '/img/shic.png', active: false },
  { code: 'LKY', icon: '/img/lky.png', active: false },
  { code: 'DINGO', icon: '/img/dingo.png', active: false },
  { code: 'CAT', icon: '/img/cat.png', active: false },
  { code: 'GLC', icon: '/img/glc.png', active: false },
  { code: 'AUR', icon: '/img/aur.png', active: false },
  { code: 'CRC', icon: '/img/crc.png', active: false }
];

export const FAQ_LINKS: Record<string, { label: string; link: string }> = {
  discord: { label: '#mining on Discord', link: 'https://flokicoin.org/discord' },
  shareNote: { label: 'sharenote.xyz', link: 'https://sharenote.xyz' },
  wofDocs: { label: 'WoF paper', link: 'https://docs.flokicoin.org/wof' },
  twalletGuide: { label: 'tWallet guide', link: 'https://docs.flokicoin.org/wallets/twallet/v1' }
};
