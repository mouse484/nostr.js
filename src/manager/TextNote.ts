import { ClientEventBase } from '../events/mod.ts';
import { Author } from "./Author.ts";
import { ManagerBase } from './Base.ts';

export type TextNote = ClientEventBase & {
  author: Author;
  content: string;
};

export class TextNoteManager extends ManagerBase<TextNote> {
  constructor() {
    super();
  }
}
