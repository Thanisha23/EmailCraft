import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  pool: true,
  maxConnections: 5,
  rateDelta: 20000,
  rateLimit: 5,
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const mailOptions = {
      from: `"EmailCraft App"${process.env.EMAIL_USER!}`,
      to,
      subject,
      text: body,
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "Normal",
        "X-Mailer": "EmailCraft Mailer",
      },
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
