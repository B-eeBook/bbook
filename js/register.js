// File: js/register.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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

        // 3. Đăng xuất người dùng sau khi đăng ký
        await signOut(auth);

        // 4. Đợi một chút để đảm bảo đăng xuất hoàn tất
        setTimeout(() => {
            alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
            window.location.href = "login.html";
        }, 500);

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