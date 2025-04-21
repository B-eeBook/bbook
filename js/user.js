// File: js/user.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  collection,
<<<<<<< HEAD
  getDocs,
  doc,
  getDoc
=======
  getDocs
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const nav = document.getElementById("nav-user");

async function fetchCartCount(uid) {
  const qSnap = await getDocs(collection(db, "carts", uid, "items"));
  let count = 0;
  qSnap.forEach(docSnap => {
    const data = docSnap.data();
    count += data.quantity || 0;
  });
  return count;
}

<<<<<<< HEAD
function renderNav(user, cartCount = 0, username = "") {
=======
function renderNav(user, cartCount = 0) {
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
  nav.innerHTML = "";

  // Links cố định
  const links = [
    { href: "index.html", label: "Trang chủ" },
    { href: "cart.html", label: `Giỏ hàng (${cartCount})` },
  ];

  if (user) {
    links.splice(1, 0, { href: "account.html", label: "Tài khoản" });
  }

  links.forEach(({ href, label }) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    nav.appendChild(a);
  });

  // Phần menu tài khoản
  const menu = document.createElement("div");
  menu.classList.add("account-menu");

  if (user) {
    menu.innerHTML = `
<<<<<<< HEAD
      <a href="#">${username || user.email}</a>
=======
      <a href="#">${user.email}</a>
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
      <div class="account-dropdown">
        <a href="#" id="logout-btn">Đăng xuất</a>
      </div>
    `;
    nav.appendChild(menu);

    document
      .getElementById("logout-btn")
      .addEventListener("click", async e => {
        e.preventDefault();
        await signOut(auth);
      });
  } else {
    menu.innerHTML = `
      <a href="#">Tài khoản</a>
      <div class="account-dropdown">
        <a href="login.html">Đăng nhập</a>
        <a href="register.html">Đăng ký</a>
      </div>
    `;
    nav.appendChild(menu);
  }
}

// Lắng nghe thay đổi authentication state
onAuthStateChanged(auth, async user => {
  if (user) {
<<<<<<< HEAD
    const cartCount = await fetchCartCount(user.uid);
    let username = "";
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        username = docSnap.data().username || "";
      }
    } catch (e) {
      console.error("Không thể lấy username:", e);
    }
    renderNav(user, cartCount, username);
=======
    // Khi đã login, đếm số item trong giỏ
    const cartCount = await fetchCartCount(user.uid);
    renderNav(user, cartCount);
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
  } else {
    renderNav(null, 0);
  }
});
