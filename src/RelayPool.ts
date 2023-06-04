import { Emitter } from 'npm:strict-event-emitter';
import { Filter } from './filter.ts';

const makesubscription = <Type = 'REQ' | 'CLOSE', SubscriptionId = string>(
  type: Type,
  id: SubscriptionId,
  filter?: Filter
) => {
  const sub: [Type, SubscriptionId, Filter?] = [type, id];
  if (filter) sub.push(filter);
  return JSON.stringify(sub);
};

type Events = {
  message: [MessageEvent];
};

export class RelayPool extends Emitter<Events> {
  public relays = new Map<string, WebSocket>();
  private subscripitons = new Map<Filter, string>();
  constructor(relays: string[]) {
    super();

    relays.forEach((relayUrl) => {
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
    ws.onmessage = (event) => {
      this.emit('message', event);
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
