const mongoose = require('mongoose');

const ctfSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  heading: { type: String, trim: true },
  description: { type: String, trim: true },
  flag: { type: String, trim: true },
  link: { type: String, trim: true },
  hint: { type: String, trim: true },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Ctf = mongoose.model('Ctf', ctfSchema);
module.exports = Ctf;
