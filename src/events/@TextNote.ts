import { resolve } from 'https://deno.land/std@0.190.0/path/win32.ts';
import { TextNoteCache } from '../cache/TextNote.ts';
import { ClientEventBase, event } from './mod.ts';
import { Author } from './@Author.ts';

export type TextNote = ClientEventBase & { author: Author; content: string };

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  async run({ event, client, relay }) {
    const cache = TextNoteCache.get<TextNote>(event.id);

    const subid = client.pool.req({
      kinds: [0],
      limit: 1,
      authors: [event.pubkey],
    });

    const author = await new Promise<Author>((resolve) => {
      client.on('Author', (id, event) => {
        if (id === subid) resolve(event);
      });
    });

    const result: TextNote = {
      id: event.id,
      author: author,
      content: event.content,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: cache ? [...cache.relays, relay] : [relay],
    };

    TextNoteCache.set(event.id, result);
    client.emit('TextNote', result);
  },
}));
