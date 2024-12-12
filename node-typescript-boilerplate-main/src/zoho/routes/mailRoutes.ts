import express from 'express';
import { sendEmail, listEmails } from '../services/zohoService.js';

const router = express.Router();

// Route to send an email
router.post('/send', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  const { fromAddress, toAddress, subject, content } = req.body;

  if (!fromAddress || !toAddress || !subject || !content) {
    return res.status(400).json({ success: false, message: 'Missing required fields (from, to, subject, content)' });
  }

  try {
    const response = await sendEmail(token, fromAddress, toAddress, subject, content);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Route to list emails
router.get('/list', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({ success: false, message: 'Authorization token is required' });
  }

  try {
    const response = await listEmails(token);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;