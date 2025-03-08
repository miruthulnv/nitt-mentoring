import { Client } from "../../../utils/database.js";
import { verifyJwt } from "../../../utils/jwt.js";

const client = new Client();

export default defineEventHandler(async (e) => {
  const regnoStr = getRouterParam(e, "regno");
  const regno = regnoStr;

  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }
  const token = auth.slice(7);
  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || Date.now() / 1000 > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  try {
    await client.prisma.students.delete({
      where: { register_no: regno },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusText: "Failed to delete student.",
    });
  }

  return {
    message: "Student deleted successfully.",
  };
});