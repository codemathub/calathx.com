const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    firstName: { type: String, default: '', trim: true },
    status: { type: String, enum: ['subscribed', 'unsubscribed', 'unconfirmed'], default: 'subscribed' },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
    ip: { type: String, default: '' },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);

