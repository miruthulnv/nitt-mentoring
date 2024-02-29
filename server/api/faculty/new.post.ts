import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";

const client = new Client();

type UserCreds = {
  faculty_id: string;
  username: string;
  password: string;
  level: number;
  name: string;
  department: string;
};

export default defineEventHandler(async (e) => {
  const body = await readBody<UserCreds>(e);
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
    if (Number(jwtPayload.level) < 3 && body.level && body.level != 1) {
      body.level = 1
    } else if (Number(jwtPayload.level) < 2) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }

    if (
      !body.username || !body.password || !body.name || !body.department || !body.faculty_id
    ) {
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
    const encryptedPass = await hash(
      body.password,
      10,
    );
    try {
      let userCreated: any;
      let facultyCreated: any;
      await client.prisma.$transaction(async (prisma) => {
        userCreated = await prisma.users.create({
          data: { username: body.username, password: encryptedPass, level: body.level || 1 },
        });
        facultyCreated = await prisma.faculty.create({
          data: {
            id: parseInt(body.faculty_id),
            user_id: userCreated.id,
            name: body.name,
            department_id: body.department,
          },
        });
      });
      if (userCreated && facultyCreated) {
        return { message: "Account created successfully!", id: userCreated.id };
      } else {
        throw new Error("Failed to create user or faculty");
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "PrismaClientKnownRequestError") {
          // @ts-ignore ik
          if (err.code === "P2002") {
            // @ts-ignore ik
            const field = err.meta.target; //err.message.match(/\(`(\w+)`\)/);
            throw createError({
              statusCode: 400,
              message: err.message
              // statusText: `An account already exist with the provided ${
              //   field[0].split("_").join(" ")
              // }`,
            });
          }
        }
      }
      console.log(err);
      throw createError({
        statusCode: 400,
        message: "Error creating account"
        // statusText: `An account already exist with the provided ${
        //   field[0].split("_").join(" ")
        // }`,
      });
    }
  }
});
