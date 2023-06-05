import { Client } from '../Client.ts';
import { NostrEvent } from '../Event.ts';
import type { TextNote } from './@TextNote.ts';

export type EventList = {
  TextNote: [TextNote];
};

export type EventOptions = {
  name: string;
  kind: number;
  run(context: { event: NostrEvent; client: Client }): void;
};

export const event = (method: () => EventOptions): EventOptions => {
  return method();
};
