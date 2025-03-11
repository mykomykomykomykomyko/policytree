# PolicyTree - AI-Powered Policy Development Platform

PolicyTree is a modern web application that helps organizations manage, analyze, and understand their policies through AI-powered insights and interactive visualizations.

## Features

- 📄 Document Upload & Processing
  - Support for PDF, Word, PowerPoint, and website links
  - OCR integration for image-based documents
  - Automated text extraction and analysis

- 🧠 Knowledge Graph Visualization
  - Interactive D3.js-based policy relationship visualization
  - Filter and search capabilities
  - Clickable nodes for detailed policy information

- 💬 AI-Powered Chat Interface
  - Real-time policy queries and responses
  - Document citations and references
  - Context-aware responses

- 🔍 Advanced Search & Filtering
  - Full-text search across policy documents
  - Filter by policy type, keywords, and date
  - Relevance-based results

- 👥 User Authentication
  - OAuth integration (Google, Microsoft)
  - Role-based access control
  - Secure user management

## Tech Stack

### Frontend
- Vue.js 3 (Composition API)
- Vite
- Pinia (State Management)
- Vue Router
- TailwindCSS
- D3.js
- Socket.io Client

### Backend
- Node.js + Express.js
- MongoDB (Document Storage)
- Neo4j (Knowledge Graph)
- Socket.io
- OpenAI API (AI Integration)
- Tesseract.js (OCR)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Neo4j
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/policytree.git
cd policytree
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create environment files:

Frontend (.env):
```
VITE_API_URL=http://localhost:4000
```

Backend (.env):
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/policytree
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
OPENAI_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
SESSION_SECRET=your-session-secret
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
cd backend
npm start
```

## Project Structure

```
policytree/
├── src/                    # Frontend source code
│   ├── assets/            # Static assets
│   ├── components/        # Vue components
│   ├── views/             # Page components
│   ├── router/            # Vue Router configuration
│   ├── stores/            # Pinia stores
│   └── App.vue            # Root component
├── backend/               # Backend source code
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── index.js      # Server entry point
│   └── uploads/          # Document upload directory
└── README.md
```

## API Documentation

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/microsoft` - Microsoft OAuth login
- `GET /api/auth/user` - Get current user
- `GET /api/auth/logout` - Logout

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `DELETE /api/documents/:id` - Delete document

### Knowledge Graph
- `GET /api/graph` - Get graph data
- `GET /api/graph/node/:id` - Get node details
- `POST /api/graph/relationship` - Add relationship
- `PUT /api/graph/node/:id` - Update node
- `DELETE /api/graph/node/:id` - Delete node

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Neo4j for the graph database
- MongoDB for document storage
- Vue.js team for the amazing frontend framework 