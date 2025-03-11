import axios from 'axios';

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api/ai',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Analyze document content
  async analyzeDocument(content) {
    try {
      const response = await this.api.post('/analyze', { content });
      return response.data;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }

  // Extract key information from document
  async extractInformation(content) {
    try {
      const response = await this.api.post('/extract', { content });
      return response.data;
    } catch (error) {
      console.error('Error extracting information:', error);
      throw error;
    }
  }

  // Generate summary of document
  async generateSummary(content) {
    try {
      const response = await this.api.post('/summarize', { content });
      return response.data;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  // Find related documents based on content
  async findRelatedDocuments(content) {
    try {
      const response = await this.api.post('/find-related', { content });
      return response.data;
    } catch (error) {
      console.error('Error finding related documents:', error);
      throw error;
    }
  }

  // Answer questions about document
  async askQuestion(question, context) {
    try {
      const response = await this.api.post('/ask', {
        question,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }
}

export default new AIService(); 