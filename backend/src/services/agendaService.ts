import Agenda, { Job } from "agenda";
import { sendEmail } from "./emailService";
import mongoose from "mongoose";

let agendaInstance: Agenda | null = null;

export const getAgenda = async (): Promise<Agenda> => {
  if (agendaInstance) {
    return agendaInstance;
  }

  const agenda = new Agenda({
    db: {
      address: process.env.DATABASE_URL!,
      collection: "jobs",
    },
    processEvery: "20 seconds",
    maxConcurrency: 10,
    defaultConcurrency: 5,
    lockLimit: 15,
  });

  agenda.on("ready", () => {
    console.log("Agenda is ready and connected to database");
  });

  agenda.on("start", (job) => {
    console.log(`Job ${job.attrs.name} starting`, job.attrs.data);
  });

  agenda.on("complete", (job) => {
    console.log(`Job ${job.attrs.name} completed successfully`);
  });

  agenda.on("fail", (error, job) => {
    console.error(`Job ${job.attrs.name} failed with error:`, error);
  });

  agenda.define(
    "send scheduled email",
    {
      priority: 20,
      concurrency: 5,
    },
    async (job: Job) => {
      const { to, subject, body } = job.attrs.data;
      try {
        console.log(`Sending email to ${to} with subject: ${subject}`);
        await sendEmail(to, subject, body);
        console.log(`Email sent successfully to ${to}`);
      } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error;
      }
    }
  );

  await agenda.start();
  console.log("Agenda service started and processing jobs");

  agendaInstance = agenda;

  return agenda;
};

export const scheduleEmail = async (
  to: string,
  subject: string,
  body: string,
  date: Date
): Promise<string> => {
  const agenda = await getAgenda();

  const job = agenda.create("send scheduled email", {
    to,
    subject,
    body,
  });

  job.schedule(date);
  await job.save();

  console.log(`Email scheduled for ${date.toISOString()} to ${to}`);
  return job.attrs._id.toString();
};

export const getScheduledJobs = async (): Promise<any[]> => {
  const agenda = await getAgenda();
  const jobs = await agenda.jobs({});

  return jobs.map((job) => ({
    id: job.attrs._id,
    name: job.attrs.name,
    data: job.attrs.data,
    nextRunAt: job.attrs.nextRunAt,
    lastRunAt: job.attrs.lastRunAt,
    status: job.attrs.failedAt
      ? "failed"
      : job.attrs.lastFinishedAt
      ? "completed"
      : "pending",
  }));
};

export const gracefulShutdown = async (): Promise<void> => {
  if (agendaInstance) {
    await agendaInstance.stop();
    console.log("Agenda stopped gracefully");
  }
};
