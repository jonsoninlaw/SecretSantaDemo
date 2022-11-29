<template>
  <div class="flex flex-col items-center w-full xmas">
    <div class="flex flex-col items-stretch justify-center mb-8">
      <input
        @keyup.enter="addUser"
        type="text"
        class="flex items-center w-full px-4 mb-2 leading-normal text-gray-700 border rounded-lg shadow appearance-none h-11 focus:outline-none focus:shadow-outline"
        v-model="userName"
      /><button
        @click="addUser"
        class="flex items-center w-full px-6 text-white bg-green-800 rounded-lg h-11 hover:bg-green-600 focus:outline-none"
      >
        Ajouter un participant
      </button>
    </div>
  </div>
</template>

<script setup>
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import { ref } from "vue";

const userName = ref("");

async function addUser() {
  const data = {
    name: userName.value,
    isDrawn: false,
    hasDrawn: false,
  };

  const db = getFirestore();

  try {
    await addDoc(collection(db, "user"), data);
    console.log(`${userName.value} a été ajouté`);
    userName.value = "";
  } catch (error) {
    console.log(error);
  }
}
</script>
