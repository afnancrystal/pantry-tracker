import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ingredients } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', 
        messages: [
          {
            role: 'user',
            content: `Suggest one succint recipe based on one or more of these ingredients: ${ingredients}. It should be in bullet points and there should be a proper ending to the sentences.`,
          },
        ],
        max_tokens: 100,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      // Get the raw response string
      const recipesString = response.data.choices[0].message.content;

      // Log the fetched recipes
      console.log('Fetched recipes:', recipesString);
      
      // Send the raw string back in the response
      res.status(200).json({ recipes: recipesString });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching recipes' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}