import { event } from './mod.ts';

export type Reaction = [{ author: string; for: string }];

export default event(() => ({
  name: 'Reaction',
  kind: 7,
  run({ event, client, relay }) {
    client.emit('Reaction', {
      author: event.pubkey,
      for: 'tagのやつあとで',
    });
  },
}));
