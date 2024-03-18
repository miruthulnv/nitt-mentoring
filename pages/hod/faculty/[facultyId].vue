<template>
    <div class="flex flex-col gap-2">
        <InfoMentor v-if="faculty" :mentor="{ ...faculty, menteeCount: faculty.mentees.length }" />
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <div class="flex flex-row items-center gap-4">
                    <button class="bg-green-600 text-white rounded-md p-2" @click="pushChanges">Commit Changes</button>
                    <button class="bg-nitMaroon-600 text-white rounded-md p-2"
                        @click="_ => expandFilter = !expandFilter">Filter
                        {{ expandFilter ? `-` : `+` }}</button>
                </div>
                <div
                    :class="`${expandFilter ? `max-h-[90rem]` : `max-h-0`} flex flex-col lg:flex-row gap-2 overflow-y-hidden transition-all duration-500 ease-in-out`">
                    <input type="text" id="search_field" v-model="batch"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Batch" />
                    <input type="text" id="search_field" v-model="classSection"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Section" />
                        <input type="text" id="search_field" v-model="name"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Name" />
                        <input type="text" id="search_field" v-model="regNo"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Reg No" />
                </div>
            </div>
        </div>
        <!-- <div class="flex flex-wrap w-full justify-end items-center gap-5">
            <select v-model="selectedMeetingNumber" class="border-2 border-nitMaroon-600 rounded-md outline-none md:min-w-[250px] py-1.5">
                <option value="">Select Meeting Number</option>
                <option v-for="(meeting, index) in meetingNumbers" :value="meeting.meeting_number">{{ meeting?.meeting_number }}</option>
            </select>
            <button :class="['text-white', 'rounded-md', 'p-2', !selectedMeetingNumber ?'bg-nitMaroon-300' : 'bg-nitMaroon-600']" :disabled="!selectedMeetingNumber" @click="exportToPDF">Export to PDF</button>
        </div> -->
        <MiscMessage :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out`"
            :type="message.type">
            {{ message.text }}</MiscMessage>
        <table class="table-auto border-collapse w-full max-w-sm lg:max-w-full">
            <thead class="bg-nitMaroon-600 text-white text-xs lg:text-base">
                <th>Assigned</th>
                <th>Meetings Details</th>
                <th>Reg #</th>
                <th>Name</th>
                <th>Year</th>
                <th>Section</th>
                <th>Mentor</th>
            </thead>
            <tbody>
                <tr v-for="mentee in computedMentees" :key="mentee.register_number"
                    class="text-xs lg:text-base text-center odd:bg-nitMaroon-100 even:bg-zinc-100 border-t border-nitMaroon-100 border-spacing-y-2">
                    <td><input type="checkbox" :checked="mentee.mentor_id === Number(facultyId)"
                            :disabled="Boolean(mentee.mentor_id && mentee.mentor_id !== -1 && (mentee.mentor_id !== Number(facultyId)))"
                            @change="e => updateMentor(e, mentee.register_number)" /></td>
                    <td class=" font-bold"><a :href = "`/dashboard/mentees/${mentee.register_number}/meetings`">click here</a></td>
                    <td>{{ mentee.register_number }}</td>
                    <td>{{ mentee.name }}</td>
                    <td>{{ mentee.year }}</td>
                    <td>{{ mentee.section }}</td>
                    <td>{{ mentee.mentor?.name }}</td>
                </tr>
            </tbody>
        </table>
        <!-- Start of PDF Template -->
        <!-- <div ref="pdfContainer" :style="{ visibility: exportToPdfMode ? 'visible' : 'hidden' }">
            <div class="flex items-center justify-center gap-4 mb-3">
                <img src="/nitt_logo_min.webp" class="w-20 h-20" />
                <h1 class="text-lg lg:text-3xl font-bold pb-6">National Institute of Technology Tiruchirappalli</h1>
            </div>
            <hr class="bg-black h-[3px]"/>
            <div class="flex gap-6 items-center justify-center pt-4">
                <h1 class="text-xl lg:text-2xl font-bold pb-6">Mentor-Mentee Meeting #{{selectedMeetingNumber}}</h1>
            </div>
            <div class="flex gap-6 items-center pb-2 pt-2 font-semibold">
                <div class="w-1/2 flex">
                    <div class="w-40">Faculty Name</div>
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.mentor?.name}}</span></div>
                </div>
                <div class="w-1/2 flex">
                    <div class="w-40">Department</div>
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.department}}</span></div>
                </div>
            </div>
            <table class="w-full border-collapse border border-gray-700 mt-5">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="px-4 py-2 text-left border-r border-gray-700">Sl. No</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Reg. No</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Name</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Discussion</th>
                        <th class="px-4 py-2 text-left border-r border-gray-700">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(meeting, index) in meetings" :key="meeting.meeting_number" class="border-t border-gray-700">
                        <td class="px-4 py-2 border-r border-gray-700">{{ index + 1 }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.mentee?.register_no }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.mentee?.name }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ meeting?.discussion }}</td>
                        <td class="px-4 py-2 border-r border-gray-700">{{ new Date(meeting?.date).toLocaleDateString('en-GB') }}</td> 
                    </tr>
                </tbody>
            </table>
        </div> -->
        <!-- End of PDF Template -->
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        "level2"
    ]
})

const auth = useCookie<string>("nitt_token")
const route = useRoute()
const router = useRouter()
const facultyId = route.params.facultyId;
const faculty = await useFaculty(Number(facultyId))

const mentees = (await useSudoMentee())?.map(mentee => ({ ...mentee, mentor: mentee.mentor || { name: "Not Assigned" } }))
const filteredMentees = mentees.filter(mentee => mentee.mentor_id === Number(facultyId) || mentee.mentor_id === null);

if (!faculty) nextTick(() => router.go(-1))
else mentees?.sort((a, b) => a.mentor_id === faculty.id && b.mentor_id !== faculty.id ? -1 : a.mentor_id !== faculty.id && b.mentor_id === faculty.id ? 1 : 0)

const menteeMap = new Map<string, number>();

mentees?.forEach(mentee => menteeMap.set(mentee.register_number, mentee.mentor_id || -1));

const updateMentor = async (e: Event, regno: string) => {
    const box = e.currentTarget as HTMLInputElement;
    const mentor_id = box.checked ? Number(facultyId) : -1
    menteeMap.set(regno, mentor_id);
}

const pushChanges = async () => {
    let successes = 0;
    for await (const [mtee, mtor] of menteeMap.entries()) {
        if (mtor !== mentees.find(x => x.register_number === mtee)?.mentor_id) {
            await useFetch<{ token: string }>(`/api/mentees/${mtee}`, {
                method: "PATCH", body: JSON.stringify({ mentor_id: mtor }),
                headers: { "Authorization": `Bearer ${auth.value}` },
                onResponse({ request, response, options }) {
                    successes += 1;
                },
                onResponseError({ request, response, options }) {
                    message.value.type = "error"
                    message.value.text = `Unable to change mentor for ${mtee}!`
                    successes -= 1;
                }
            })
        }
    }
    message.value.type = "success"
    message.value.text = `Mentor for ${successes} students changed!`
    setTimeout(() => router.go(0), 3000)
}

const computedMentees = computed(() => {
    return !expandFilter.value ? filteredMentees :
        filteredMentees.filter(x => {
            return (
                (batch.value ? x.batch.toString().startsWith(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value.toUpperCase() : true)&&
                (name.value ? x.name.toLowerCase().includes(name.value.toLowerCase()):true) &&
                (regNo.value ? x.register_number.startsWith(regNo.value):true)
            )
        })
})


const name=ref("")
const batch=ref("")
const regNo=ref("")
const classSection = ref("")
const expandFilter = ref(false)
const message = ref({ text: "", type: 'success' })

// const selectedMeetingNumber = ref("");
// const meetings = ref();
// const meetingNumbers:any = await useMeetings(Number(facultyId));

// watch(selectedMeetingNumber, async (newMeetingNumber: string) => {
//     if (newMeetingNumber) {
//         meetings.value = await useMeetingsNumber(parseInt(newMeetingNumber)) || [];
//     } else {
//         meetings.value = [];
//     }
// });
</script>

<script lang="ts">
// const exportToPdfMode = ref(false);

// export default {
//     name: 'app',
//     methods: {
//         exportToPDF() {
//             if (typeof window !== 'undefined') {
//                 exportToPdfMode.value = true;
//                 const filename = `Mentor_Mentee_Meeting_List.pdf`;
//                 import('html2pdf.js').then((html2pdf) => {
//                     html2pdf.default(this.$refs.pdfContainer, {
//                         margin: 0.7,
//                         filename: filename,
//                         image: { type: 'jpeg', quality: 1 },
//                         html2canvas: { dpi: 192, letterRendering: true },
//                         jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
//                     });
//                     exportToPdfMode.value = false;
//                 }).catch(error => {
//                     console.error('Failed to load html2pdf:', error);
//                     exportToPdfMode.value = false;
//                 });
//             } else {
//                 console.error('Cannot export to PDF: window is not defined.');
//             }
//         }
//     }
// }
</script>
