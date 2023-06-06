import { ClientEventBase } from '../events/mod.ts';
import { ManagerBase } from './Base.ts';

export type Author = ClientEventBase & { name: string };

export class AuthorManager extends ManagerBase<Author> {
  constructor() {
    super();
  }
}
