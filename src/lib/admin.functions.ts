import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Credentials read from env (with safe defaults for first boot). Configure via secrets:
//   ADMIN_EMAIL, ADMIN_PASSWORD
// The credential check happens server-side; the response is just an opaque session token.
const LoginInput = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => LoginInput.parse(d))
  .handler(async ({ data }) => {
    const email = process.env.ADMIN_EMAIL || "mahamulhasan38@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Ridoy007@#";
    const ok =
      timingSafeEqual(data.email.toLowerCase(), email.toLowerCase()) &&
      timingSafeEqual(data.password, password);
    if (!ok) {
      // Generic message — don't leak which field is wrong
      throw new Error("Invalid credentials");
    }
    // Opaque token, not a JWT — just a marker the client stores.
    const token =
      "adm_" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2);
    return { token };
  });
