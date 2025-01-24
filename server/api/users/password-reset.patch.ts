import { Client } from "../../utils/database";
import { hash } from "bcrypt";
import jwt from 'jsonwebtoken';

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const { email, newPassword, token } = await readBody(event);

    if (!email || !newPassword || !token) {
      return {
        statusCode: 400,
        body: { message: 'All fields are required' }
      };
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return {
        statusCode: 401,
        body: { message: 'Invalid or expired token' }
      };
    }

    if (decodedToken.email !== email) {
      return {
        statusCode: 401,
        body: { message: 'Token does not match the provided email' }
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

    const encryptedPass = await hash(newPassword, 10);

    await client.prisma.users.update({
      where: { username: email },
      data: { password: encryptedPass },
    });

    return {
      statusCode: 200,
      body: { message: 'Password changed successfully' }
    };
  } catch (error) {
    console.error('Error in password change:', error);
    return {
      statusCode: 500,
      body: { message: 'An error occurred while processing your request' }
    };
  }
});