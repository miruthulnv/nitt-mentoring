<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <h1 class="text-2xl font-bold">NITT Mentoring Portal - Forgot Password</h1>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="email_field" class="w-full text-start">
                        Email
                    </label>
                    <input name="email" id="email_field" type="email" placeholder="johndoe@example.com"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <MiscMessage :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Reset Password
                </button>
            </form>
            <hr class="border border-stone-400 w-full lg:w-96" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from 'nuxt/app'

const message = ref({ type: "error", text: "" })

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const email = formData.get("email");

    try {
        const { data } = await useFetch('/api/users/password-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })

        if (data.value) {
            message.value = {
                type: data.value.statusCode === 200 ? "info" : "error",
                text: data.value.body.message
            }
        }
    } catch (err) {
        console.error('Error:', err);
        message.value = {
            type: "error",
            text: "An unexpected error occurred."
        }
    }
};
</script>
