# Tips — Solana entropy facade and price-time gate

Two ideas live here and must not be mixed up:

1. **Route** a randomness request to Pyth Entropy or Switchboard. Bodies are unsent.
2. **Accept a price** only when `publishTime` is strictly after `betTs`, and when fee and confidence bounds hold.

## Do

- Cap open requests and the fee range the tests lock.
- Fulfill once. Store the randomness before any payout formula.
- Compare `feedId` case-insensitively, then require an exact match.
- Refuse a price whose publish time is equal to the bet time (same rule as [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier)).

## Don't

- Treat `conf = 0` and `price = 0` as a production "tight" feed without a written policy.
- Reuse request ids.
- Claim Ed25519 or Switchboard attestation checks. This lab does not do them.
- Mark an unsent body as sent.

## Common mistakes

1. Using the price as the random number. Price is a market print. Randomness is a separate request.
2. Accepting a stale print because it is "close" to bet time.
3. Routing preferred and fallback to the same program id.
4. Porting this to WAX and skipping `orng.wax`.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Real Pyth pull / Switchboard verify | Needs the Solana program, not this TypeScript plan |
| Confidence as a fraction of price | New tests; do not silently change the zero-conf case |
| WAX bet settled by a Solana print | Oracle bridge threat model |

Related: [EVM facade](https://github.com/pixel-journey/px-rng-crosschain-evm-vrf-bridge) · [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [ORNG dual callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent)
