import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "api/src/trpc/router.js";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${(import.meta as any).env?.VITE_API_URL ?? ""}/trpc`,
    }),
  ],
});
