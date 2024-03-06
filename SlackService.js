export async function sendSlackMessage(message) {
    const webhookUrl = SLACK_WEBHOOK_URL; // Ensure this is defined in your environment variables
    const payload = { text: message };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.text();
        console.log("Slack response:", responseData); // Logging Slack's response for debugging
    } catch (error) {
        console.error("Failed to send message to Slack:", error);
    }
}
