import { handleScheduledEvent } from './ScheduledEvent.js';
import { handleRequest } from './RequestHandler.js';

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduledEvent());
});

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});