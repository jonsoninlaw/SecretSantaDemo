<template>
  <div class="admin">
    <div class="admin-field">
      <label>
        Email
        <input v-model="email" />
      </label>
    </div>
    <div class="admin-field">
      <label>
        Mot de passe
        <input type="password" v-model="password" />
      </label>
    </div>
    <button @click="connect">Connexion</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref(null);
const password = ref(null);

function connect() {
  console.log(`Connexion de ${email.value}`);
}
</script>

<style>
.admin {
  margin-top: 20px;
}
.admin-field {
  margin-bottom: 20px;
}
</style>