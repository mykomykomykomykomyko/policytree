const express = require('express')
const multer = require('multer')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Upload document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Process the uploaded file
    const document = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      status: 'processing'
    }

    // Save to database
    // const savedDoc = await Document.create(document)

    // Start processing in background
    processDocument(document)

    res.json({
      message: 'Document uploaded successfully',
      document
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Error uploading document' })
  }
})

// Get all documents
router.get('/', async (req, res) => {
  try {
    // const documents = await Document.find()
    // res.json(documents)
    res.json([]) // Placeholder
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' })
  }
})

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    // const document = await Document.findById(req.params.id)
    // if (!document) {
    //   return res.status(404).json({ error: 'Document not found' })
    // }
    // res.json(document)
    res.json({}) // Placeholder
  } catch (error) {
    res.status(500).json({ error: 'Error fetching document' })
  }
})

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    // const document = await Document.findByIdAndDelete(req.params.id)
    // if (!document) {
    //   return res.status(404).json({ error: 'Document not found' })
    // }
    res.json({ message: 'Document deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document' })
  }
})

// Process document in background
async function processDocument(document) {
  try {
    // Update document status to processing
    // await Document.findByIdAndUpdate(document._id, { status: 'processing' })

    // Extract text based on file type
    let extractedText = ''
    if (document.mimetype === 'application/pdf') {
      // Process PDF
      // extractedText = await extractPDFText(document.filename)
    } else if (document.mimetype.includes('word')) {
      // Process Word document
      // extractedText = await extractWordText(document.filename)
    } else if (document.mimetype.includes('powerpoint')) {
      // Process PowerPoint
      // extractedText = await extractPPTText(document.filename)
    }

    // Process extracted text with NLP
    // const processedData = await processTextWithNLP(extractedText)

    // Update document with processed data
    // await Document.findByIdAndUpdate(document._id, {
    //   status: 'processed',
    //   extractedText,
    //   processedData
    // })

    console.log('Document processed successfully:', document.filename)
  } catch (error) {
    console.error('Document processing error:', error)
    // await Document.findByIdAndUpdate(document._id, { status: 'error' })
  }
}

module.exports = router 