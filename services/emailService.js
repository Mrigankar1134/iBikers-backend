const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends booking confirmation email with optional attachments
 */
const sendBookingConfirmation = async (bookingData, files) => {
  const bookingDate = new Date(`${bookingData.date}T${bookingData.time}`);
  const formattedDate = bookingDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = bookingDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'surajs.mba10@iimamritsar.ac.in', // Replace with actual recipient
    subject: `New Bike Booking: ${bookingData.bikeName}`,
    html: `
      <h2>New Booking Details</h2>
      <p><strong>Customer Name:</strong> ${bookingData.name}</p>
      <p><strong>Phone Number:</strong> ${bookingData.phone}</p>
      <p><strong>Bike:</strong> ${bookingData.bikeName}</p>
      <p><strong>Duration:</strong> ${bookingData.duration}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
      <p><strong>Location:</strong> ${bookingData.location}</p>
      <p><strong>Total Cost:</strong> ₹${bookingData.totalCost}</p>
    `,
    attachments: [],
  };

  if (files?.license) {
    mailOptions.attachments.push({
      filename: files.license.originalname,
      content: files.license.buffer,
    });
  }

  if (files?.payment) {
    mailOptions.attachments.push({
      filename: files.payment.originalname,
      content: files.payment.buffer,
    });
  }

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
  return info;
};

module.exports = { sendBookingConfirmation };