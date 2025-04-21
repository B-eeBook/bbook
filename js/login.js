// File: js/login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

export async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("login-username").value;    // ở đây coi "username" là email
    const password = document.getElementById("login-password").value;

    try {
        // Gọi Firebase Auth để đăng nhập
        await signInWithEmailAndPassword(auth, email, password);

        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
    } catch (err) {
        console.error("Login error:", err);
        alert("Đăng nhập thất bại: " + err.message);
    }
}
window.handleLogin = handleLogin;