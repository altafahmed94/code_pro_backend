const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  start: { type: Date },
  end: { type: Date },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ctf',
    },
  ],
  discription: { type: String, trim: true },
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
