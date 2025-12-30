import nodemailer from 'nodemailer'

/**
 * Send an email using configured SMTP settings
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const config = useRuntimeConfig()

    try {
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: parseInt(config.smtpPort),
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.smtpUser,
                pass: config.smtpPassword,
            },
        })

        await transporter.sendMail({
            from: config.smtpFrom,
            to,
            subject,
            html,
        })
    } catch (error) {
        console.error('Email sending error:', error)
        throw new Error('Failed to send email')
    }
}

/**
 * Generate invitation email HTML
 */
export function generateInvitationEmail(
    inviterName: string,
    groupName: string,
    code: string,
    inviteUrl: string
): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .message {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .code-box {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px dashed #0ea5e9;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin-bottom: 30px;
        }
        .code {
          font-size: 32px;
          font-weight: 800;
          color: #0369a1;
          letter-spacing: 4px;
          font-family: 'Courier New', monospace;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Tragogo</div>
          <div class="title">You're Invited! 🎉</div>
        </div>
        
        <div class="message">
          <strong>${inviterName}</strong> has invited you to join their family group <strong>"${groupName}"</strong> on Tragogo.
          <br><br>
          Stay connected with your family members and track their locations in real-time for safety and peace of mind.
        </div>
        
        <div class="code-box">
          <div style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Your Invitation Code</div>
          <div class="code">${code}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="${inviteUrl}" class="button">Accept Invitation</a>
        </div>
        
        <div class="footer">
          This invitation will expire in 7 days.
          <br>
          If you didn't expect this invitation, you can safely ignore this email.
        </div>
      </div>
    </body>
    </html>
  `
}
