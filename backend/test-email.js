require('dotenv').config();
const { sendConfirmationEmail } = require('./utils/mailer');

async function test() {
  try {
    await sendConfirmationEmail({
      name: "Test User",
      email: process.env.EMAIL_USER,
      event: {
        title: "Test Event",
        date: new Date(),
        time: "10:00 AM",
        venue: "Test Venue",
        department: "CSE"
      }
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email send failed:", error);
  }
}

test();
