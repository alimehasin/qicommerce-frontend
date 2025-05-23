import { env } from "@/env";

export function constructImageUrl(imagePath: string) {
  return `${env.NEXT_PUBLIC_STORAGE_BASE_URL}/${imagePath}`;
}
