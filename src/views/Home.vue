<template>
  <div class="flex flex-col items-center w-full xmas">
    <div class="flex flex-col items-center w-full">
      <h1 class="mb-8 text-xl font-bold uppercase">SECRET SANTA</h1>
      <div class="mb-4 text-white">Vous êtes...</div>
      <div
        v-if="selectedUser && submitted"
        class="
          w-64
          py-2
          pl-4
          pr-8
          mb-4
          leading-normal
          text-gray-700
          bg-white
          border
          rounded-lg
          shadow
          appearance-none
          input-invalid
          focus:outline-none focus:shadow-outline
        "
      >
        {{ selectedUser.name }}
      </div>
      <select
        @change="selectUser"
        v-if="users.length && !submitted"
        v-model="selectedUser"
        class="
          w-64
          py-2
          pl-4
          pr-8
          mb-4
          leading-normal
          text-gray-700
          bg-white
          border
          rounded-lg
          shadow
          appearance-none
          input-invalid
          focus:outline-none focus:shadow-outline
        "
      >
        <option disabled selected hidden value="">Choisissez un prénom</option>
        <option v-for="user of users" :key="user.id" :value="user">
          {{ user.name }}
        </option>
      </select>
      <div
        v-if="selectedUser && !submitted && !confirmed"
        class="flex flex-col items-center"
      >
        <div>ATTENTION !</div>
        <div>
          Ne vous trompez pas de prénom car vous ne pourrez effectuer qu'un seul
          tirage au sort
        </div>
        <button
          @click="confirmed = true"
          class="
            px-6
            pt-3
            pb-3
            mt-4
            text-white
            bg-green-800
            rounded-full
            hover:bg-green-600
            focus:outline-none
          "
        >
          Oui, c'est bien moi !
        </button>
      </div>
      <div
        v-if="selectedUser && !submitted && confirmed"
        class="flex flex-col items-center"
      >
        <div>Dernière chance de changer d'avis...</div>
        <button
          @click="draw"
          class="
            px-6
            pt-3
            pb-3
            mt-4
            text-white
            bg-green-800
            rounded-full
            hover:bg-green-600
            focus:outline-none
          "
        >
          Je tire au sort !
        </button>
      </div>
      <div v-if="submitted && selectedUser.hasDrawn">
        Vous avez déjà tiré quelqu'un !
      </div>
      <div
        v-if="drawnUser && !selectedUser.hasDrawn"
        class="flex flex-col items-center px-4"
      >
        <div>
          Vous avez tiré
          <span class="text-2xl font-bold"> {{ drawnUser.name }} !</span>
          Notez-le bien !
        </div>
        <div class="mt-2 text-sm">
          (et ne le dites à personne avant l'ouverture des cadeaux...)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onUnmounted } from "@vue/runtime-core";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  doc,
  where,
} from "firebase/firestore";
import { ref } from "vue";
import Snowflakes from "magic-snowflakes";

const users = ref([]);
const drawList = ref([]);
const selectedUser = ref("");
const drawnUser = ref(null);
const submitted = ref(false);
const confirmed = ref(false);

const snowflakes = new Snowflakes({
  color: "#FFFFFF",
});

onBeforeMount(async () => {
  snowflakes.start();
  getUsers();
});

onUnmounted(() => {
  snowflakes.destroy();
});

async function getUsers() {
  users.value = [];
  const db = getFirestore();
  const querySnapshot = await getDocs(
    query(collection(db, "user"), orderBy("name"))
  );
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    user.id = doc.id;
    users.value.push(user);
  });
}

function selectUser() {
  confirmed.value = false;
}

async function draw() {
  submitted.value = true;
  if (!selectedUser.value.hasDrawn) {
    const db = getFirestore();
    const querySnapshot = await getDocs(
      query(
        collection(db, "user"),
        where("isDrawn", "==", false),
        where("name", "!=", selectedUser.value.name)
      )
    );
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      user.id = doc.id;
      drawList.value.push(user);
    });
    if (drawList.value.length > 2) {
      drawnUser.value =
        drawList.value[Math.floor(Math.random() * drawList.value.length)];
    } else {
      drawnUser.value =
        drawList.value.find((user) => !user.hasDrawn) ||
        drawList.value[Math.floor(Math.random() * drawList.value.length)];
    }
    setDoc(
      doc(db, "user", selectedUser.value.id),
      {
        hasDrawn: true,
      },
      { merge: true }
    );
    setDoc(
      doc(db, "user", drawnUser.value.id),
      {
        isDrawn: true,
      },
      { merge: true }
    );
    setDoc(
      doc(db, "result", selectedUser.value.id),
      {
        hasDrawn: drawnUser.value.id,
      },
      { merge: true }
    );
    setDoc(
      doc(db, "result", drawnUser.value.id),
      {
        drawnBy: selectedUser.value.id,
      },
      { merge: true }
    );
  }
}
</script>
