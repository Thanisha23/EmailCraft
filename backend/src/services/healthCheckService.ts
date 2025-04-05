import { getAgenda, getScheduledJobs } from "./agendaService";

export const initHealthChecks = () => {
  const intervalId = setInterval(async () => {
    try {
      console.log("Running Agenda health check...");
      
      const agenda = await getAgenda();
      
      const pendingJobs = await agenda.jobs({ nextRunAt: { $exists: true, $ne: null } });
      console.log(`Found ${pendingJobs.length} pending jobs`);
      
      if (pendingJobs.length > 0) {
        const now = new Date();
        const dueJobs = pendingJobs.filter(job => 
          job.attrs.nextRunAt && job.attrs.nextRunAt <= now
        );
        
        if (dueJobs.length > 0) {
          console.log(`Found ${dueJobs.length} due jobs that need processing`);
        }
      }
    } catch (error) {
      console.error("Health check for Agenda failed:", error);
    }
  }, 60000); 
  
  process.on('SIGTERM', () => clearInterval(intervalId));
  process.on('SIGINT', () => clearInterval(intervalId));
  
  console.log("Agenda health check service initialized");
};