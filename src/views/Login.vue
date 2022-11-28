<template>
  <div class="flex flex-col items-center">
    <input
      placeholder="Email"
      v-model="email"
      class="
        flex
        items-center
        px-4
        mb-2
        leading-normal
        text-gray-700
        border
        rounded-lg
        shadow
        appearance-none
        h-11
        focus:outline-none focus:shadow-outline
      "
    />
    <input
      placeholder="Mot de passe"
      @keyup.enter="connect"
      v-model="password"
      type="password"
      class="
        flex
        items-center
        px-4
        mb-2
        leading-normal
        text-gray-700
        border
        rounded-lg
        shadow
        appearance-none
        h-11
        focus:outline-none focus:shadow-outline
      "
    />
    <button
      @click="connect"
      class="
        flex
        items-center
        px-6
        text-white
        bg-green-800
        rounded-lg
        h-11
        hover:bg-green-600
        focus:outline-none
      "
    >
      Connexion
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref(null);
const password = ref(null);

async function connect() {
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value);
    console.log(`${email.value} est connecté`);
    router.push("/admin");
  } catch (error) {
    console.log(error.message);
  }
}
</script>