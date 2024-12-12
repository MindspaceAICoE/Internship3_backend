"use strict";
const newsletterTemplate = () => {
    const imageUrl = "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";
    return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <header style="text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">
          <h2 style="color: #2c3e50; margin: 0;">Monthly Newsletter</h2>
        </header>
        <img src="${imageUrl}" alt="Newsletter Banner" style="width: 100%; height: auto; margin-top: 20px; border-radius: 8px;" />
        <div style="padding: 20px;">
          <p>Hello!!!!!</p>
          <p>We hope this message finds you well. Here's what's new this month:</p>
          <ul>
            <li><strong>Feature Update:</strong> We've added new tools to improve your experience.</li>
            <li><strong>Upcoming Event:</strong> Join us for our webinar on modern web development.</li>
            <li><strong>Special Offer:</strong> Get 20% off on our premium subscription!</li>
          </ul>
          <p>Thank you for being part of our community. Stay tuned for more updates!</p>
        </div>
        <footer style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px solid #2c3e50;">
          <p style="font-size: 14px; color: #666;">&copy; 2024 The Team. All rights reserved.</p>
        </footer>
      </div>
    </body>
  </html>
  `;
};
module.exports = newsletterTemplate;
