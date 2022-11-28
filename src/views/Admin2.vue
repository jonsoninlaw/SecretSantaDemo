<template>
  <div class="admin">
    <div>
      <label>
        Nom
        <input v-model="name" />
      </label>
    </div>
    <button @click="addUser()">Ajouter un participant</button>
  </div>
</template>

<script setup>
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import { ref } from "vue";

const name = ref("");

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
  } catch (error) {
    console.log(error);
  }
}
</script>