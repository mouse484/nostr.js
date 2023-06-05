import { Client } from '../Client.ts';
import { NostrEvent } from '../NostrEvent.ts';
import { Author } from './@Author.ts';
import { Reaction } from './@Reaction.ts';
import type { TextNote } from './@TextNote.ts';

export type EventList = {
  TextNote: [TextNote];
  Reaction: Reaction;
  Author: [string, Author];
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
