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
        const mentorId = getRouterParam(e, "mentorId");

        if (!mentorId) return false;
        const meeting = await client.prisma.meetings.findMany({
            where: { mentor_id: parseInt(mentorId) },
            orderBy: {
                meeting_number: 'asc',
            },
            distinct: "meeting_number"
        });
        if (meeting) {
            if (
                Number(jwtPayload.level) < 1) {
                throw createError({
                    statusCode: 401,
                    statusText: "You do not have permission.",
                });
            }
            return meeting;
        } else {
            throw createError({
                statusCode: 404,
            });
        }
    }
});
