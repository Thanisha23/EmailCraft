import Agenda, { Job } from "agenda";
import { sendEmail } from "./emailService";

export const agenda = new Agenda({
  db: {
    address: process.env.DATABASE_URL!,
    collection: "jobs",
  },
});

agenda.on("ready", async () => {
  console.log("Agenda is ready");
  await agenda.start();
});

agenda.define("send scheduled email", async (job: Job) => {
  const { to, subject, body} = job.attrs.data;
  await sendEmail(to, subject, body);
});

export const scheduleEmail = async (
  to: string,
  subject: string,
  body: string,
  date: Date
) => {
  await agenda.schedule(date, "send scheduled email", {
    to,
    subject,
    body,
  });
};
