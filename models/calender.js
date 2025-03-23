// models/Calendar.js
const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: String,
  color: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPersonal: {
    type: Boolean,
    default: true
  },
  // For shared/assigned events
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  reminders: [{
    time: Number, // minutes before the event
    sent: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for efficient queries
calendarEventSchema.index({ creator: 1, startDate: 1 });
calendarEventSchema.index({ assignedTo: 1, startDate: 1 });
calendarEventSchema.index({ relatedEvent: 1 });

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
module.exports = CalendarEvent;