import { sendSlackMessage } from './SlackService.js';
import { m2mKV } from './StorageService.js'; // Assuming you have a module for KV storage interactions

export async function handleScheduledEvent() {
  let lessonDataJSON;

  if (IS_LOCAL === "true") {
    lessonDataJSON = '{"title":"Write Hello World in JavaScript","description":"Your task is to write a simple JavaScript program that prints \'Hello World\' to the console."}';
  } else {
    lessonDataJSON = await m2mKV.get("Lesson1");
  }

  if (!lessonDataJSON) {
    console.error("Failed to retrieve lesson data from KV");
    return;
  }
  const lessonData = JSON.parse(lessonDataJSON);
  const message = `${lessonData.title}: ${lessonData.description}`;

  console.log(message);

  await sendSlackMessage(message);
}
