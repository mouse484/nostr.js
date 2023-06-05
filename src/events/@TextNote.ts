import { AuthorCache } from '../cache/Author.ts';
import { TextNoteCache } from '../cache/TextNote.ts';
import { Author } from './@Author.ts';
import { ClientEventBase, event } from './mod.ts';

export type TextNote = ClientEventBase & { author: Author; content: string };

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  async run({ event, client, relay }) {
    const cache = TextNoteCache.get<TextNote>(event.id);

    client.pool.req({
      kinds: [0],
      limit: 1,
      authors: [event.pubkey],
    });

    const result: TextNote = {
      id: event.id,
      author: new Proxy<Author>(
        {
          id: '',
          pubkey: '',
          createdAt: new Date(),
          relays: [],
          name: '',
        },
        {
          get(_, property: keyof Author) {
            return AuthorCache.get<Author>(event.pubkey)?.[property];
          },
        }
      ),
      content: event.content,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: cache ? [...cache.relays, relay] : [relay],
    };

    TextNoteCache.set(event.id, result);
    client.emit('TextNote', result);
  },
}));
