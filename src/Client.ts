import { Emitter } from 'npm:strict-event-emitter';
import { RelayPool } from './RelayPool.ts';
import { EventList } from './events/mod.ts';
import { TextNoteManager } from './manager/TextNote.ts';
import { AuthorManager } from "./manager/Author.ts";

type Events = {
  ready: [];
} & EventList;

export class Client extends Emitter<Events> {
  readonly pool: RelayPool;
  $TextNote = new TextNoteManager();
  $Author = new AuthorManager();
  constructor(private options?: { relays?: string[] }) {
    super();

    this.pool = new RelayPool(this, this.options?.relays);

    const filter = { limit: 1 };
    this.pool.req(filter);
  }
}
