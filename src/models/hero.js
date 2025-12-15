const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'El userId es requerido'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [60000, 'La descripción no puede exceder 60000 caracteres'],
    default: ''
  },
  power: {
    type: String,
    trim: true,
    maxlength: [100, 'El poder no puede exceder 100 caracteres'],
    default: ''
  },
  isDone: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

heroSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero;
