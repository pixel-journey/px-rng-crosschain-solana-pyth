# Education — cross-chain RNG request facade

Route a randomness request to Pyth Entropy or Switchboard as an **unsent** instruction shape, then gate an optional price update the same way a bet would require a post-bet publish time.

## Outcomes

1. Show bodies are never marked sent.
2. Show once-only fulfill.
3. Show publishTime must beat betTs.

Numbers: [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md).
