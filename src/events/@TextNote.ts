import { TextNoteCache } from '../cache/TextNote.ts';
import { Author } from './@Author.ts';
import { ClientEventBase, event } from './mod.ts';

export type TextNote = ClientEventBase & { author: unknown; content: string };

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  run({ event, client, relay }) {
    const cache = TextNoteCache.get<TextNote>(event.id);

    client.pool.subscribe({ kinds: [0], limit: 1, authors: [event.pubkey] });

    const result: TextNote = {
      id: event.id,
      author: 'ここに上でsubしたやつ',
      content: event.content,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: cache ? [...cache.relays, relay] : [relay],
    };

    TextNoteCache.set(event.id, result);
    client.emit('TextNote', result);
  },
}));
