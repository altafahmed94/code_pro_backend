const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, trim: true },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isResolved: {
    type: Boolean,
    default: false,
  },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
