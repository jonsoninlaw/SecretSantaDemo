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
    <div>Participants :</div>
    <div class="w-40 mt-4">
      <div
        v-for="user of users"
        :key="user.id"
        class="flex justify-between w-full my-2"
      >
        <div class="flex">
          <div class="font-bold">
            {{ user.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  query,
  addDoc,
  collection,
  getDocs,
  getFirestore,
} from "@firebase/firestore";
import { ref } from "vue";

const name = ref("");
const users = ref([]);

getUsers();

async function addUser() {
  const data = {
    name: name.value,
    isDrawn: false,
    hasDrawn: false,
  };

  const db = getFirestore();

  try {
    await addDoc(collection(db, "user"), data);
    console.log(`${name.value} a été ajouté`);
    name.value = "";
    getUsers();
  } catch (error) {
    console.log(error);
  }
}

async function getUsers() {
  const db = getFirestore();
  try {
    const querySnapshot = await getDocs(query(collection(db, "user")));
    if (!querySnapshot.empty) {
      users.value = querySnapshot.docs.map((document) => document.data());
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
