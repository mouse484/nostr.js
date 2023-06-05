import { Client } from '../src/Client.ts';

const client = new Client({
  relays: [
    'wss://yabu.me',
    'wss://universe.nostrich.land?lang=ja',
    'wss://relay.damus.io',
  ],
});

client.on('ready', () => {
  console.log('ready');
});

// client.on('TextNote', (event, relay) => {
//   console.log(`${relay}
// ${event.content}
// ---------`);
// });
