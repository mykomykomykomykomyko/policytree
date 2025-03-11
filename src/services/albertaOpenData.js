import axios from 'axios';

const ALBERTA_OPEN_DATA_API = 'https://open.alberta.ca/api/3';

class AlbertaOpenDataService {
  constructor() {
    this.api = axios.create({
      baseURL: ALBERTA_OPEN_DATA_API,
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  // Search for documents in the Open Data Portal
  async searchDocuments(query, options = {}) {
    try {
      const params = {
        q: query,
        rows: options.limit || 10,
        start: options.offset || 0,
        sort: options.sort || 'score desc'
      };

      const response = await this.api.get('/action/package_search', { params });
      return response.data.result;
    } catch (error) {
      console.error('Error searching Alberta Open Data:', error);
      throw error;
    }
  }

  // Get document details by ID
  async getDocumentById(id) {
    try {
      const response = await this.api.get(`/action/package_show?id=${id}`);
      return response.data.result;
    } catch (error) {
      console.error('Error fetching document details:', error);
      throw error;
    }
  }

  // Get document resources (actual files/data) by document ID
  async getDocumentResources(id) {
    try {
      const document = await this.getDocumentById(id);
      return document.resources || [];
    } catch (error) {
      console.error('Error fetching document resources:', error);
      throw error;
    }
  }

  // Download a resource file
  async downloadResource(url) {
    try {
      const response = await axios.get(url, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw error;
    }
  }
}

export default new AlbertaOpenDataService(); 