<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/login">Login</router-link>
  </nav>
  <router-view />
</template>

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
