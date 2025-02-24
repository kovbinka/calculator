exports.handler = async (event) => {
  const { input } = JSON.parse(event.body); // receive text from frontend

  try {
      const response = await fetch('https://api.together.xyz/inference', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${process.env.API_KEY}`, // MY KEY FROM NETLIFY
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
              prompt: `Provide a clear and accurate answer: ${input}`,
              max_tokens: 200,
              temperature: 0.3
          })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return {
          statusCode: 200,
          body: JSON.stringify({ answer: data.output?.choices[0]?.text || 'No answer' })
      };
  } catch (error) {
      return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
      };
  }
};