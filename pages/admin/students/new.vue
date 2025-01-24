<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <h1 class="text-2xl font-bold">Create Student Account</h1>
            
            <!-- Student Type Selection -->
            <div class="flex flex-col items-center gap-4 w-full">
                <select 
                    v-model="studentType" 
                    class="p-2 w-full lg:w-96 rounded-md shadow-md"
                >
                    <option value="UG">Undergraduate Student</option>
                    <option value="PG">Postgraduate Student</option>
                </select>
            </div>

            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="name_field" class="w-full text-start">
                        Name
                    </label>
                    <input name="name" id="name_field" type="text" placeholder="John Doe"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="username_field" class="w-full text-start">
                        Roll Number
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="Roll Number"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                        Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Password"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                
                <!-- Conditional Fields Based on Student Type -->
                <div v-if="studentType === 'UG'" class="flex flex-row items-center gap-2">
                    <input name="batch" type="number" class="p-2 w-full rounded-md shadow-md" placeholder="Batch" />
                    <select name="year" class="p-2 w-full rounded-md shadow-md" >
                        <option value="" hidden>Course</option>
                        <option value="UG">UG</option>
                    </select>
                    <input name="section" type="text" class="p-2 w-full rounded-md shadow-md" placeholder="Section" />
                </div>

                <div v-else class="flex flex-col items-center gap-2 w-full">
                    <div class="flex flex-row items-center gap-2 w-full">
                        <input name="ugCGPA" type="number" step="0.01" min="0" max="10" 
                            class="p-2 w-full rounded-md shadow-md" placeholder="UG CGPA" />
                        <input name="gateScore" type="number" 
                            class="p-2 w-full rounded-md shadow-md" placeholder="GATE Score" />
                    </div>
                    <div class="flex flex-row items-center gap-2 w-full">
                        <input name="workExperience" type="text" 
                            class="p-2 w-full rounded-md shadow-md" placeholder="Work Experience (Optional)" />
                        <select name="year" class="p-2 w-full rounded-md shadow-md" >
                            <option value="" hidden>Course</option>
                            <option value="PG">PG</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="dept_field" class="w-full text-start">
                        Department
                    </label>
                    <select name="department" id="dept_field" placeholder="Dept"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md">
                        <option v-for="dep in dept" :key="dep.id" :value="dep.id">{{ dep.name }}</option>
                    </select>
                </div>
                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Create User
                </button>
            </form>
            <hr class="border border-stone-400 w-full lg:w-96" />
            <input type="file" accept=".xlsx ,.xls" ref="fileInput" @change="handleFileChange" />
            <button @click="uploadFile"
                class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">Upload
                Excel File</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { read, utils } from 'xlsx';

interface studentData {
    name: string;
    regno: string;
    password: string;
    department: string;
    batch?: number;
    year: string;
    section?: string;
    ugCGPA?: number;
    gateScore?: number;
    workExperience?: string;
}

const studentType = ref('UG');
const stud = ref<studentData[]>([]);

const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const wb = read(arrayBuffer);

        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: studentData[] = utils.sheet_to_json<studentData>(ws);

        data.forEach((element) => {
            element.regno = element.regno.toString();
        });

        stud.value = data;
    };

    reader.readAsArrayBuffer(file);
};

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const selectedFile = fileInput.files?.[0];
    if (selectedFile) {
        handleFileUpload(selectedFile);
    }
};

const uploadFile = async (e: Event) => {
    e.preventDefault();

    stud.value.forEach(async (element) => {
        await upload(element);
    })
}

async function upload(record: studentData) {
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", 
        body: JSON.stringify(record),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "Please verify the data."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()
        }
    })
}

definePageMeta({
    middleware: "level2"
})
const route = useRoute();

const message = ref({ type: "error", text: "" })

const dept = await useDept()

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    
    const creds: studentData = {
        name: formData.get("name") as string,
        regno: formData.get("username") as string,
        password: formData.get("password") as string,
        department: formData.get("department") as string,
        year: formData.get("year") as string,
    };

    // Add conditional fields based on student type
    if (studentType.value === 'UG') {
        creds.batch = Number(formData.get("batch"));
        creds.section = formData.get("section") as string;
    } else {
        creds.ugCGPA = Number(formData.get("ugCGPA"));
        creds.gateScore = Number(formData.get("gateScore"));
        creds.workExperience = formData.get("workExperience") as string;
    }

    console.log(creds);
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", 
        body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "Please verify the data."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()
        }
    })
};
</script>