"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const newsletterTemplate_1 = __importDefault(require("./newsletterTemplate"));
const newsletterTemplate2_1 = __importDefault(require("./newsletterTemplate2"));
const newsletterTemplate3_1 = __importDefault(require("./newsletterTemplate3"));
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Enum for repeat types
var RepeatType;
(function (RepeatType) {
    RepeatType["DAILY"] = "daily";
    RepeatType["WEEKLY"] = "weekly";
    RepeatType["MONTHLY"] = "monthly";
})(RepeatType || (RepeatType = {}));
// Enum for template types
var TemplateType;
(function (TemplateType) {
    TemplateType["TEMPLATE_1"] = "template1";
    TemplateType["TEMPLATE_2"] = "template2";
    TemplateType["TEMPLATE_3"] = "template3";
})(TemplateType || (TemplateType = {}));
// Store scheduled jobs
const scheduledJobs = {};
// Async handler for routes
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Utility to generate a cron expression
const generateCronExpression = (time, repeatType) => {
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
const getTemplate = (templateType) => {
    switch (templateType) {
        case TemplateType.TEMPLATE_1:
            return (0, newsletterTemplate_1.default)();
        case TemplateType.TEMPLATE_2:
            return (0, newsletterTemplate2_1.default)();
        case TemplateType.TEMPLATE_3:
            return (0, newsletterTemplate3_1.default)();
        default:
            throw new Error("Invalid templateType. Use 'template1', 'template2', or 'template3'.");
    }
};
// Schedule newsletter route
app.post("/schedule-newsletter", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, recipients, time, repeatType, templateType } = req.body;
    if (!subject || !recipients || !recipients.length || !time || !repeatType || !templateType) {
        return res.status(400).json({
            error: "Subject, recipients, time, repeatType, and templateType are required.",
        });
    }
    try {
        const cronExpression = generateCronExpression(time, repeatType);
        const jobId = `job_${Date.now()}`;
        const cronJob = node_cron_1.default.schedule(cronExpression, () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
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
                const info = yield transporter.sendMail(mailOptions);
                console.log(`Email sent: ${info.response}`);
            }
            catch (innerError) {
                if (innerError instanceof Error) {
                    console.error(`Error in job ${jobId}: ${innerError.message}`);
                }
                else {
                    console.error(`Unexpected error in job ${jobId}:`, innerError);
                }
            }
        }));
        cronJob.start();
        scheduledJobs[jobId] = cronJob;
        res.status(200).json({
            success: true,
            jobId,
            cronExpression,
            message: "Newsletter scheduled successfully.",
        });
    }
    catch (outerError) {
        if (outerError instanceof Error) {
            console.error("Error scheduling newsletter:", outerError.message);
        }
        else {
            console.error("Unexpected error scheduling newsletter:", outerError);
        }
        res.status(500).json({ error: "Failed to schedule newsletter." });
    }
})));
// Cancel newsletter route
app.post("/cancel-newsletter", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error canceling job:", error.message);
        }
        else {
            console.error("Unexpected error canceling job:", error);
        }
        res.status(500).json({ error: "Failed to cancel job." });
    }
})));
// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
    else {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
