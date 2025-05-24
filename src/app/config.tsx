"use client";

import { deleteToken } from "@/server/actions";
import { constructApiUrl } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";

export function Config({ token }: { token?: string }) {
  useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await fetch(constructApiUrl("/profile"), {
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
