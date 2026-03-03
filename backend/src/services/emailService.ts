import {BrevoClient} from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export const sendEmail = async (
  to: string,
  subject: string,
  body: string
) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: "noreply@thanisha.me",
        name: "EmailCraft",
      },
      to: [{ email: to }],
      subject,
      textContent: body,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Brevo error:", error);
  }
};