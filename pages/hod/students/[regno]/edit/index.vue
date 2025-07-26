<template>
  <div class="flex flex-col gap-4 p-2 mt-12">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl uppercase font-bold">Edit Student: {{ mentee?.name }}</h1>
      <NuxtLink 
        :to="`/hod/students`"
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
      >
        Back to Students
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-lg text-gray-600">
      Loading student information...
    </div>

    <div v-else-if="mentee" class="max-w-2xl mx-auto">
      <!-- Basic Information -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-nitMaroon-600">Basic Information</h2>
        <form @submit.prevent="updateBasicInfo" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
            <input 
              v-model="basicForm.register_number" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-md"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              v-model="basicForm.name" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select v-model="basicForm.year" class="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input 
              v-model="basicForm.section" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <input 
              v-model="basicForm.batch" 
              type="number" 
              class="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select v-model="basicForm.department_id" class="w-full p-2 border border-gray-300 rounded-md" required>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <button 
            type="submit" 
            class="w-full bg-nitMaroon-600 text-white py-2 px-4 rounded-md hover:bg-nitMaroon-700 transition-colors"
            :disabled="updating"
          >
            {{ updating ? 'Updating...' : 'Update Basic Info' }}
          </button>
        </form>
      </div>
    </div>

    <div v-else class="text-red-500 font-medium">
      Student not found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartialStudent, Department } from '@/types/types';

definePageMeta({
  title: "Edit Student",
  middleware: ["level2"]
})

const route = useRoute()
const regno = route.params.regno as string

const mentee = ref<PartialStudent | null>(null)
const departments = ref<Department[]>([])
const loading = ref(true)
const updating = ref(false)

// Form data
const basicForm = ref({
  register_number: '',
  name: '',
  year: 'UG',
  section: '',
  batch: 0,
  department_id: ''
})

// Fetch student data
onMounted(async () => {
  try {
    const [studentData, deptData] = await Promise.all([
      $fetch(`/api/mentees/${regno}`, {
        headers: {
          Authorization: `Bearer ${useCookie('nitt_token').value}`
        }
      }),
      $fetch('/api/dept', {
        headers: {
          Authorization: `Bearer ${useCookie('nitt_token').value}`
        }
      })
    ]) as [PartialStudent, Department[]]

    mentee.value = studentData
    departments.value = deptData

    // Populate form
    basicForm.value = {
      register_number: studentData.register_number,
      name: studentData.name,
      year: studentData.year,
      section: studentData.section || '',
      batch: studentData.batch || 0,
      department_id: studentData.department?.id || ''
    }
  } catch (error) {
    console.error('Error fetching student data:', error)
  } finally {
    loading.value = false
  }
})

async function updateBasicInfo() {
  updating.value = true
  try {
    await $fetch(`/api/mentees/update/${regno}/basic`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${useCookie('nitt_token').value}`
      },
      body: {
        name: basicForm.value.name,
        year: basicForm.value.year,
        section: basicForm.value.section,
        batch: basicForm.value.batch,
        department_id: basicForm.value.department_id
      }
    })
    
    alert('Basic information updated successfully!')
  } catch (error) {
    console.error('Error updating basic info:', error)
    alert('Failed to update basic information')
  } finally {
    updating.value = false
  }
}
</script> 