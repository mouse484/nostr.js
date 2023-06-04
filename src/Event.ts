import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts';

export const eventScheme = z.object({
  id: z.string(),
  pubkey: z.string(),
  created_at: z.number().int(),
  kind: z.number().int(),
  tags: z.array(z.array(z.string())),
  content: z.string(),
  sig: z.string(),
});

export const parseEvent = (event: string) => {
  const scheme = z
    .tuple([z.literal('EOSE').or(z.literal('NOTICE')), z.string()])
    .or(z.tuple([z.literal('EVENT'), z.string(), eventScheme.nullish()]));
  const parsed = scheme.safeParse(JSON.parse(event));
  if (parsed.success) {
    return parsed.data;
  }
};
