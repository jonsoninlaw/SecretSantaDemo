<template>
  <div class="flex flex-col items-center w-full xmas">
    <div
      class="flex flex-col items-stretch justify-center mb-8"
      v-if="editMode"
    >
      <input
        @keyup.enter="addUser"
        type="text"
        class="
          flex
          items-center
          w-full
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
        v-model="userName"
      /><button
        @click="addUser"
        class="
          flex
          items-center
          w-full
          px-6
          text-white
          bg-green-800
          rounded-lg
          h-11
          hover:bg-green-600
          focus:outline-none
        "
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
          <div
            class="font-bold text-white cursor-pointer hover:text-black"
            @click="showUser(user)"
          >
            {{ user.name }}
          </div>
          <div
            v-if="user.hasDrawn"
            class="cursor-pointer"
            @click="removeSanta(user)"
          >
            &nbsp;🎅
          </div>
          <div v-if="user.isDrawn" class="cursor-pointer">&nbsp;🎁</div>
        </div>
        <button @click="removeUser(user)" v-if="editMode">✖</button>
      </div>
    </div>
    <button
      v-if="!editMode"
      @click="editMode = true"
      class="
        px-6
        pt-3
        pb-3
        mt-20
        mb-4
        text-white
        bg-black
        rounded-full
        hover:bg-gray-600
      "
    >
      Mode édition
    </button>
    <button
      v-if="editMode"
      @click="toggleEditMode()"
      class="
        px-6
        pt-3
        pb-3
        mt-4
        mb-4
        text-black
        bg-white
        rounded-full
        hover:bg-gray-600
      "
    >
      Annuler
    </button>
    <button
      v-if="editMode"
      @click="reset(false)"
      class="
        px-6
        pt-3
        pb-3
        mt-20
        mb-4
        text-white
        bg-black
        rounded-full
        hover:bg-gray-600
      "
    >
      Réinitialiser
    </button>
  </div>
</template>

<script setup>
import { onBeforeMount } from "@vue/runtime-core";
import {
  getFirestore,
  collection,
  query,
  doc,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  limit,
  where,
  deleteField,
} from "firebase/firestore";
import { ref } from "vue";

const users = ref([]);
const userName = ref(null);
const editMode = ref(false);

onBeforeMount(async () => {
  init();
});

async function init() {
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

async function addUser() {
  if (
    !userName.value ||
    users.value.find((user) => user.name === userName.value)
  ) {
    return;
  }
  const db = getFirestore();
  await addDoc(collection(db, "user"), {
    name: userName.value,
    isDrawn: false,
    hasDrawn: false,
  });
  userName.value = "";
  await init(true);
}

async function removeUser(user) {
  if (!confirm("Etes-vous sûr ?")) {
    return;
  }
  const db = getFirestore();
  if (user.hasDrawn) {
    const userResult = await (await getDoc(doc(db, "result", user.id))).data();
    await setDoc(
      doc(db, "user", userResult.hasDrawn),
      {
        isDrawn: false,
      },
      { merge: true }
    );
  }
  // Checks if user was drawn
  if (user.isDrawn) {
    const querySnapshot = await getDocs(
      query(
        collection(db, "result"),
        where("hasDrawn", "==", user.id),
        limit(1)
      )
    );
    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id;
      await setDoc(
        doc(db, "user", userId),
        {
          hasDrawn: false,
        },
        { merge: true }
      );
      await setDoc(
        doc(db, "result", userId),
        {
          hasDrawn: deleteField(),
        },
        { merge: true }
      );
    }
  }
  await deleteDoc(doc(db, "user", user.id));
  await deleteDoc(doc(db, "result", user.id));
  init();
}

async function reset(force) {
  if (!force && !confirm("Voulez-vous annuler ce tirage ?")) {
    return;
  }
  const db = getFirestore();
  users.value.forEach((user) => {
    setDoc(
      doc(db, "user", user.id),
      {
        hasDrawn: false,
        isDrawn: false,
      },
      { merge: true }
    );
  });

  init();
}

async function showUser(user) {
  if (!user.hasDrawn) {
    alert(`${user.name} n'a pas effectué de tirage au sort`);
  } else if (
    confirm(
      `ATTENTION !\nVous allez connaître la personne tirée au sort par ${user.name}...`
    )
  ) {
    const db = getFirestore();
    const result = await getDoc(doc(db, "result", user.id));
    alert(
      `${user.name} a tiré ${
        users.value.find((user) => result.data().hasDrawn === user.id).name
      }`
    );
  }
}

async function removeSanta(user) {
  if (!confirm("Etes-vous sûr ?")) {
    return;
  }
  const db = getFirestore();
  await setDoc(
    doc(db, "user", user.id),
    {
      hasDrawn: false,
    },
    { merge: true }
  );
  await setDoc(
    doc(db, "result", user.id),
    {
      hasDrawn: deleteField(),
    },
    { merge: true }
  );

  const querySnapshot = await getDocs(
    query(collection(db, "result"), where("drawnBy", "==", user.id), limit(1))
  );
  if (!querySnapshot.empty) {
    const userId = querySnapshot.docs[0].id;
    await setDoc(
      doc(db, "user", userId),
      {
        isDrawn: false,
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "result", userId),
      {
        drawnBy: deleteField(),
      },
      { merge: true }
    );
    init();
  }
}

function toggleEditMode() {
  editMode.value = !editMode.value;
}
</script>

<style>
body {
  background-color: #e40a2d;
  padding: 0 10px;
}

div {
  color: white;
}
</style>
