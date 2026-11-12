# Official sources

| Source | Use |
| --- | --- |
| [Pyth Network](https://docs.pyth.network/) | Price feeds and Entropy (conceptual) |
| [Switchboard](https://docs.switchboard.xyz/) | On-demand randomness / oracles (conceptual) |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Preferred **WAX-native** randomness |
| [docs.wax.io](https://docs.wax.io/) | WAX development |

Bodies are **unsent**. Proofs and price signatures are **not** verified here.

## Domain map

| Repo | Role |
| --- | --- |
| ORNG domain | WAX-native path |
| [px-rng-crosschain-evm-vrf-bridge](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge) | EVM VRF routing |
| **This repo** | Solana Pyth Entropy / Switchboard facade + price gate |
