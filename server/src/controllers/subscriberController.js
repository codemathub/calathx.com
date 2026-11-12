const Subscriber = require('../models/Subscriber');
const List = require('../models/List');
const { sendEmail } = require('../config/resend');

const subscribe = async (req, res, next) => {
  try {
    const { email, firstName, listSlug } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let list = await List.findOne({ slug: listSlug || 'public' });
    if (!list) {
      list = await List.create({ name: 'Public', slug: 'public' });
    }

    let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (subscriber) {
      subscriber.status = 'subscribed';
      if (!subscriber.lists.includes(list._id)) {
        subscriber.lists.push(list._id);
      }
      await subscriber.save();
      return res.json({ success: true, message: 'You are subscribed to CalathX!' });
    }

    subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      firstName: firstName || '',
      status: 'subscribed',
      lists: [list._id],
      ip: req.ip,
    });

    // Send welcome email via Resend
    await sendEmail({
      to: subscriber.email,
      subject: 'Welcome to CalathX Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #749b18;">Welcome to CalathX!</h2>
          <p>Thank you for subscribing to the CalathX newsletter. You'll receive the latest science-backed fitness, nutrition, and health articles straight to your inbox.</p>
          <p style="color: #666; font-size: 12px;">If you did not subscribe, you can ignore this email.</p>
        </div>
      `,
    }).catch((err) => console.error('Welcome email failed:', err.message));

    res.status(201).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    next(error);
  }
};

const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().populate('lists', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: req.body.email?.toLowerCase() },
      { status: 'unsubscribed' },
      { new: true }
    );
    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, getSubscribers, unsubscribe };

