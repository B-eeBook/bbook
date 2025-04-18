// File: js/register.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    try {
        // 1. Tạo user với email & password
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        // 2. Lưu thêm profile (username) vào Firestore
        await setDoc(doc(db, "users", uid), {
            username,
            email,
            createdAt: new Date().toISOString()
        });

        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    } catch (err) {
        console.error("Register error:", err);
        let msg = err.message;
        // Gợi ý thông báo rõ hơn với một số lỗi thường gặp
        if (err.code === "auth/email-already-in-use") {
            msg = "Email này đã được dùng để đăng ký.";
        } else if (err.code === "auth/invalid-email") {
            msg = "Email không hợp lệ.";
        } else if (err.code === "auth/weak-password") {
            msg = "Mật khẩu quá yếu (ít nhất 6 ký tự).";
        }
        alert("Đăng ký thất bại: " + msg);
    }
}
window.handleRegister = handleRegister;