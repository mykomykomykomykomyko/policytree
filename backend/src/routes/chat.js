const express = require('express')
const router = express.Router()

// Get chat history
router.get('/history', async (req, res) => {
  try {
    // Get chat history from database
    // const history = await ChatHistory.find({ userId: req.user.id })
    
    // Sample data for development
    const history = [
      {
        id: 1,
        userId: 'user123',
        messages: [
          {
            id: 1,
            type: 'user',
            content: 'What are the remote work guidelines?',
            timestamp: '2023-08-15T10:00:00Z'
          },
          {
            id: 2,
            type: 'assistant',
            content: 'Based on our Remote Work Guidelines policy, employees are allowed to work remotely up to 3 days per week...',
            citations: [
              { id: 2, title: 'Remote Work Guidelines' }
            ],
            timestamp: '2023-08-15T10:00:05Z'
          }
        ]
      }
    ]

    res.json(history)
  } catch (error) {
    console.error('Chat history error:', error)
    res.status(500).json({ error: 'Error fetching chat history' })
  }
})

// Send message
router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body

    // Validate input
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Process message with AI
    const response = await processMessage(message, context)

    // Save to chat history
    // await saveToHistory(req.user.id, message, response)

    res.json(response)
  } catch (error) {
    console.error('Process message error:', error)
    res.status(500).json({ error: 'Error processing message' })
  }
})

// Process message with AI
async function processMessage(message, context = {}) {
  try {
    // Here you would integrate with OpenAI or other AI service
    // For now, return a mock response
    
    return {
      id: Date.now(),
      type: 'assistant',
      content: 'I understand your query about policies. Let me check the relevant documents...',
      citations: [
        { id: 1, title: 'HR Policy 2023' },
        { id: 2, title: 'Remote Work Guidelines' }
      ],
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('AI processing error:', error)
    throw error
  }
}

// Save message to history
async function saveToHistory(userId, message, response) {
  try {
    // Save to database
    // await ChatHistory.create({
    //   userId,
    //   messages: [message, response]
    // })
  } catch (error) {
    console.error('Save history error:', error)
    throw error
  }
}

module.exports = router 