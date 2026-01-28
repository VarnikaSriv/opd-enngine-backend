const mongoose = require('mongoose');

const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    tokens: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Token',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;

