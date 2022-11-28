<template>
  <nav class="flex justify-between">
    <div>
      <router-link to="/">Home</router-link>
      <router-link v-if="isLoggedIn" to="/admin">Admin</router-link>
      <router-link v-else to="/login">Login</router-link>
    </div>
    <div>
      <div v-if="isLoggedIn" @click="logOut()" class="cursor-pointer">
        Déconnexion
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const isLoggedIn = ref(false);
const router = useRouter();

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }
});

async function logOut() {
  await signOut(getAuth());
  router.push("/");
}
</script>

<style>
nav {
  padding: 10px;
}
nav a {
  margin: 0 5px;
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
