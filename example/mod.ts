import { Client } from '../src/Client.ts';

const client = new Client({
  relays: [
    'wss://yabu.me',
    'wss://universe.nostrich.land',
    'wss://relay.damus.io',
  ],
});

client.on('ready', () => {
  console.log('ready');
});

client.on('TextNote', (event) => {
  console.log(event.content);
});
