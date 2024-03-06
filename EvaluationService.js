export async function evaluateAnswer(userMessage) {
    const openaiUrl = "https://api.openai.com/v1/engines/davinci/completions";
    const prompt = `The user's answer is: "${userMessage}". Evaluate the correctness and provide feedback.`;


    try {
        const response = await fetch(openaiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // Ensure this is defined in your environment variables
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.5,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                stop: ["\n"],
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].text.trim(); // Assuming the API returns a choice array with text responses
    } catch (error) {
        console.error("Failed to evaluate answer:", error);
        return "Error evaluating answer."; // Fallback response in case of an error
    }
}
