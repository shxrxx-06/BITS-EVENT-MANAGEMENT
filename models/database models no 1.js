// User Model (users.js)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
  department: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  year: { type: Number, required: userType === 'student' },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Event Model (events.js)
const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: String, required: true },
  department: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyCoordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  studentCoordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'changes_requested'], default: 'pending' },
  adminComments: { type: String },
  eventPoster: { type: String },
  eventRoomId: { type: String }, // For the chat room ID
  certificates: [{ type: String }], // For certificate uploads after event
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Venue Request Model (venues.js)
const VenueRequestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  venueName: { type: String, required: true },
  capacity: { type: Number, required: true },
  facilities: [{ type: String }],
  dateRequired: { type: Date, required: true },
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  purpose: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'changes_requested'], default: 'pending' },
  adminComments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Event Report Model (eventReports.js)
const EventReportSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendanceCount: { type: Number, required: true },
  summary: { type: String, required: true },
  outcomes: { type: String, required: true },
  challenges: { type: String },
  photos: [{ type: String }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' }
});

// Certificate Model (certificates.js)
const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  certificateType: { type: String, enum: ['participation', 'organization', 'achievement'], required: true },
  certificateImage: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  verificationCode: { type: String, unique: true }
});

// Calendar Model (calendar.js)
const CalendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPersonal: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// ChatRoom Model (chatRooms.js)
const ChatRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  description: { type: String },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  roomImage: { type: String },
  roomType: { type: String, enum: ['event', 'general'], default: 'general' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Message Model (messages.js)
const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageType: { type: String, enum: ['text', 'image', 'video', 'voice', 'sticker', 'file'], default: 'text' },
  content: { type: String, required: true },
  fileUrl: { type: String },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Notification Model (notifications.js)
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['event', 'venue', 'message', 'calendar', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
