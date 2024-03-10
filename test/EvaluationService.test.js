import fetchMock from 'fetch-mock-jest';
import { evaluateAnswer } from '../EvaluationService.js';

global.fetch = fetchMock.sandbox(); // Replace global fetch with fetch-mock

describe('evaluateAnswer in EvaluationService', () => {
  afterEach(() => {
    fetchMock.reset(); // Reset fetch mocks after each test
  });

  it('returns the evaluated text on a successful API call', async () => {
    // Mock the OpenAI API response
    const mockResponse = {
      choices: [
        {
          text: "This is a test evaluation.",
        },
      ],
    };

    // Use global.fetch mock to simulate the API response
    global.fetch.mock(
      'https://api.openai.com/v1/engines/davinci/completions',
      JSON.stringify(mockResponse)
    );

    const userMessage = "Test message";
    const result = await evaluateAnswer(userMessage);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: '{"prompt":"The user\'s answer is: \\"Test message\\". Evaluate the correctness and provide feedback.","max_tokens":150,"temperature":0.5,"top_p":1,"frequency_penalty":0,"presence_penalty":0,"stop":["\\n"]}',
      }
    );

    expect(result).toEqual("This is a test evaluation.");
  });


  it('returns an error message on a failed API call', async () => {
    // Mock a failed API response
    fetchMock.postOnce("https://api.openai.com/v1/engines/davinci/completions", {
      throws: new Error('Fake error message'),
    });

    const userMessage = "Test message";
    const result = await evaluateAnswer(userMessage);

    // Expect an error message to be returned
    expect(result).toEqual("Error evaluating answer.");
  });
});
