import NodeCache from 'npm:node-cache';
import { NostrEvent } from "../Event.ts";

export type TextNoteCacheType = [NostrEvent, string[]];

export const TextNoteCache = new NodeCache();
