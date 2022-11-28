<template>
  <div class="admin">
    <div>
      <label>
        Nom
        <input v-model="name" />
      </label>
    </div>
    <button @click="addUser()">Ajouter un participant</button>
    <div>
      <div v-for="user in users" :key="user.name">{{ user.name }}</div>
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