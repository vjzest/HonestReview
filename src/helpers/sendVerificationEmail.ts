import { Resend } from 'resend';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

const resend = new Resend('re_5TYLcr6L_5fpxhGFMC7cJhyqWSNEgmai7');

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log('Email sent successfully:', data);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', JSON.stringify(emailError, null, 2));
    return { success: false, message: 'Failed to send verification email.' };
  }
}