/* Human-readable booking references.

   Customers read these out on the phone, so the alphabet skips characters that
   are easy to confuse (0/O, 1/I) and the prefix makes the code recognisable in
   an inbox: JC-7K4M2Q. */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function bookingReference() {
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `JC-${out}`;
}
