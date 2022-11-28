import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBtKL1-Eow7lFegHMyUr3XosvEibneutXQ",

  authDomain: "secretsanta-2.firebaseapp.com",

  projectId: "secretsanta-2",

  storageBucket: "secretsanta-2.appspot.com",

  messagingSenderId: "573639699616",

  appId: "1:573639699616:web:f28879b942bebde6b16dc5",
};

// Initialize Firebase

initializeApp(firebaseConfig);

if (process.env.NODE_ENV === "test") {
  connectAuthEmulator(getAuth(), "http://localhost:9099");
  connectFirestoreEmulator(getFirestore(), "localhost", 5348);
}

createApp(App).use(router).mount("#app");
