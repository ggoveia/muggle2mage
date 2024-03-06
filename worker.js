addEventListener('scheduled', event => {
    event.waitUntil(handleScheduledEvent());
  });
  
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  


  async function handleScheduledEvent() {

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

    // Send the lesson to Slack
    await sendSlackMessage(message);
  }
  
  async function handleRequest(request) {
    const url = new URL(request.url);
  
    // Check for the manual trigger endpoint
    // if (request.method === 'POST' && url.pathname.endsWith('/trigger-scheduled-event')) {
    //   console.log("test1");
    //   await handleScheduledEvent();
    //   return new Response('Scheduled event triggered successfully', { status: 200 });
    // }
  
    // Handle POST requests, likely from Slack
    if (request.method === "POST" && url.pathname.endsWith('/test-callback')) {
      const requestBody = await request.json();
  
      // Handle Slack event callbacks
      if (requestBody.type === 'event_callback' && requestBody.event.type === 'message') {
        const userMessage = requestBody.event.text; // Extract the text content
        const evaluationResult = await evaluateAnswer(userMessage); // Evaluate the answer
  
        // Respond to the user with the evaluation result in Slack
        await sendSlackMessage(`Your evaluation: ${evaluationResult}`);
    
        return new Response('OK', { status: 200 });
      }
  
      // Handle Slack URL verification challenge during setup
      if (requestBody.type === 'url_verification') {
        return new Response(requestBody.challenge, { status: 200 });
      }
    }
  
    // Fallback response for other cases
    return new Response('Expected POST with Slack event data', { status: 400 });
  }
  
  async function sendSlackMessage(message) {
    const webhookUrl = SLACK_WEBHOOK_URL; // Use the webhook URL from your environment variables
    const payload = {
      text: message, // The message text you want to send to Slack
    };
  
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    // Optionally, handle the response from Slack
    const responseData = await response.text(); // Slack webhook response is usually plain text
    console.log(responseData); // Log the response data for debugging
  }

  
  async function evaluateAnswer(userMessage) {
    const openaiUrl = "https://api.openai.com/v1/engines/davinci/completions"; // Adjust based on the specific API endpoint

    const prompt = `The user's answer is: "${userMessage}". Evaluate the correctness and provide feedback.`; // Customize your prompt
  
    const response = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // Corrected to use process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 150, // Adjust based on your needs
        temperature: 0.5, // Adjust for creativity of the response. Lower is more deterministic.
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"], // Define stopping conditions if necessary
      })
    });
  
    const data = await response.json();
  
    // Return the ChatGPT response or customize it based on your needs
   // return data.choices[0].text.trim();

    return "";
  }