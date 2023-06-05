import { Emitter } from 'npm:strict-event-emitter';
import { RelayPool } from './RelayPool.ts';

type Events = {
  ready: [];
  message: [MessageEvent];
};

export class Client extends Emitter<Events> {
  readonly pool: RelayPool;
  constructor(private options?: { relays?: string[] }) {
    super();

    this.pool = new RelayPool(this.options?.relays);

    const filter = { kinds: [1], limit: 1 };
    this.pool.subscribe(filter);

    this.pool.on('message', (event, relay) => {
      console.log(`${event}: ${relay}`);
      // this.emit('message', event);
    });
  }
}
