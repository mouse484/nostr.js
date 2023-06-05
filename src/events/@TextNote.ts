import { TextNoteCache } from '../cache/TextNote.ts';
import { ClientEventBase, event } from './mod.ts';

export type TextNote = ClientEventBase & { content: string };

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  run({ event, client, relay }) {
    const cache = TextNoteCache.get<TextNote>(event.id);

    const result: TextNote = {
      id: event.id,
      content: event.content,
      author: event.pubkey,
      relays: cache ? [...cache.relays, relay] : [relay],
    };

    TextNoteCache.set(event.id, result);
    client.emit('TextNote', result);
  },
}));
