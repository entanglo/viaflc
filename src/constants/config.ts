export const POOL_URL: string = process.env.NEXT_PUBLIC_POOL_URL!;
export const POOL_FEE: string = process.env.NEXT_PUBLIC_POOL_FEE!;
export const SHARES_URL = process.env.NEXT_PUBLIC_SHARES_URL!;

export const MERGE_MINING_COINS = [
  { code: 'FLC', icon: '/img/flc.png', active: true },
  { code: 'DOGE', icon: '/img/doge.png', active: false },
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
  shareNote: { label: 'ShareNote', link: 'https://sharenote.xyz' }
};
