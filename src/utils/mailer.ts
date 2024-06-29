import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, subject: string, OTP: number, name: string) {

  const emailOptions = {
    from: 'onboarding@resend.dev',
    to: email,
    subject: subject,
    html: `<p>Hi ${name}, 
          <br/>Your OTP is <strong>${OTP}</strong>
          <br/>
          <br/>
          Thankyou for choosing Zuffy
          </p>`,
  };

  try {
    const response = await resend.emails.send(emailOptions);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
