import z from 'https://deno.land/x/zod@v3.21.4/index.ts';
import { AuthorCache } from '../cache/Author.ts';
import { ClientEventBase, event } from './mod.ts';

export type Author = ClientEventBase & { name: string };

const authorScheme = z.object({
  name: z.string(),
});

export default event(() => ({
  name: 'Author',
  kind: 0,
  run({ event, relay }) {
    const cache = AuthorCache.get<Author>(event.id);

    const parsed = authorScheme.safeParse(event.content);

    const newAuthorProfile: Author = {
      id: event.id,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: [relay],
      name: parsed.success ? parsed.data.name : event.pubkey,
    };

    if (cache) cache.relays.push(relay);

    AuthorCache.set(
      event.id,
      (cache?.createdAt || 0) <= newAuthorProfile.createdAt
        ? newAuthorProfile
        : cache
    );
  },
}));
