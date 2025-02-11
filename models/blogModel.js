import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return true; // Remove tag validation
      }
    }
  },
  image: {
    filename: String,
    id: mongoose.Types.ObjectId,
    url: String
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Add method to get image URL
blogSchema.methods.getImageUrl = function() {
  return this.image ? `/api/images/${this.image.id}` : null;
};

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
