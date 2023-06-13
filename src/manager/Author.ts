import { ClientEventBase } from '../events/mod.ts';
import { ManagerBase } from './Base.ts';

export type Author = ClientEventBase & {
  name: string;
  icon: string;
  nip05?: string;
};

export class AuthorManager extends ManagerBase<Author> {
  constructor() {
    super();
  }
}
