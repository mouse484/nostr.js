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
  terminal.table(
    [
      ['author', event.author?.name || ''],
      ['content', event.content],
      ['relays', event.relays.join(',')],
    ],
    {
      width: 80,
      firstColumnTextAttr: { color: 'grey' },
    }
  );
});
