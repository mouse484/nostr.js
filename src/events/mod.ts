import { Client } from '../Client.ts';
import { NostrEvent } from '../NostrEvent.ts';
import { Author } from '../manager/Author.ts';
import { TextNote } from '../manager/TextNote.ts';

export type EventList = {
  TextNote: [TextNote];
  Author: [Author];
};

export type ClientEventBase = {
  id: string;
  pubkey: string;
  relays: string[];
  createdAt: Date;
};

export type EventOptions = {
  name: string;
  kind: number;
  run(context: {
    event: NostrEvent;
    client: Client;
    id: string;
    relay: string;
  }): void;
};

export const event = (method: () => EventOptions): EventOptions => {
  return method();
};
