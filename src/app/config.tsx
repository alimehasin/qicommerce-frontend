"use client";

import { env } from "@/env";
import { deleteToken } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export function Config({ token }: { token?: string }) {
  useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        await deleteToken();
      }

      return null;
    },
  });

  return <div />;
}
