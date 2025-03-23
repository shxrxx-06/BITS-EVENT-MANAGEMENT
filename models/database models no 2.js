// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  regNo: {
    type: String,
    required: [true, 'Please provide a registration number'],
    unique: true
  },
  userType: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    required: [true, 'Please specify user type']
  },
  department: {
    type: String,
    required: [true, 'Please provide department']
  },
  year: {
    type: String,
    required: function() {
      return this.userType === 'student';
    }
  },
  profileImage: {
    type: String,
    default: 'default.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, userType: this.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  facultyCoordinators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'At least one faculty coordinator is required']
  }],
  studentCoordinators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  department: {
    type: String,
    required: [true, 'Please provide department']
  },
  eventPoster: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'changes_requested', 'completed'],
    default: 'pending'
  },
  adminComments: {
    type: String
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventRoomId: {
    type: String
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    qrCode: {
      type: String
    },
    attendance: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);

// models/Venue.js
const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide venue name'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide venue capacity']
  },
  location: {
    type: String,
    required: [true, 'Please provide venue location']
  },
  facilities: [{
    type: String
  }],
  availableFrom: {
    type: Date,
    required: [true, 'Please provide availability start']
  },
  availableTo: {
    type: Date,
    required: [true, 'Please provide availability end']
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'changes_requested'],
    default: 'pending'
  },
  adminComments: {
    type: String
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', VenueSchema);

// models/EventReport.js
const mongoose = require('mongoose');

const EventReportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    type: String,
    required: [true, 'Please provide event summary']
  },
  attendance: {
    type: Number,
    required: [true, 'Please provide attendance count']
  },
  outcomes: {
    type: String,
    required: [true, 'Please provide event outcomes']
  },
  challenges: {
    type: String
  },
  photos: [{
    type: String
  }],
  feedback: {
    type: String
  },
  certificateOfOrganizing: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EventReport', EventReportSchema);

// models/Certificate.js
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide certificate title']
  },
  issuedBy: {
    type: String,
    required: [true, 'Please provide issuing organization']
  },
  issuedDate: {
    type: Date,
    required: [true, 'Please provide issue date']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  certificateImage: {
    type: String,
    required: [true, 'Please upload certificate image']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);

// models/CalendarEvent.js
const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title']
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['personal', 'academic', 'event', 'task'],
    default: 'personal'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  color: {
    type: String,
    default: '#3788d8'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);

// models/ChatRoom.js
const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide room name'],
    trim: true
  },
  description: {
    type: String
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  roomImage: {
    type: String,
    default: 'default-room.jpg'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);

// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'sticker'],
    default: 'text'
  },
  fileUrl: {
    type: String
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);

// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide notification title']
  },
  message: {
    type: String,
    required: [true, 'Please provide notification message']
  },
  type: {
    type: String,
    enum: ['event', 'venue', 'task', 'message', 'system'],
    default: 'system'
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Event', 'Venue', 'CalendarEvent', 'ChatRoom', 'User']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
