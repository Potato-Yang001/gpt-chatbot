import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios'; // axois is a library to make HTTP requests for different types of APIs 

dotenv.config(); // Now all environment variables are accessible from process.env

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY

const app = express();
app.use(cors()); // My API can talk to other applications
app.use(express.json()); // My API can read JSON data from requests

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the URL where the server is running 
})
// console.log(`Your API key is: ${API_KEY}`); // Log the API key to verify it's loaded correctly

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body; // Extract the prompt from the request body
    // const prompt = req.body.prompt; -> Alternative way to extract the prompt 
    if (!prompt) { // If no prompt is provided, return an error
        return res.status(400).json({ error: 'Prompt is required' });
    }

    if (prompt.length > 300) {
        return res.status(400).json({ error: 'Prompt is too long. Maximum length is 300 characters.' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions',
            { // Make a POST request to the OpenAI API
                model: "gpt-4", // Specify the model to use
                messages: [
                    { role: "system", content: "You are Sigmund, a programming chatbot created by [ENTER YOUR NAME HERE], designed to answer only Sigma School or tech-related questions. Sigma School, based in Puchong, Selangor, Malaysia, offers Software Development bootcamps: online self-paced (RM9997), online full-time (RM14997, 3 months), and offline full-time (RM24997, 3 months), with monthly payment options. They provide a money-back guarantee if graduates fail to secure a job. The course includes 4 modules, 64 lessons, 100+ challenges, 10+ assessments, and 25 projects, emphasizing deconstructing and recreating clone projects. Accommodation assistance is also available." },
                    { role: "user", content: prompt } // Send the user's prompt as a message
                ],
                max_tokens: 10, // Limit the response to 10 tokens
            }, {
            headers:
            {
                'Content-Type': 'application/json', // Specify the content type
                Authorization: `Bearer ${API_KEY}`, // Include the API key in the authorization header
            },
        }
        )

        const { prompt_tokens, // Extract token usage details from the API response
            completion_tokens, // Tokens used in the prompt
            total_tokens // Total tokens used in the response
        } = response.data.usage; // is to contol token usage = the cost of using the API use less the will pay less
        response.data.usage;
        const reply = response.data.choices[0].message.content; // Extract the generated reply from the API response
        res.json({
            reply,
            token_usage: { prompt_tokens, completion_tokens, total_tokens }
        }); // Send the generated reply back to the client
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        res.status(500).json({ error: "Failed to fetch response from OpenAI API" });
    }
})