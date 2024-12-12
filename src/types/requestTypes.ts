export interface ScheduleRequest {
    subject: string;
    recipients: string[];
    scheduleTime: string; // Cron format
  }
  
  export interface CancelRequest {
    jobId: string;
  }
  