"use strict";
const newsletterTemplate3 = () => {
    const imageUrl = "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg";
    return `
    <html>
      <body style="font-family: 'Helvetica Neue', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #fafafa;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <header style="text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            <h1 style="color: #3498db; margin: 0;">Nature's Wonders</h1>
          </header>
          <img src="${imageUrl}" alt="Newsletter Banner" style="width: 100%; height: auto; margin-top: 20px; border-radius: 8px;" />
          <div style="padding: 20px;">
            <h2 style="color: #2c3e50;">Explore the Beauty Around You</h2>
            <p>Hello Nature Enthusiasts,</p>
            <p>This month, we’re bringing you closer to nature with:</p>
            <ul>
              <li><strong>Spotlight Destination:</strong> The hidden waterfalls of Costa Rica.</li>
              <li><strong>Photography Tips:</strong> How to capture breathtaking landscapes.</li>
              <li><strong>Member Stories:</strong> Read how Sarah's trekking adventure changed her perspective.</li>
            </ul>
            <p>Embrace the beauty of the outdoors and make time for the wonders that surround you.</p>
          </div>
          <footer style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px solid #3498db;">
            <p style="font-size: 14px; color: #666;">&copy; 2024 Nature's Wonders. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;
};
module.exports = newsletterTemplate3;
