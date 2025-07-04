const { Schema, model } = require('mongoose');
const validator = require('validator');

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  cover: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  genre: [{
    type: String,
    required: true,
    trim: true,
  }],
  director: {
    type: String,
    required: true,
    trim: true,
  },
  cast: {
    type: [String],
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return value.length > 1;
      },
      message: 'Cast should have at least two member',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isFeatured: {
    type: Boolean,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, });

module.exports = model('Movie', movieSchema);
