const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Analyze document content
router.post('/analyze', async (req, res) => {
  try {
    const { content } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert policy analyst. Analyze the following document content and provide key insights, main topics, and potential implications."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    res.json({
      analysis: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ error: 'Error analyzing document' });
  }
});

// Extract key information
router.post('/extract', async (req, res) => {
  try {
    const { content } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract and structure key information from the following document content. Include dates, organizations, key terms, and important statements."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    res.json({
      information: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error extracting information:', error);
    res.status(500).json({ error: 'Error extracting information' });
  }
});

// Generate summary
router.post('/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Provide a concise summary of the following document content, highlighting the most important points."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    res.json({
      summary: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
});

// Find related documents
router.post('/find-related', async (req, res) => {
  try {
    const { content } = req.body;
    
    // TODO: Implement semantic search or document similarity
    // This would typically involve:
    // 1. Converting content to embeddings
    // 2. Searching vector database for similar documents
    // 3. Returning matches above similarity threshold

    res.json({
      relatedDocuments: []
    });
  } catch (error) {
    console.error('Error finding related documents:', error);
    res.status(500).json({ error: 'Error finding related documents' });
  }
});

// Answer questions
router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions about documents. Use the provided context to answer questions accurately."
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${question}`
        }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Error answering question' });
  }
});

module.exports = router; 