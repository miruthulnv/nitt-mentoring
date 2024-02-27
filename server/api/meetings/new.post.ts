import { Client } from "../../utils/database.js";

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

    if (Number(jwtPayload.level) < 1) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }

    const body = await readBody<{ date: Date, discussion: string; mentee_id: string }>(e);
    if (
      ["date", "discussion", "mentee_id"].some((k) => !Object.hasOwn(body, k))
    ) {
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
    try {
      const user = await client.prisma.faculty.findFirst({
        where: { user_id: Number(jwtPayload.id) },
      });
      if (!user) throw "No user found.";
      let nextMeetingNumber = 1;
      try {
        const lastMeeting = await client.prisma.meetings.findFirst({
          where: {
            mentee_id: body.mentee_id,
          },
          orderBy: {
            meeting_number: 'desc',
          },
        });
        if (lastMeeting) {
          nextMeetingNumber = lastMeeting.meeting_number + 1;
        }
      } catch (err) {
        console.log(err);
      }
      const newMeeting = await client.prisma.meetings.create({
        data: { meeting_number: nextMeetingNumber, date: new Date(body.date), discussion: body.discussion, mentor_id: user.id, mentee_id: body.mentee_id },
      });
      if (!newMeeting) return false;
      return { message: "Meeting recorded successfully!" };
    } catch (err) {
      console.log(err)
      throw createError({
        statusCode: 404,
        statusText: "No faculty found with your ID.",
      });
    }
  }
});
