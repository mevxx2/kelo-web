/**
 * Deterministic seeded PRNG (mulberry32), shared by every decorative
 * particle field on the site (intro overlay, ambient section particles).
 *
 * Plain `Math.random()` would compute different values on the server render
 * and the client hydration pass, which React treats as a mismatch. Seeding
 * from a fixed number instead makes the "random" layout identical on both,
 * so particles never pop/shift on hydration.
 */
export function mulberry32(seed: number): () => number {
  let t = seed;
  return function random() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
