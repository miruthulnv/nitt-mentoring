
import { Client } from "../../utils/database.js";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required',
      });
    }

    const user = await client.prisma.users.findUnique({
      where: { username: email },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    const token = jwt.sign({ email: user.username }, process.env.JWT_KEY, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/change-password?token=${token}`;

    await sendEmail(
      user.username,
      'Password Reset',
      `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`
    );

    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error in password reset:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while processing your request',
    });
  }
});
