<p align="center">
  <img src="public/assets/logo.svg" alt="ViaFLC" width="600" />
</p>
ViaFLC is a Scrypt merge-mining pool designed for simple and clean onboarding.
This landing page highlights the Stratum connection flow and provides access to the Hashboard.

### Landing page Features

- Lightweight Next.js front end with MUI styling.
- Multilingual FAQ (English, 中文, Русский) stored in `src/constants/translations`.
- Configurable Stratum/fee data via environment variables.

### Quick start

```bash
yarn install
yarn dev  # http://localhost:3000
```

Set these variables in `.env.local` (or your shell) before running:

- `NEXT_PUBLIC_POOL_URL`
- `NEXT_PUBLIC_POOL_FEE`
- `NEXT_PUBLIC_SHARES_URL`

For production: `yarn build && yarn start`.

---

Contributions that improve onboarding copy, visuals, or localization are welcome. Run `yarn lint` before opening a PR.
