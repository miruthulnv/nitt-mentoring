<template>
    <div v-if="mentee" class="lg:px-4 mx-auto w-full flex flex-col items-start lg:items-center">
        <InfoMentee v-if="mentee" :mentee="mentee" />
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <a v-if="mentee" :href="`/dashboard/mentees/${mentee.register_number}/edit/special`"
                    class="bg-nitMaroon-600 text-white rounded-md p-2">
                    Add Special Info</a>
            </div>
            <div class="flex flex-col items-end gap-4">
                <a v-if="mentee" :href="`/dashboard/mentees/${mentee.register_number}/meetings/new`"
                    class="bg-nitMaroon-600 text-white rounded-md p-2">
                    New Meeting</a>
            </div>
        </div>
        <h1 class="text-2xl font-bold self-start mt-12">Meetings</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch w-full gap-4 mt-5 pr-4 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-6xl">
            <ul v-for="meeting, i in meetings" :key="`meeting_${meeting.id}`"
                class="text-start bg-zinc-100 rounded-md p-2 block w-full">
                <li class="font-bold">Meeting #{{ i+1 }}</li>
                <li class="font-semibold text-xs">{{ new Date(meeting.date).toISOString().split("T")[0] }}</li>
                <li>{{ meeting.discussion }}</li>
               
            </ul>
        </div>
        <div v-if="!meetings.length">No past meetings</div>
    </div>
</template>
<script setup lang="ts">
import type { Meeting } from "@/types/types.js"
definePageMeta({
    middleware: [
        "level1"
    ]
})
// const userStore = useUserStore()
const route = useRoute();

const regno = route.params.regno as string;

const mentee = await useMentee(regno)

const meetings = ref<Meeting[]>([])

if (!mentee) {
    nextTick(() => {
        alert("No such student exists with Reg #" + regno)
        navigateTo("/dashboard")
    })
} else {
    meetings.value = mentee.meetings.map(x => ({ ...x, date: new Date(x.date) })).sort((a, b) => b.date.getTime() - a.date.getTime());
    //  meetings.value = mentee.meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
</script>