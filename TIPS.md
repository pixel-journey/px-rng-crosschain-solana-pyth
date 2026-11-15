# Tips — Solana RNG facade

## Do

- Cap open requests and fee range.  
- Fulfill once; store randomness before payout math.  
- For any price-tied bet, require publishTime **after** betTs.  
- Treat feedId as case-insensitive but exact match otherwise.

## Don't

- Accept conf=0 / price=0 as a tight confidence in production without explicit policy.  
- Reuse request ids.  
- Assume this lab verifies Ed25519 or switchboard attestations — it does not.

## Related

[EVM facade](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge) · [drand gate](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [ORNG dual callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent)
