import { Filter } from './Filter.ts';
import { parseEvent } from './Event.ts';
import { EventHandler } from './EventHandler.ts';
import { Client } from './Client.ts';

const makesubscription = <Type = 'REQ' | 'CLOSE', SubscriptionId = string>(
  type: Type,
  id: SubscriptionId,
  filter?: Filter
) => {
  const sub: [Type, SubscriptionId, Filter?] = [type, id];
  if (filter) sub.push(filter);
  return JSON.stringify(sub);
};

export class RelayPool {
  public relays = new Map<string, WebSocket>();
  private subscripitons = new Map<Filter, string>();
  private eventHandler: EventHandler;
  constructor(private client: Client, relays?: string[]) {
    this.eventHandler = new EventHandler(this.client);
    relays?.forEach((relayUrl) => {
      this.applyRelay(relayUrl);
    });
  }
  private applyRelay(relayUrl: string) {
    const ws = new WebSocket(relayUrl);
    ws.onopen = () => {
      this.relays.set(relayUrl, ws);
      this.subscripitons.forEach((subscriptionId, filter) => {
        ws.send(makesubscription('REQ', subscriptionId, filter));
      });
    };
    ws.onmessage = (messageEvent: MessageEvent<string>) => {
      const parsed = parseEvent(messageEvent.data);
      if (parsed) {
        const [type, id, event] = parsed;
        switch (type) {
          case 'EVENT': {
            if (event) this.eventHandler.handle(event, relayUrl);
            break;
          }
          case 'EOSE': {
            const subscripiton = [...this.subscripitons.entries()].find(
              ([, value]) => value === id
            );
            if (subscripiton) {
              const [key] = subscripiton;
              this.subscripitons.delete(key);
            }
          }
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

  subscribe(filter: Filter) {
    const alreadySub = this.subscripitons.get(filter);
    if (alreadySub) return alreadySub;
    const subscriptionId = Math.random().toString(32).substring(2);
    this.subscripitons.set(filter, subscriptionId);
    this.sendRelays('REQ', subscriptionId, filter);
    return subscriptionId;
  }
  unsubscribe(filter: Filter) {
    const subscriptionId = this.subscripitons.get(filter);
    if (subscriptionId) {
      this.sendRelays('CLOSE', subscriptionId);
    }
  }
}
