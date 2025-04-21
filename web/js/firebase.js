// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCiZ3dv2Dn4av_MVFrVelERNO8uwrZ7BF0",
    authDomain: "beebook-da6c5.firebaseapp.com",
    projectId: "beebook-da6c5",
    storageBucket: "beebook-da6c5.firebasestorage.app",
    messagingSenderId: "625593505208",
    appId: "1:625593505208:web:541ee7b1faa7ca20346b4d",
    measurementId: "G-DDJ0X5LN3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);