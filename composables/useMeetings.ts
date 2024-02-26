import type { Meeting } from "@/types/types.js";

export async function useMeeting(id: number) {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  const meeting = await $fetch<Meeting>(
    `/api/meetings/${id}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${auth.value}` },
    },
  );
  return meeting;
}
export async function useMeetings(mentorId: number) {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  if (!mentorId) return false;

  const meeting = await $fetch<Meeting>(
    `/api/meetings/${mentorId}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${auth.value}` },
    },
  );
  if (!meeting) return [];
  return meeting;
}

export async function useMeetingsNumber(meetingNumber: number) {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  if (!meetingNumber) return false;

  const meeting = await $fetch<Meeting>(
    `/api/meetings/${meetingNumber}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${auth.value}` },
    },
  );
  if (!meeting) return [];
  return meeting;
}