<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl uppercase font-bold">Your Mentees</h1>
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <button class="bg-nitMaroon-600 text-white rounded-md p-2" @click="_ => expandFilter = !expandFilter">Filter
                    {{ expandFilter ? `-` : `+` }}</button>
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
        <div class="flex flex-wrap w-full justify-end items-center gap-5">
            <select v-model="selectedMeetingNumber" class="border-2 border-nitMaroon-600 rounded-md outline-none md:min-w-[250px] py-1.5">
                <option value="">Select Meeting Number</option>
                <option v-for="(meeting, index) in meetingNumbers" :value="meeting.meeting_number">{{ meeting?.meeting_number }}</option>
            </select>
            <button :class="['text-white', 'rounded-md', 'p-2', !selectedMeetingNumber ?'bg-nitMaroon-300' : 'bg-nitMaroon-600']" :disabled="!selectedMeetingNumber" @click="exportToPDF">Export to PDF</button>
        </div>
        <div class="flex flex-col space-y-4">
            <EditableMentee v-for="mentee in computedMentees" :mentee="mentee" :key="mentee?.meeting_number" />
        </div>
        <!-- Start of PDF Template -->
        <div ref="pdfContainer" :style="{ visibility: exportToPdfMode ? 'visible' : 'hidden' }">
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
                    <div class="w-60">: <span class="pl-2">{{mentees[0]?.mentor?.department}}</span></div>
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
        </div>
        <!-- End of PDF Template -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
    middleware: ["level1"]
});

const mentees = await useMentee();
const meetingNumbers:any = await useMeetings(mentees[0]?.mentor?.id);

const selectedMeetingNumber = ref("");
const meetings = ref();

watch(selectedMeetingNumber, async (newMeetingNumber: string) => {
    if (newMeetingNumber) {
        meetings.value = await useMeetingsNumber(parseInt(newMeetingNumber)) || [];
    } else {
        meetings.value = [];
    }
});

const computedMentees = computed(() => {
    return !expandFilter.value ? mentees :
        mentees.filter(x => {
            return (
                (batch.value ? x.batch.toString().startsWith(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value.toUpperCase() : true) &&
                (name.value ? x.name.toLowerCase().includes(name.value.toLowerCase()) : true) &&
                (regNo.value ? x.register_number.startsWith(regNo.value) : true)
            );
        });
});

const batch = ref("");
const name = ref("");
const regNo = ref("");
const classSection = ref("");
const pdfContainer = ref("");
const expandFilter = ref(false);
</script>

<script lang="ts">
const exportToPdfMode = ref(false);

export default {
    name: 'app',
    methods: {
        exportToPDF() {
            if (typeof window !== 'undefined') {
                exportToPdfMode.value = true;
                const filename = `Mentor_Mentee_Meeting_List.pdf`;
                import('html2pdf.js').then((html2pdf) => {
                    html2pdf.default(this.$refs.pdfContainer, {
                        margin: 0.7,
                        filename: filename,
                        image: { type: 'jpeg', quality: 1 },
                        html2canvas: { dpi: 192, letterRendering: true },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
                    });
                    exportToPdfMode.value = false;
                }).catch(error => {
                    console.error('Failed to load html2pdf:', error);
                    exportToPdfMode.value = false;
                });
            } else {
                console.error('Cannot export to PDF: window is not defined.');
            }
        }
    }
}
</script>
