const mongoose = require('mongoose');

const { Schema } = mongoose;

const TOKEN_SOURCES = ['EMERGENCY', 'PAID', 'FOLLOWUP', 'ONLINE', 'WALKIN'];
const TOKEN_STATUS = ['BOOKED', 'CANCELLED', 'NO_SHOW', 'COMPLETED'];

const tokenSchema = new Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: TOKEN_SOURCES,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    status: {
      type: String,
      enum: TOKEN_STATUS,
      default: 'BOOKED',
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
  Token,
  TOKEN_SOURCES,
  TOKEN_STATUS,
};

