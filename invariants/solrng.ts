/**
 * Cross-chain randomness facade pointed at Solana (educational).
 * Builds unsent request bodies for Pyth Entropy or Switchboard.
 * Does not sign, broadcast, or verify a live VRF proof.
 */

export const MAX_OPEN = 32;
export const MIN_FEE_LAMPORTS = 5_000n;
export const MAX_FEE_LAMPORTS = 50_000_000n;

export type Provider = "pyth-entropy" | "switchboard";

export type OpenRequest = {
  id: bigint;
  provider: Provider;
  /** 32-byte user seed, hex */
  userSeed: string;
  feeLamports: bigint;
  fulfilled: boolean;
};

export type UnsentRequest = {
  sent: false;
  chain: "solana";
  provider: Provider;
  program: "pyth-entropy" | "switchboard-on-demand";
  instruction: "request";
  data: {
    id: string;
    userSeed: string;
    feeLamports: string;
  };
};

const SEED = /^[0-9a-f]{64}$/i;

export function assertSeed(seed: string): string {
  if (!SEED.test(seed)) throw new Error("userSeed must be 64 hex chars");
  return seed.toLowerCase();
}

export function assertProvider(provider: Provider): Provider {
  if (provider !== "pyth-entropy" && provider !== "switchboard") {
    throw new Error("provider must be pyth-entropy or switchboard");
  }
  return provider;
}

export function assertFee(fee: bigint): bigint {
  if (typeof fee !== "bigint") throw new Error("fee must be bigint");
  if (fee < MIN_FEE_LAMPORTS) throw new Error("fee below minimum");
  if (fee > MAX_FEE_LAMPORTS) throw new Error("fee above maximum");
  return fee;
}

export function assertId(id: bigint): bigint {
  if (typeof id !== "bigint" || id < 1n) throw new Error("id must be a positive bigint");
  return id;
}

/**
 * Open a pending request and return an unsent body.
 * Does not transmit anything.
 */
export function requestRandomness(
  open: readonly OpenRequest[],
  id: bigint,
  provider: Provider,
  userSeed: string,
  feeLamports: bigint
): { open: OpenRequest[]; body: UnsentRequest } {
  assertId(id);
  assertProvider(provider);
  const seed = assertSeed(userSeed);
  assertFee(feeLamports);
  if (open.length >= MAX_OPEN) throw new Error("too many open requests");
  if (open.some((r) => r.id === id)) throw new Error("id already open");

  const row: OpenRequest = {
    id,
    provider,
    userSeed: seed,
    feeLamports,
    fulfilled: false,
  };
  const program = provider === "pyth-entropy" ? "pyth-entropy" : "switchboard-on-demand";
  return {
    open: [...open, row],
    body: {
      sent: false,
      chain: "solana",
      provider,
      program,
      instruction: "request",
      data: {
        id: id.toString(),
        userSeed: seed,
        feeLamports: feeLamports.toString(),
      },
    },
  };
}

/**
 * Record fulfillment once. Randomness is an opaque 32-byte hex stand-in.
 * This function does not verify a Pyth or Switchboard proof.
 */
export function fulfillOnce(
  open: readonly OpenRequest[],
  id: bigint,
  randomness: string
): OpenRequest[] {
  assertId(id);
  if (!SEED.test(randomness)) throw new Error("randomness must be 64 hex chars");
  const row = open.find((r) => r.id === id);
  if (!row) throw new Error("unknown request");
  if (row.fulfilled) throw new Error("already fulfilled");
  return open.map((r) => (r.id === id ? { ...r, fulfilled: true } : r));
}
