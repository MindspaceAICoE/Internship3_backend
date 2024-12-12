import express, { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import cron, { ScheduledTask } from "node-cron";
import dotenv from "dotenv";

import newsletterTemplate from "./newsletterTemplate";
import newsletterTemplate2 from "./newsletterTemplate2";
import newsletterTemplate3 from "./newsletterTemplate3";

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Enum for repeat types
enum RepeatType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

// Enum for template types
enum TemplateType {
  TEMPLATE_1 = "template1",
  TEMPLATE_2 = "template2",
  TEMPLATE_3 = "template3",
}

// Define types for request bodies
interface ScheduleRequest {
  subject: string;
  recipients: string[];
  time: string; // Format: HH:mm
  repeatType: RepeatType;
  templateType: TemplateType;
}

interface CancelRequest {
  jobId: string;
}

// Store scheduled jobs
const scheduledJobs: Record<string, ScheduledTask> = {};

// Async handler for routes
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Utility to generate a cron expression
const generateCronExpression = (time: string, repeatType: RepeatType): string => {
  const [hour, minute] = time.split(":").map(Number);

  switch (repeatType) {
    case RepeatType.DAILY:
      return `${minute} ${hour} * * *`; // Every day at specified time
    case RepeatType.WEEKLY:
      return `${minute} ${hour} * * 0`; // Every Sunday at specified time
    case RepeatType.MONTHLY:
      return `${minute} ${hour} 1 * *`; // First day of every month at specified time
    default:
      throw new Error("Invalid repeatType. Use 'daily', 'weekly', or 'monthly'.");
  }
};

// Utility to select the correct template
const getTemplate = (templateType: TemplateType): string => {
  switch (templateType) {
    case TemplateType.TEMPLATE_1:
      return newsletterTemplate();
    case TemplateType.TEMPLATE_2:
      return newsletterTemplate2();
    case TemplateType.TEMPLATE_3:
      return newsletterTemplate3();
    default:
      throw new Error("Invalid templateType. Use 'template1', 'template2', or 'template3'.");
  }
};

// Schedule newsletter route
app.post(
  "/schedule-newsletter",
  asyncHandler(async (req: Request<{}, {}, ScheduleRequest>, res: Response) => {
    const { subject, recipients, time, repeatType, templateType } = req.body;

    if (!subject || !recipients || !recipients.length || !time || !repeatType || !templateType) {
      return res.status(400).json({
        error: "Subject, recipients, time, repeatType, and templateType are required.",
      });
    }

    try {
      const cronExpression = generateCronExpression(time, repeatType);
      const jobId = `job_${Date.now()}`;

      const cronJob = cron.schedule(cronExpression, async () => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL,
            to: recipients.join(", "),
            subject,
            html: getTemplate(templateType),
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent: ${info.response}`);
        } catch (innerError) {
          if (innerError instanceof Error) {
            console.error(`Error in job ${jobId}: ${innerError.message}`);
          } else {
            console.error(`Unexpected error in job ${jobId}:`, innerError);
          }
        }
      });

      cronJob.start();
      scheduledJobs[jobId] = cronJob;

      res.status(200).json({
        success: true,
        jobId,
        cronExpression,
        message: "Newsletter scheduled successfully.",
      });
    } catch (outerError) {
      if (outerError instanceof Error) {
        console.error("Error scheduling newsletter:", outerError.message);
      } else {
        console.error("Unexpected error scheduling newsletter:", outerError);
      }
      res.status(500).json({ error: "Failed to schedule newsletter." });
    }
  })
);

// Cancel newsletter route
app.post(
  "/cancel-newsletter",
  asyncHandler(async (req: Request<{}, {}, CancelRequest>, res: Response) => {
    const { jobId } = req.body;

    if (!jobId || !scheduledJobs[jobId]) {
      return res.status(400).json({ error: "Invalid job ID." });
    }

    try {
      scheduledJobs[jobId].stop();
      delete scheduledJobs[jobId];

      res.status(200).json({
        success: true,
        message: "Newsletter canceled successfully.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error canceling job:", error.message);
      } else {
        console.error("Unexpected error canceling job:", error);
      }
      res.status(500).json({ error: "Failed to cancel job." });
    }
  })
);

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});
