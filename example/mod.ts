import { Client } from '../src/mod.ts';

const client = new Client({});

client.on('ready', () => {
  console.log('ready');
});

console.log('ready');

client.on('message', (message) => {
  console.log('---');
  console.log(message);
});
