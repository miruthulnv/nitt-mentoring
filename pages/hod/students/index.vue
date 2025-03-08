<template>
    <div class="flex flex-col gap-4 p-2 mt-12">
        <h1 class="text-2xl uppercase font-bold">All Students</h1>
        <ListMentee v-if="mentees.length" :mentees="mentees" @deleted="handleDeleted" />
        <div v-else class="text-lg text-gray-600">Loading students...</div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: "All Students",
    middleware: ["level1"]
})

interface PartialStudent {
    register_number: string;
    name: string;
    year: string;
    section: string;
    batch: string;
    mentor?: { name: string };
}

const mentees = ref<PartialStudent[]>([])

// Fetch mentees with reactivity
onMounted(async () => {
    const data = await useSudoMentee()
    mentees.value = (data || []).map(mentee => ({
        ...mentee,
        mentor: mentee.mentor || { name: "Not Assigned" }
    }))
})

// Handle deletion from child
function handleDeleted(registerNumber: string) {
    mentees.value = mentees.value.filter(
        m => m.register_number !== registerNumber
    )
}
</script>