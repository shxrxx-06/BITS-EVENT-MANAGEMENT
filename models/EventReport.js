const mongoose = require('mongoose');

const eventReportSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submittedDate: {
    type: Date,
    default: Date.now,
  },
});

const EventReport = mongoose.model('EventReport', eventReportSchema);

module.exports = EventReport;