<p align="center">
  <img src="public/assets/logo.png" alt="ViaFLC Logo" />
</p>

# Scrypt Merge Mining Pool

ViaFLC is a transparent, account‑free mining pool focused on simplicity and higher earnings through merge mining. Configure your miner once to earn FLC as the base reward while simultaneously collecting compatible Scrypt coins. Every submitted share and payout can be tracked using the ShareNote specification, which provides portable, verifiable records published via relays. Learn more at https://sharenote.xyz.

## How It Works

- Point your miner to the ViaFLC Stratum endpoint using your wallet address as the username.
- Mine FLC as the base coin; compatible Scrypt coins are added automatically via merge mining.
- Shares are accounted with PPLNS; rewards are paid after block discovery and network maturity.
- Track activity by entering your wallet address in the app to connect our shareNote relay for real‑time events.

## Quick Connect

- Stratum URL: `stratum+tcp://pool.viaflc.com:1233`
- Username: `yourAddress.workerName`
- Password: `x` (or any)

Example:

```
-o stratum+tcp://pool.viaflc.com:1233 -u YOURADDRESS.miner1 -p x
```

## Pool Parameters

- Algorithm: Scrypt
- Pool Fee: 1%
- Payout Scheme: PPLNS (rewards proportional to your valid shares within the window)

## Merge‑Mined Coins

Earn multiple coins with one setup:

FLC, DOGE, PEP, JKC, SHIC, LKY, DINGO, CAT, GLC, AUR, CRC

## Developers (optional)

Requirements: Node.js 18+, Yarn or npm

Install and run:

```
yarn install
yarn dev
# http://localhost:3000
```

Production build:

```
yarn build && yarn start
```

Environment (optional):

```
NEXT_PUBLIC_POOL_URL
NEXT_PUBLIC_POOL_FEE
NEXT_PUBLIC_SHARES_URL
```
