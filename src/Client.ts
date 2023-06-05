import { Emitter } from 'npm:strict-event-emitter';
import { RelayPool } from './RelayPool.ts';
import { EventList } from './events/mod.ts';

type Events = {
  ready: [];
} & EventList;

export class Client extends Emitter<Events> {
  readonly pool: RelayPool;
  constructor(private options?: { relays?: string[] }) {
    super();

    this.pool = new RelayPool(this, this.options?.relays);

    const filter = { limit: 1 };
    this.pool.subscribe(filter);
  }
}
