import axios from "axios"
//import { text } from "express"
import { useState } from "react"
import './App.css'

export default function App() {

  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState([])
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('');
    setMessages
    //setResponse('');
    try {
      {/* hv 2 thing =                           url and              actual object*/ }
      const response = await axios.post('http://localhost:3000/api/generate', { prompt })
      const data = response.data

      if (data.reply) {
        const aiMessage = { text: data.reply, sender: 'ai' }
        const userMessage = { text: prompt, sender: "user" }
        setMessages([...messages, userMessage, aiMessage]);
        setPrompt("");
      } else {
        throw new Error("Unexpended response format from server")
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  }

  return (
    <div className="container">
      <div className="row col-lg-12 text-center">
        <div className="header-container">
          <h1 className="text-center my-4">Sigmund</h1>
          <p>The Sigma School chatbot</p>
        </div>
        <div className="row col-lg-12">
          <div className="chat-container">
            {messages.map((message, index) => {
              {/* Loop through each message in the messages array and display it */ }
              return (
                <div key={index} /* Use the index as a key for each message */
                  className={`message-bubble ${message.sender}`}> {/* Add a class based on the sender (user or ai) for styling */}
                  {message.text}
                </div>)
            })}
          </div>
          <form className="form-container" onSubmit={handleSubmit}>  {/* When the form is submitted, call the handleSubmit function */}
            <input type="text"
              placeholder="Type your message"
              className="form-control row"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <br />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
        {/*response && <div className="mt-4 alert alert-success">{response}</div>*/}
        {error && <div className="mt-4 alert alert-danger">{error}</div>}
      </div>
    </div>
  )
}