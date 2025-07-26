<template>
    <div class="flex flex-col gap-4 p-2 mt-12">
        <h1 class="text-2xl uppercase font-bold">All Students</h1>
        <ListMentee v-if="mentees.length" :mentees="mentees" @deleted="handleDeleted" />
        <div v-else class="text-lg text-gray-600">Loading students...</div>
    </div>
</template>

<script setup lang="ts">
import type { PartialStudent, Department, FacultyInfo } from '@/types/types';

definePageMeta({
    title: "All Students",
    middleware: ["level1"]
})

const mentees = ref<PartialStudent[]>([])

// Fetch mentees with reactivity
onMounted(async () => {
    const data = await useSudoMentee()
    mentees.value = (data || []).map(mentee => ({
        register_number: mentee.register_number,
        name: mentee.name,
        year: mentee.year,
        section: mentee.section,
        batch: typeof mentee.batch === 'number' ? mentee.batch : Number(mentee.batch) || 0,
        department: mentee.department || { name: 'Unknown', id: 'unknown' },
        mentor_id: mentee.mentor_id,
        mentor: mentee.mentor || undefined,
        is_pg: typeof mentee.is_pg === 'boolean' ? mentee.is_pg : false
    }))
})
// Handle deletion from child
function handleDeleted(register_number: string) {
    mentees.value = mentees.value.filter(
        m => m.register_number !== register_number
    )
}
</script>