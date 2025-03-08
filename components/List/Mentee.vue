<template>
    <div class="lg:px-4 mx-auto w-full flex flex-col gap-4 items-start lg:items-center">
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <button class="bg-nitMaroon-600 text-white rounded-md p-2" @click="_ => expandFilter = !expandFilter">Filter
                    {{ expandFilter ? `-` : `+` }}</button>
                <div
                    :class="`${expandFilter ? `max-h-[90rem]` : `max-h-0`} flex flex-col lg:flex-row gap-2 overflow-y-hidden transition-all duration-500 ease-in-out`">
                    <input type="text" id="search_field" v-model="batch"
                        class="w-48 lg:w-56 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Batch" />
                    <input type="text" id="search_field" v-model="mentor"
                        class="w-48 lg:w-56 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Mentor" />    
                    <input type="text" id="search_field" v-model="classSection"
                        class="w-48 lg:w-56 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Section" />
                    <input type="text" id="search_field" v-model="name"
                        class="w-48 lg:w-56 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Name" />
                    <input type="text" id="search_field" v-model="regNo"
                        class="w-48 lg:w-56 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Reg No" />
                </div>
            </div>
        </div>
        <table class="table-auto border-collapse w-full max-w-sm lg:max-w-full">
            <thead class="bg-nitMaroon-600 text-white text-xs lg:text-base">
                <th>Reg #</th>
                <th>Name</th>
                <th>Course</th>
                <th>Section</th>
                <th>Batch</th>
                <th v-if="mentees[0]?.mentor">Mentor</th>
                <th>Meetings</th>
                <th>update</th>
                <th>delete</th>
            </thead>
            <tbody>
                <tr v-for="mentee in computedMentees" :key="mentee.register_number"
                    class="text-xs lg:text-base text-center odd:bg-nitMaroon-100 even:bg-zinc-100 border-t border-nitMaroon-100 border-spacing-y-2">
                    <td>{{ mentee.register_number }}</td>
                    <td>{{ mentee.name }}</td>
                    <td>{{ mentee.year}}</td>
                    <td>{{ mentee.section }}</td>
                    <td>{{ mentee.batch }}</td>
                    <td v-if="mentee.mentor">{{ mentee.mentor.name }}</td>
                    <td>
                        <a :href="`/dashboard/mentees/${mentee.register_number}`"> <span class="sr-only">Check Meeting
                                Details</span>
                            <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                    stroke-linejoin="round" :d="`${AllIcons.userplus}`" />
                            </svg>
                        </a>
                    </td>
                    <td>
                        <button @click="openUpdateDialog(mentee)" class="bg-blue-200 hover:bg-blue-400 hover:text-white text-black rounded-md p-2 ml-2">Update</button>
                    </td>
                    <td>
                        <button @click="deleteMentee(mentee.register_number)" class="bg-red-300 hover:bg-red-600 hover:text-white text-black rounded-md p-2">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="!computedMentees.length">No mentees found</div>
    </div>
    <!-- <dialog>
    <template v-if="showUpdateDialog"></template>
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3 text-center">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Update Mentee</h3>
                    <div class="mt-2 px-7 py-3">
                        <input type="text" v-model="selectedMentee.name" placeholder="Name" class="w-full p-2 border rounded-md" />
                        <input type="text" v-model="selectedMentee.batch" placeholder="Batch" class="w-full p-2 border rounded-md mt-2" />
                        <input type="text" v-model="selectedMentee.section" placeholder="Section" class="w-full p-2 border rounded-md mt-2" />
                        <input type="text" v-model="selectedMentee.register_number" placeholder="Reg No" class="w-full p-2 border rounded-md mt-2" />
                    </div>
                    <div class="items-center px-4 py-3">
                        <button @click="selectedMentee && updateMentee(selectedMentee)" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600">Update</button>
                        <button @click="showUpdateDialog = false" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 mt-2">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </dialog> -->
</template>

<script setup lang="ts">
import type { PartialStudent, Faculty, User } from "@/types/types.js"
const { mentees } = defineProps<{ mentees: (PartialStudent)[] }>()

const message = ref({ type: '', text: '' });

const deleteMentee = (registerNumber: string) => {
    const index = mentees.findIndex(mentee => mentee.register_number === registerNumber);
    console.log(mentees[index],registerNumber);
    
    fetch(`/api/mentees/${registerNumber}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
        mentees.splice(index, 1);
        message.value = { type: 'success', text: 'Mentee deleted successfully' };
        } else {
        message.value = { type: 'error', text: 'Failed to delete mentee' };
        }
    })
    .catch(() => {
        message.value = { type: 'error', text: 'An error occurred' };
    });
};

const computedMentees = computed(() => {
    return !expandFilter.value ? mentees :
        mentees.filter(x => {
            return (
               
                (mentor.value ? x.mentor?.name.startsWith(mentor.value) : true) &&
                (batch.value ? x.batch.toString().startsWith(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value.toUpperCase() : true)&&
                (name.value ? x.name.toLowerCase().includes(name.value.toLowerCase()):true) &&
                (regNo.value ? x.register_number.startsWith(regNo.value):true)
            )
        })
})

const mentor =ref("")
const name=ref("")
const regNo=ref("")
const batch = ref("")
const classSection = ref("")
const expandFilter = ref(false)
</script>