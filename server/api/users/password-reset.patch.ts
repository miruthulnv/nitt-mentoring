import { Client } from "../../utils/database";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import config from "~/config";

const client = new Client();

export default defineEventHandler(async (event) => {
  try {
    const { username, newPassword, token } = await readBody(event);

    if (!username || !newPassword || !token) {
      return {
        statusCode: 400,
        body: { message: "All fields are required" },
      };
    }
    console.log(username, newPassword, token);
    let decodedToken: { username: string };
    try {
      decodedToken = jwt.verify(token, config.JWT_KEY) as { username: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: { message: "Invalid or expired token" },
      };
    }

    if (decodedToken.username !== username) {
      return {
        statusCode: 401,
        body: { message: "Pls check your username... " },
      };
    }

    const user = await client.prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: { message: "User not found" },
      };
    }

    const encryptedPass = await hash(newPassword, 10);

    await client.prisma.users.update({
      where: { username: username },
      data: { password: encryptedPass },
    });

    return {
      statusCode: 200,
      body: { message: "Password changed successfully" },
    };
  } catch (error) {
    console.error("Error in password change:", error);
    return {
      statusCode: 500,
      body: { message: "An error occurred while processing your request" },
    };
  }
});
