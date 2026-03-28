interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  // In development, log to console
  if (process.env.NODE_ENV !== "production") {
    console.log(`\nEmail to: ${to}\nSubject: ${subject}\nBody: ${html}\n`);
    return;
  }

  // Production: implement with SendGrid/Resend/SMTP
  // For now, just log
  console.log(`Sending email to ${to}: ${subject}`);
}

export function verifyEmailTemplate(verifyUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px;">Verify Email</a>
      <p style="margin-top: 16px; color: #666;">If you didn't create an account, you can ignore this email.</p>
    </div>
  `;
}

export function resetPasswordTemplate(resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
      <p style="margin-top: 16px; color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;
}
