const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ SMTP Configuration Error:", error);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

const emailTemplatePath = path.join(__dirname, "../views/bookCreated.pug");

module.exports = async (bookDetails, recipientEmail) => {
  try {
    console.log("📧 Attempting to send email to:", recipientEmail);
    console.log("📧 Book details:", bookDetails);

    // Compile the Pug template
    const compiledTemplate = pug.compileFile(emailTemplatePath);
    const html = compiledTemplate({
      title: bookDetails.title,
      author: bookDetails.author,
      year: bookDetails.year,
    });

    // Setup email options
    const mailOptions = {
      from: `"Book API" <${process.env.SMTP_USERNAME}>`,
      to: recipientEmail || process.env.DEFAULT_RECIPIENT_EMAIL,
      subject: "New Book Added",
      html: html,
      text: `A new book has been added: ${bookDetails.title} by ${bookDetails.author} (${bookDetails.year})`,
    };

    console.log("📧 Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email notification:", error);
    throw error;
  }
};
