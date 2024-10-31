import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ingredients } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', // or the model you're using
        messages: [
          {
            role: 'user',
            content: `Suggest one succint recipe based on these ingredients: ${ingredients}`,
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


// import axios from 'axios';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { ingredients } = req.body;

//     try {
//       const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//         model: 'gpt-3.5-turbo', // or the model you're using
//         messages: [
//           {
//             role: 'user',
//             content: `Suggest one recipe based on these ingredients: ${ingredients}`,
//           },
//         ],
//         max_tokens: 100,
//       }, {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const recipesString = response.data.choices[0].message.content;
//       const recipesArray = recipesString.split('\n').map((item) => {
//         const parts = item.split(':'); // Assuming title and description are separated by ':'
//         return {
//           title: parts[0]?.trim() || 'Untitled',
//           description: parts[1]?.trim() || 'No description available',
//         };
//       }).filter(recipe => recipe.title); // Filter out any empty entries
      
//       console.log('Fetched recipes:', recipesArray);
//       res.status(200).json({ recipes: recipesArray });
      
//       res.status(200).json({ recipes }); // Ensure this matches your frontend expectations
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error fetching recipes' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
