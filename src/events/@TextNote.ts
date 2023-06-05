import { TextNoteCache, TextNoteCacheType } from '../cache/TextNote.ts';
import { event } from './mod.ts';

export type TextNote = TextNoteCacheType;

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  run({ event, client, relay }) {
    const cache = TextNoteCache.get<TextNoteCacheType>(event.id);

    const result: TextNoteCacheType = cache
      ? [event, [...cache[1], relay]]
      : [event, [relay]];

    TextNoteCache.set(event.id, result);
    client.emit('TextNote', event, result[1]);
  },
}));
