const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.EMAIL_HOST  || "smtp.gmail.com",
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── OTP verification email ────────────────────────────────────────────────────
const sendOTPEmail = async ({ email, code }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || "Campus EventHub <noreply@eventhub.com>",
    to:      email,
    subject: `Your Campus EventHub verification code: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="color:#6366f1;margin:0;font-size:22px;">Campus EventHub</h2>
          <p style="color:#6b7280;margin-top:4px;font-size:14px;">Organizer Email Verification</p>
        </div>
        <p style="color:#374151;">Hi there! Use the code below to verify your email and complete registration as a department organizer.</p>
        <div style="background:#f3f4f6;border-radius:16px;padding:32px;text-align:center;margin:24px 0;">
          <p style="margin:0;color:#6b7280;font-size:13px;">Your verification code</p>
          <div style="font-size:52px;font-weight:700;letter-spacing:14px;color:#6366f1;margin:16px 0;font-family:monospace;">${code}</div>
          <p style="margin:0;color:#9ca3af;font-size:12px;">Expires in 10 minutes. Do not share this code.</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">If you did not request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af;font-size:11px;text-align:center;">Campus EventHub — University Event Management System</p>
      </div>
    `,
  });
};

// ── Registration confirmation email ───────────────────────────────────────────
const sendConfirmationEmail = async ({ name, email, event, registrationId }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  if (!registrationId) registrationId = `EVH-${Date.now().toString(36).toUpperCase()}`;

  // Generate QR code as base64 PNG
  const qrData = JSON.stringify({
    id: registrationId,
    event: event.title,
    name: name,
    email: email,
    date: event.date,
    venue: event.venue,
  });
  const qrBase64 = await QRCode.toDataURL(qrData, { width: 200, margin: 2, color: { dark: '#6366f1', light: '#ffffff' } });
  const qrBuffer = Buffer.from(qrBase64.split(',')[1], 'base64');

  const html = `
    <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      
      <!-- Header Banner -->
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a78bfa 100%);padding:40px 32px;text-align:center;">
        <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;margin-bottom:12px;">🎉</div>
        <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Registration Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">You're all set for the event</p>
      </div>

      <!-- Greeting -->
      <div style="padding:32px 32px 0;">
        <p style="color:#1f2937;font-size:16px;margin:0;line-height:1.6;">
          Hi <strong>${name}</strong>,<br/>
          Great news! Your registration for <strong style="color:#6366f1;">${event.title}</strong> has been successfully confirmed. We're excited to have you join us!
        </p>
      </div>

      <!-- Event Details Card -->
      <div style="margin:24px 32px;background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%);border:1px solid #e0e7ff;border-radius:16px;overflow:hidden;">
        <div style="background:#6366f1;padding:12px 20px;">
          <h2 style="color:#ffffff;margin:0;font-size:18px;font-weight:600;">📋 Event Details</h2>
        </div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:40%;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">📌 Event Name</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${event.title}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">📅 Date</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${formattedDate}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">🕐 Time</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${event.time}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">📍 Venue</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${event.venue}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">🏛️ Department</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${event.department}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;">
                <span style="color:#6b7280;font-size:13px;font-weight:500;">👤 Organizer</span>
              </td>
              <td style="padding:10px 0;">
                <span style="color:#1f2937;font-size:14px;font-weight:600;">${event.organizer || 'Campus EventHub Team'}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Registration ID + QR Code -->
      <div style="margin:0 32px 24px;background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:20px;text-align:center;">
        <p style="margin:0;color:#92400e;font-size:12px;font-weight:500;">YOUR REGISTRATION ID</p>
        <p style="margin:6px 0 0;color:#78350f;font-size:20px;font-weight:700;font-family:monospace;letter-spacing:2px;">${registrationId}</p>
        <div style="margin:16px 0 8px;">
          <img src="cid:qrcode" alt="QR Code" width="180" height="180" style="border-radius:12px;border:2px solid #e5e7eb;" />
        </div>
        <p style="margin:0;color:#a16207;font-size:11px;">Show this QR code at the venue entrance for quick check-in</p>
      </div>

      ${event.googleFormUrl ? `
      <!-- Google Form CTA -->
      <div style="margin:0 32px 24px;text-align:center;">
        <p style="color:#4b5563;font-size:14px;margin:0 0 12px;">📝 Additional form submission required:</p>
        <a href="${event.googleFormUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:600;letter-spacing:0.3px;">Fill Required Form →</a>
      </div>
      ` : ''}

      <!-- Tips Section -->
      <div style="margin:0 32px 24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">
        <h3 style="color:#166534;margin:0 0 12px;font-size:15px;font-weight:600;">💡 Quick Reminders</h3>
        <ul style="color:#15803d;font-size:13px;margin:0;padding-left:18px;line-height:2;">
          <li>Arrive <strong>15 minutes early</strong> to check in smoothly</li>
          <li>Carry your <strong>college ID card</strong> for verification</li>
          <li>Save this email or screenshot the <strong>Registration ID</strong> above</li>
          <li>For any queries, contact the organizer through the university portal</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 32px;text-align:center;">
        <p style="margin:0;font-size:16px;font-weight:700;color:#6366f1;">Campus EventHub</p>
        <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">University Event Management System</p>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#d1d5db;font-size:11px;">
            This is an automated confirmation. Please do not reply to this email.<br/>
            © ${new Date().getFullYear()} Campus EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || "Campus EventHub <noreply@eventhub.com>",
    to:      email,
    subject: `✅ Registration Confirmed — ${event.title} | ${formattedDate}`,
    html: html,
    attachments: [{
      filename: 'qrcode.png',
      content: qrBuffer,
      cid: 'qrcode',
    }],
  });
};

module.exports = { sendOTPEmail, sendConfirmationEmail };
