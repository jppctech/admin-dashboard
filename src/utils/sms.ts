import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const fromPhone = process.env.TWILIO_PHONE_NUMBER as string;

const client = twilio(accountSid, authToken);

export async function sendSMS(phone: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: phone,
    });
    console.log('SMS sent successfully:', response);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
}
