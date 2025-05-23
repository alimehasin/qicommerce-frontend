"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "token";

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_KEY, token);
}
