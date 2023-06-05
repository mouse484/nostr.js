import { event } from './mod.ts';

export type TextNote = { id: string; content: string };

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  run({ event, client }) {
    client.emit('TextNote', { id: event.id, content: event.content });
  },
}));
