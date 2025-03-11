const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema({
  nodes: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    position: {
      x: Number,
      y: Number
    },
    data: {
      label: String,
      type: {
        type: String,
        enum: ['policy', 'procedure', 'guideline'],
        default: 'policy'
      }
    }
  }],
  edges: [{
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    relationship: {
      type: String,
      enum: ['references', 'depends_on', 'supersedes', 'related_to'],
      default: 'related_to'
    },
    metadata: {
      description: String,
      strength: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
      }
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    }
  }]
}, {
  timestamps: true
});

// Compound index for faster lookups
graphSchema.index({ owner: 1, name: 1 }, { unique: true });

const Graph = mongoose.model('Graph', graphSchema);
module.exports = Graph; 