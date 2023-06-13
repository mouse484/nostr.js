import { Client } from '../src/Client.ts';
// @deno-types="npm:@types/terminal-kit"
import terminalKit from 'npm:terminal-kit';

const terminal = terminalKit.terminal;

const client = new Client({
  relays: [
    'wss://yabu.me',
    'wss://universe.nostrich.land?lang=ja',
    'wss://relay.damus.io',
  ],
});

client.on('TextNote', (event) => {
  console.log(event.author?.nip05);
  terminal.table(
    [
      ['author', event.author?.name || ''],
      ['nip05', event.author?.nip05 || ''],
      ['content', event.content],
      ['relays', event.relays.join(',')],
    ],
    {
      width: 80,
      firstColumnTextAttr: { color: 'grey' },
    }
  );
});
