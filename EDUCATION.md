# Education

Quest 017 routes `requestRandomness` to `orng.wax` or an EVM VRF consumer. Quest 018 is the **same idea** pointed at Solana:

| Provider | Program label in the unsent body |
|----------|----------------------------------|
| `pyth-entropy` | `pyth-entropy` |
| `switchboard` | `switchboard-on-demand` |

## What a future agent should not invent

- Do not mark `body.sent` true. Nothing was broadcast.
- Do not treat `fulfillOnce` as proof verification. A 64-hex string is a **stand-in** for 32 bytes of randomness, not a Pyth or Switchboard attestation.
- Do not reuse `orng.wax` action names (`requestrand`, `randnotify`, `receiverand`) for this quest. Those belong to the WAX oracle quests.
- Fee units are **lamports**, not WAX (8 decimals) and not LINK.

## Why the bounds exist

- **MAX_OPEN = 32** matches the sibling EVM facade so a stuck consumer cannot grow the table without bound.
- **Fee floor and cap** stop a zero-fee request and a fee large enough to drain a sponsor in one call.
- **Fulfill once** stops a replayed callback from paying twice. Pair this with `px-orng-dual-callback-idempotent` when two delivery paths exist.
