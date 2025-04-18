// File: js/account.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
    const accountDetails = document.getElementById("account-details");
    const orderList = document.getElementById("order-list");
    const toggleBtn = document.getElementById("toggle-orders");
    const filterInput = document.getElementById("filter-date");

    // Nếu chưa đăng nhập
    if (!user) {
        accountDetails.innerHTML = "<p>Vui lòng <a href='login.html'>đăng nhập</a> để xem thông tin tài khoản.</p>";
        return;
    }

    const uid = user.uid;

    // 1. Hiển thị thông tin người dùng
    const userSnap = await getDoc(doc(db, "users", uid));
    const data = userSnap.data() || {};
    accountDetails.innerHTML = `
    <p><strong>Tên người dùng:</strong> ${data.username}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <button class="logout-btn" id="logout-btn">Đăng xuất</button>
  `;
    document.getElementById("logout-btn").addEventListener("click", async () => {
        await auth.signOut();
        window.location.href = "index.html";
    });

    // Fetch all books data first
    const booksSnapshot = await getDocs(collection(db, "books"));
    const booksMap = new Map();
    booksSnapshot.docs.forEach(doc => {
        booksMap.set(doc.id, {
            id: parseInt(doc.id),
            ...doc.data()
        });
    });

    // 2. Lấy lịch sử đơn hàng từ Firestore
    const ordersSnap = await getDocs(collection(db, "orders", uid, "orderList"));
    const userOrders = [];
    ordersSnap.forEach(docSnap => {
        const o = docSnap.data();
        userOrders.push({ id: docSnap.id, ...o });
    });

    // Hàm render đơn hàng với filter theo ngày
    function renderOrders(filterDate = "") {
        orderList.innerHTML = "";
        let filteredOrders = userOrders;
        if (filterDate) {
            const inputDate = new Date(filterDate);
            filteredOrders = userOrders.filter(o => {
                const date = o.createdAt?.toDate();
                return (
                    date.getFullYear() === inputDate.getFullYear() &&
                    date.getMonth() === inputDate.getMonth() &&
                    date.getDate() === inputDate.getDate()
                );
            });
        }
        if (filteredOrders.length === 0) {
            orderList.innerHTML = "<p>Không có đơn hàng nào cho ngày đã chọn.</p>";
        } else {
            filteredOrders.forEach((order, idx) => {
                const dateStr = order.createdAt?.toDate().toLocaleString() || "";

                // Tính lại tổng tiền nếu total không tồn tại hoặc không hợp lệ
                let totalAmount = order.total;
                if (!totalAmount || isNaN(totalAmount)) {
                    totalAmount = order.items.reduce((sum, item) => {
                        const book = item.title ? item : booksMap.get(item.id);
                        const price = item.price || book?.price || 0;
                        return sum + (price * item.quantity);
                    }, 0);
                }

                orderList.insertAdjacentHTML('beforeend', `
          <div class="order-item">
            <p><strong>Đơn #${idx + 1}</strong> - ${dateStr}</p>
            <p><strong>Người nhận:</strong> ${order.fullname}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>SĐT:</strong> ${order.phone}</p>
            <p><strong>Địa chỉ:</strong> ${order.address}</p>
            <ul>
              ${order.items.map(item => {
                    // Nếu item đã có title (đơn hàng mới), dùng title đó
                    // Nếu không, tìm title từ booksMap (đơn hàng cũ)
                    const book = item.title ? item : booksMap.get(item.id);
                    const title = book?.title || 'Sách không xác định';
                    const price = item.price || book?.price || 0;
                    return `<li>${title} - ${(price * item.quantity).toLocaleString()}đ x${item.quantity}</li>`;
                }).join('')}
            </ul>
            <p><strong>Tổng cộng:</strong> ${totalAmount.toLocaleString()}đ</p>
            <hr>
          </div>
        `);
            });
        }
    }

    // Xử lý toggle và filter
    toggleBtn?.addEventListener("click", () => {
        orderList.classList.toggle("hidden");
        if (!orderList.classList.contains("hidden")) {
            renderOrders(filterInput.value);
        }
    });
    filterInput?.addEventListener("change", () => {
        if (!orderList.classList.contains("hidden")) {
            renderOrders(filterInput.value);
        }
    });
});
