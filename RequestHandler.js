import { handleScheduledEvent } from './ScheduledEvent.js';
import { sendSlackMessage, evaluateAnswer } from './SlackService.js';

export async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname.endsWith('/test-callback')) {
    const requestBody = await request.json();

    if (requestBody.type === 'event_callback' && requestBody.event.type === 'message') {
      const userMessage = requestBody.event.text;
      const evaluationResult = await evaluateAnswer(userMessage);
      await sendSlackMessage(`Your evaluation: ${evaluationResult}`);
      return new Response('OK', { status: 200 });
    }

    if (requestBody.type === 'url_verification') {
      return new Response(requestBody.challenge, { status: 200 });
    }
  }

  return new Response('Expected POST with Slack event data', { status: 400 });
}
