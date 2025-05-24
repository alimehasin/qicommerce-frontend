import { env } from "@/env";

export function constructApiUrl(path: string) {
  return `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api${path}`;
}

export function constructImageUrl(imagePath: string) {
  return `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/storage/${imagePath}`;
}
