import { Emitter } from 'npm:strict-event-emitter';
import { RelayPool } from './RelayPool.ts';

type Events = {
  ready: [];
  message: [MessageEvent];
};

export class Client extends Emitter<Events> {
  constructor(private options?: { relays?: string[] }) {
    super();

    const pool = new RelayPool([
      'wss://yabu.me',
      'wss://universe.nostrich.land',
      'wss://relay.damus.io',
    ]);

    const filter = { kinds: [1], limit: 1 };
    pool.subscribe(filter);

    pool.on('message', (event, relay) => {
      console.log(`${event}: ${relay}`);
      // this.emit('message', event);
    });
  }
}
