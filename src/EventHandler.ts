import { NostrEvent } from './NostrEvent.ts';
import { walk } from 'https://deno.land/std@0.190.0/fs/walk.ts';
import { EventOptions } from './events/mod.ts';
import { Client } from './Client.ts';

export class EventHandler {
  private events = new Map<number, EventOptions[]>();
  constructor(private client: Client) {
    this.init();
  }
  private async init() {
    for await (const entry of walk(new URL('events', import.meta.url))) {
      if (entry.name.startsWith('@')) {
        if (entry.isFile) {
          const { default: file }: { default: EventOptions } = await import(
            entry.path
          );

          const current = this.events.get(file.kind);
          this.events.set(file.kind, current ? [...current, file] : [file]);
        }
      }
    }
  }
  handle({
    event,
    id,
    relay,
  }: {
    event: NostrEvent;
    id: string;
    relay: string;
  }) {
    if (!event) return;
    this.events.get(event.kind)?.forEach((value) => {
      value.run({ event, client: this.client, id, relay });
    });
  }
}
