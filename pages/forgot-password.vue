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
const route = useRoute();

const message = ref({ type: "error", text: "" })

// If there was an error during password reset
let reseterr = route.query.reseterr as string;
if(reseterr){
    message.value.type = "error"
    if(reseterr == 'invalid'){
        message.value.text = "Invalid email address."
    }else if(reseterr == 'notfound'){
        message.value.text = "No account found with this email address."
    }else if(reseterr == 'unknown'){
        message.value.text = "An unknown error occurred."
    }
}

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const email = formData.get("email");

    await useFetch(`/api/users/reset-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
        onResponse({ request, response, options }) {
            if(response._data.message == 'Success'){
                message.value.type = "info"
                message.value.text = "Password reset instructions sent to your email."
            }
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    navigateTo('/forgot-password?reseterr=invalid')
                    break;
                case 404:
                    navigateTo('/forgot-password?reseterr=notfound')
                    break;
                default:
                    navigateTo('/forgot-password?reseterr=unknown')
                    break;
            }
            abortNavigation()
        }
    })
};
</script>
