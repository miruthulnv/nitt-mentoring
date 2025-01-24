import { Client } from "../../utils/database.js";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    if (!email) {
      return {
        statusCode: 400,
        body: { message: 'Email is required' }
      };
    }

    const user = await client.prisma.users.findUnique({
      where: { username: email },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: { message: 'User not found' }
      };
    }

    const token = jwt.sign({ email: user.username }, process.env.JWT_KEY, { expiresIn: '3m' });
    const resetLink = `${process.env.FRONTEND_URL}/change-password?token=${token}`;
    console.log(resetLink);
    await sendEmail(
      user.username,
      'Password Reset',
      `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`
    );

    return {
      statusCode: 200,
      body: { message: 'Password reset email sent successfully' }
    };
  } catch (error) {
    console.error('Error in password reset:', error);
    return {
      statusCode: 500,
      body: { message: 'An error occurred while processing your request' }
    };
  }
});
