import { Client } from "../../../../utils/database.js";

const client = new Client();
export default defineEventHandler(async (e) => {
  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  }

  const token = auth.slice(7);
  const jwtPayload = await verifyJwt(token);
  if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
    throw createError({
      statusCode: 401,
      statusText: "Session expired. Please login again.",
    });
  }

  if (Number(jwtPayload.level) < 2) {
    throw createError({
      statusCode: 401,
      statusText: "You do not have permission.",
    });
  }

  const regno = getRouterParam(e, "regno");
  const body = await readBody<{
    name?: string;
    year?: string;
    section?: string;
    batch?: number;
    department_id?: string;
  }>(e);

  try {
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        name: body.name,
        year: body.year,
        section: body.section,
        batch: body.batch,
        department_id: body.department_id,
      },
    });

    return {
      message: "Basic information updated successfully.",
    };
  } catch (error) {
    console.error("Error updating basic info:", error);
    throw createError({
      statusCode: 500,
      statusText: "Failed to update basic information.",
    });
  }
});
