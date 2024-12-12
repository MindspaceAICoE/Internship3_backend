const newsletterTemplate2 = () => {
    const imageUrl = "https://th.bing.com/th/id/OIG2._JJ7jEND0UMuzHjwBeTh";
  
    return `
    <html>
      <body style="font-family: Georgia, serif; line-height: 1.8; margin: 0; padding: 0; background-color: #e9ecef;">
        <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <header style="text-align: center; padding-bottom: 10px;">
            <h2 style="color: #5a5a5a; margin: 0;">Tech Insights</h2>
            <p style="font-size: 14px; color: #888;">Your source for the latest in technology</p>
          </header>
          <img src="${imageUrl}" alt="Newsletter Banner" style="width: 100%; height: auto; margin-top: 20px; border-radius: 10px;" />
          <div style="padding: 20px;">
            <h3 style="color: #444;">What’s New This Week</h3>
            <p>Greetings!</p>
            <p>Here’s a quick roundup of the latest developments in tech:</p>
            <ul>
              <li><strong>Product Launch:</strong> Introducing the SmartGadget Pro 2.0!</li>
              <li><strong>Industry News:</strong> AI technology is reshaping the future of work.</li>
              <li><strong>Exclusive Content:</strong> Check out our guide on optimizing workflows.</li>
            </ul>
            <p>Don’t miss out on these exciting updates. Thank you for staying connected!</p>
          </div>
          <footer style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #999;">&copy; 2024 Tech Insights. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;
  };
  
  module.exports = newsletterTemplate2;