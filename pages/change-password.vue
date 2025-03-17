<template>
  <div class="p-2 flex flex-col items-center w-full mt-12">
    <div
      class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full"
    >
      <h1 class="text-2xl font-bold">
        NITT Mentoring Portal - Change Password
      </h1>
      <form
        class="flex flex-col items-center gap-4 pt-8"
        @submit="handleSubmit"
      >
        <div class="flex flex-col items-center gap-2">
          <label htmlFor="username_field" class="w-full text-start">
            Username
          </label>
          <input
            v-model="username"
            name="username"
            id="username_field"
            type="text"
            placeholder="106123082"
            class="p-2 w-full lg:w-96 rounded-md shadow-md"
          />
        </div>
        <div class="flex flex-col items-center gap-2">
          <label htmlFor="password_field" class="w-full text-start">
            New Password
          </label>
          <input
            v-model="password"
            name="password"
            id="password_field"
            type="password"
            placeholder="New Password"
            class="p-2 w-full lg:w-96 rounded-md shadow-md"
          />
        </div>
        <div class="flex flex-col items-center gap-2">
          <label htmlFor="confirm_password_field" class="w-full text-start">
            Confirm New Password
          </label>
          <input
            v-model="confirmPassword"
            name="confirm_password"
            id="confirm_password_field"
            type="password"
            placeholder="Confirm New Password"
            class="p-2 w-full lg:w-96 rounded-md shadow-md"
          />
        </div>
        <MiscMessage
          :class="`${
            message.text ? `opacity-100` : `opacity-0`
          } transition duration-500 ease-in-out w-full lg:w-96`"
          :type="message.type"
        >
          {{ message.text }}
        </MiscMessage>
        <button
          type="submit"
          class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8"
        >
          Change Password
        </button>
      </form>
      <hr class="border border-stone-400 w-full lg:w-96" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";

const route = useRoute();
const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref({ type: "error", text: "" });
const token = ref("");

onMounted(() => {
  token.value = route.query.token as string;
  if (!token.value) {
    message.value = { type: "error", text: "Invalid or missing token." };
    return;
  }

  try {
    const decoded = jwtDecode(token.value) as { username: string; exp: number };
    if (Date.now() >= decoded.exp * 1000) {
      message.value = { type: "error", text: "Token has expired." };
      return;
    }
    username.value = decoded.username;
  } catch (error) {
    message.value = { type: "error", text: "Invalid token." };
  }
});

const validatePassword = () => {
  if (password.value !== confirmPassword.value) {
    message.value = { type: "error", text: "Passwords do not match." };
    return false;
  }
  if (password.value.length < 8) {
    message.value = {
      type: "error",
      text: "Password must be at least 8 characters long.",
    };
    return false;
  }
  return true;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!validatePassword()) return;

  try {
    const { data } = await useFetch("/api/users/password-reset", {
      method: "PATCH",
      body: JSON.stringify({
        username: username.value,
        newPassword: password.value,
        token: token.value,
      }),
    });
    if (data.value) {
      message.value = {
        type: data.value.statusCode === 200 ? "info" : "error",
        text: data.value.body.message,
      };
      if (data.value.statusCode === 200) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  } catch (error: any) {
    message.value = {
      type: "error",
      text: error.message || "An error occurred while changing the password.",
    };
  }
};
</script>
