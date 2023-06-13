import { TextNote } from '../manager/TextNote.ts';
import { proxify } from '../proxify.ts';
import { event } from './mod.ts';

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  async run({ event, client, relay }) {
    const cache = client.$TextNote.get(event.id);
    await client.pool.subscribe({
      kinds: [0],
      limit: 1,
      authors: [event.pubkey],
    });
    const result: TextNote = {
      id: event.id,
      author: proxify(client.$Author, event.pubkey),
      content: event.content,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: cache ? [...cache.relays, relay] : [relay],
    };
    client.emit('TextNote', result);
    client.$TextNote.set(event.id, result);
  },
}));
