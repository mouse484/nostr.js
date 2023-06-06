import { TextNote } from '../manager/TextNote.ts';
import { event } from './mod.ts';

export default event(() => ({
  name: 'TextNote',
  kind: 1,
  run({ event, client, relay }) {
    const cache = client.$TextNote.get(event.id);
    // client.pool.req({
    //   kinds: [0],
    //   limit: 1,
    //   authors: [event.pubkey],
    // });
    const result: TextNote = {
      id: event.id,
      // author: new Proxy<Author>(
      //   {
      //     id: '',
      //     pubkey: '',
      //     createdAt: new Date(),
      //     relays: [],
      //     name: '',
      //   },
      //   {
      //     get(_, property: keyof Author) {
      //       return AuthorCache.get<Author>(event.pubkey)?.[property];
      //     },
      //   }
      // ),
      content: event.content,
      pubkey: event.pubkey,
      createdAt: new Date(event.created_at * 1000),
      relays: cache ? [...cache.relays, relay] : [relay],
    };
    // // TextNoteCache.set(event.id, result);
    client.emit('TextNote', result);
    client.$TextNote.set(event.id, result);
  },
}));
