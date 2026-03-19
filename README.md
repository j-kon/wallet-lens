# WalletLens

## Overview
WalletLens is a Bitcoin testnet explorer focused on wallet-level insights. It provides detailed visibility into address balances, UTXOs, transaction flow, and network conditions through a clean developer-focused interface.

## Why I Built This
I built WalletLens to make wallet inspection more intentional than what traditional block explorers usually offer. Instead of treating addresses and transactions as isolated records, the app is designed around how wallet developers actually reason about the Bitcoin UTXO model: balance composition, spendable outputs, transaction direction, fee posture, and live network context.

It is also a practical way to study Bitcoin wallet infrastructure from a product perspective. The goal was to build something cleaner, more focused, and more navigable than a generic explorer while still remaining technically honest to Esplora data.

## Features
- Universal search for Bitcoin testnet addresses and transaction ids
- Address inspection with wallet summary, metadata, and persisted last search
- Transaction analysis with vin/vout detail, fee posture, raw hex toggle, and routeable tx pages
- UTXO breakdown with spendable output insights and largest-output highlighting
- Fee estimates with fast, medium, and slow confirmation bands
- Mempool insights with queue depth, vsize, total fees, and histogram preview
- Block exploration with block metadata, chain context, and transaction preview
- Internal explorer routing for address, transaction, and block navigation

## Tech Stack
- React
- Tailwind CSS
- Framer Motion
- React Router
- Blockstream Esplora API
- Vite

## Live Demo
Placeholder: add your deployed WalletLens URL here after release.

## Screenshots
Placeholder: add product screenshots here.

Suggested captures:
- Home dashboard with address summary and telemetry
- Dedicated transaction page
- Dedicated block page
- Mobile layout

## How to Run Locally
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

## Deployment
WalletLens is configured for SPA hosting on Vercel via `vercel.json`, so deep links like `/address/:address`, `/tx/:txid`, and `/block/:blockId` rewrite back to `index.html` instead of returning a 404 on refresh.

Before publishing:
- deploy the Vite build output
- confirm SPA rewrites are enabled on your host
- verify route refreshes on address, transaction, and block pages

## Future Improvements
- Lightning and layered network visibility
- deeper wallet analytics and address clustering experiments
- richer block inspection and paginated block transactions
- stronger automated testing around routing and data normalization
- performance optimization for very active addresses
