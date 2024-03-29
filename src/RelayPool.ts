import { Filter } from './Filter.ts';
import { parseEvent } from './NostrEvent.ts';
import { EventHandler } from './EventHandler.ts';
import { Client } from './Client.ts';
import { consola } from 'npm:consola';
import { Emitter } from 'npm:strict-event-emitter';

const makesubscription = <
  Type = 'REQ' | 'CLOSE' | 'NOTICE',
  SubscriptionId = string
>(
  type: Type,
  id: SubscriptionId,
  filter?: Filter
) => {
  const sub: [Type, SubscriptionId, Filter?] = [type, id];
  if (filter) sub.push(filter);
  return JSON.stringify(sub);
};

export class RelayPool extends Emitter<{
  message: [ReturnType<typeof parseEvent>];
}> {
  public relays = new Map<string, WebSocket>();
  private subscripitons = new Map<string, Filter>();
  private eventHandler: EventHandler;
  constructor(private client: Client, relays?: string[]) {
    super();
    this.eventHandler = new EventHandler(this.client);
    relays?.forEach((relayUrl) => {
      this.applyRelay(relayUrl);
    });
  }
  private applyRelay(relayUrl: string) {
    const ws = new WebSocket(relayUrl);
    ws.onopen = () => {
      this.relays.set(relayUrl, ws);
      this.subscripitons.forEach((filter, subscriptionId) => {
        ws.send(makesubscription('REQ', subscriptionId, filter));
      });
    };
    ws.onmessage = (messageEvent: MessageEvent<string>) => {
      const parsed = parseEvent(messageEvent.data);
      if (parsed) {
        const [type, id, event] = parsed;
        this.emit('message', parsed);
        switch (type) {
          case 'EVENT': {
            if (event) this.eventHandler.handle({ event, id, relay: relayUrl });
            break;
          }
          case 'EOSE': {
            this.subscripitons.delete(id);
            break;
          }
          case 'NOTICE':
            consola.info(`${relayUrl}: ${id}`);
            break;
        }
      }
    };
  }
  private sendRelays(
    type: 'REQ' | 'CLOSE',
    subscriptionId: string,
    filter?: Filter
  ) {
    this.relays.forEach((ws) => {
      ws.send(makesubscription(type, subscriptionId, filter));
    });
  }

  req(filter: Filter) {
    const alreadySub = [...this.subscripitons.entries()].find(([, value]) =>
      Object.is(value, filter)
    );
    if (alreadySub) return alreadySub[0];
    const subscriptionId = Math.random().toString(32).substring(2);
    this.subscripitons.set(subscriptionId, filter);
    this.sendRelays('REQ', subscriptionId, filter);
    return subscriptionId;
  }
  subscribe(filter: Filter) {
    const subid = this.req(filter);
    return new Promise((resolve, reject) => {
      const listener = (value: ReturnType<typeof parseEvent>) => {
        if (value) {
          const [, id] = value;
          if (id === subid) {
            this.unsubscribe(id);
            resolve(id);
            clearTimeout(timeout);
            this.off('message', listener);
          }
        }
      };
      const timeout = setTimeout(() => {
        this.unsubscribe(subid);
        reject();
        this.off('message', listener);
      }, 5000);
      this.on('message', listener);
    });
  }
  unsubscribe(subscriptionId: string) {
    this.sendRelays('CLOSE', subscriptionId);
  }
}
