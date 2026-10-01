/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions on Vercel deployment.
 * DAGAM CHANDRAMOHAN Portfolio Website
 */

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'operational',
      service: 'Portfolio Contact API',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, email, subject, message, website_hp, form_time } = body;

    // 1. Honeypot check (reject automated bots)
    if (website_hp && String(website_hp).trim() !== '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission detected.'
      });
    }

    // 2. Submission time anti-bot threshold
    if (form_time) {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - parseInt(form_time, 10);
      if (elapsed < 2) {
        return res.status(400).json({
          success: false,
          message: 'Submission completed too quickly. Please take your time and try again.'
        });
      }
    }

    // 3. Input validation & sanitization
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim();
    const cleanSubject = (subject || '').trim() || 'Portfolio Inquiry';
    const cleanMessage = (message || '').trim();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name (up to 100 characters).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 3,000 characters.'
      });
    }

    // Header injection prevention
    if (/[\r\n]/.test(cleanName) || /[\r\n]/.test(cleanEmail) || /[\r\n]/.test(cleanSubject)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid characters detected in submitted fields.'
      });
    }

    // Log the contact event (visible in Vercel Deployment Logs)
    console.log(`[Contact Submission] From: ${cleanName} (${cleanEmail}) | Subject: ${cleanSubject}`);

    // If an external forwarder (e.g. Formspree/Resend/Webhook) is set via environment variable:
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookErr) {
        console.error('Webhook notification error:', webhookErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Thank you for reaching out, ${cleanName}! Your message has been received successfully.`
    });

  } catch (err) {
    console.error('API Contact Error:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your message. Please try again or email directly.'
    });
  }
}
