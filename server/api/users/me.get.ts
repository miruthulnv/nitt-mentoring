import { Client } from "../../utils/database.js";

interface findUserType {
  userName: string,
  level: number,
  id: number | string,
  is_pg?: boolean
}

const client = new Client();
export default defineEventHandler(async (e) => {
  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    // Not a valid auth token
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  } else {
    const token = auth.slice(7);
    const jwtPayload = await verifyJwt(token);
    if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
      throw createError({
        statusCode: 401,
        statusText: "Session expired. Please login again.",
      });
    }
    const user = await client.prisma.users.findFirst({
      where: { id: Number(jwtPayload.id) },
    });
    if (user) {
      const result: findUserType = {
        userName: user.username,
        level:    user.level,
        id:       user.id,
      };
      return result;
    } else {
      throw createError({
        statusCode: 404,
      });
    }
  }
});
