# Sources

| Source | Use |
| --- | --- |
| [Pyth Entropy](https://docs.pyth.network/entropy) | On-chain randomness product this facade names |
| [Switchboard](https://docs.switchboard.xyz/) | Alternate backend |
| [Pyth price feeds](https://docs.pyth.network/price-feeds) | publishTime / confidence vocabulary |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | **Preferred** native WAX RNG |
| [docs.wax.io](https://docs.wax.io/) | Settlement chain docs |

This repository does not verify signatures and does not send transactions. Price print ≠ entropy request. `publishTime` must be **strictly after** `betTs` (same fairness idea as [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier)).

## Related labs

| Lab | Topic |
| --- | --- |
| [EVM VRF facade](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge) | orng vs Chainlink-style route |
| [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) | Post-bet time gate |
| [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) | Native WAX job table |
| [ORNG path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Section E fallbacks |
