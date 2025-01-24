// api/password-reset.patch.ts

import { Client } from "../../utils/database.js";
import { hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken';

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const { email, newPassword, confirmPassword, token } = await readBody(event);

    if (!email || !newPassword || !confirmPassword || !token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required',
      });
    }

    if (newPassword !== confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Passwords do not match',
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      });
    }

    if (decodedToken.email !== email) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token does not match the provided email',
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

    const encryptedPass = await hash(newPassword, 10);

    await client.prisma.users.update({
      where: { username: email },
      data: { password: encryptedPass },
    });

    return { message: 'Password changed successfully' };
  } catch (error :any) {
    console.error('Error in password change:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An error occurred while processing your request',
    });
  }
});
