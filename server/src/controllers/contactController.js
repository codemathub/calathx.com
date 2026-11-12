const ContactSubmission = require('../models/ContactSubmission');
const { sendEmail } = require('../config/resend');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      subject: subject || 'Contact Form Inquiry',
      phone: phone || '',
      message,
    });

    // Notify admin via Resend
    const adminEmail = process.env.CONTACT_EMAIL || 'info@calathx.com';
    await sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `[CalathX Contact] ${subject || 'New Inquiry'} from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    }).catch((err) => console.error('Contact notification failed:', err.message));

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting CalathX! We will get back to you soon.',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getSubmissions, markAsRead, deleteSubmission };

