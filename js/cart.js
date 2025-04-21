// File: js/cart.js
import { db, auth } from "./firebase.js";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- Helpers ---
async function ensureSignedIn() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user) resolve(user.uid);
            else reject("Chưa đăng nhập");
        });
    });
}

// --- Thêm vào giỏ ---
export async function addToCart(id) {
    let userId;
    try {
        userId = await ensureSignedIn();
    } catch (e) {
<<<<<<< HEAD
        throw new Error("Bạn phải đăng nhập để thêm vào giỏ hàng.");
=======
        return alert("Bạn phải đăng nhập để thêm vào giỏ hàng.");
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
    }

    const itemRef = doc(db, "carts", userId, "items", String(id));
    const snap = await getDoc(itemRef);

    if (snap.exists()) {
        // nếu đã có, tăng quantity lên 1
        await updateDoc(itemRef, {
            quantity: snap.data().quantity + 1
        });
    } else {
        // nếu chưa có, tạo mới
        await setDoc(itemRef, {
            id,
            quantity: 1,
            addedAt: serverTimestamp()
        });
    }
}

// --- Render giỏ hàng ---
export async function renderCart() {
    const cartEl = document.getElementById("cart-items");
    const totalEl = document.getElementById("total-price");
<<<<<<< HEAD
    const cartEmptyEl = document.getElementById("cart-empty");
    const summaryEl = document.getElementById("checkout-summary");
    const summaryBox = document.querySelector(".cart-summary");
=======
    const summaryEl = document.getElementById("checkout-summary");
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
    if (!cartEl || !totalEl) return;

    let userId;
    try {
        userId = await ensureSignedIn();
    } catch (e) {
        cartEl.innerHTML = `<p class="text-center">${e}</p>`;
        return;
    }

    // Fetch books data first
    const booksSnapshot = await getDocs(collection(db, "books"));
    const books = booksSnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
    }));

    const qSnap = await getDocs(collection(db, "carts", userId, "items"));
<<<<<<< HEAD
    if (qSnap.empty) {
        cartEl.style.display = "none";
        totalEl.textContent = "";
        if (summaryEl) summaryEl.innerHTML = "";
        if (summaryBox) summaryBox.style.display = "none"; // ✅ thêm dòng này
        if (cartEmptyEl) cartEmptyEl.style.display = "block";
        return;
    } else {
        cartEl.style.display = "block";
        if (cartEmptyEl) cartEmptyEl.style.display = "none";
        if (summaryBox) summaryBox.style.display = "block"; // ✅ hiển thị lại khi có sp
    }
=======
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
    cartEl.innerHTML = "";
    let total = 0;
    let summaryHtml = "";

    for (const docSnap of qSnap.docs) {
        const { id, quantity } = docSnap.data();
        const book = books.find(b => b.id === parseInt(id));
        if (!book) continue;

        const priceSum = book.price * quantity;
        total += priceSum;

        // Tạo phần tử DOM
        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `
            <div class="cart-item-left">
                <img src="${book.image}" alt="${book.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <label>
                        <input type="checkbox" class="cart-check" data-id="${id}" checked>
                        <span class="book-title">${book.title}</span> - ${book.price.toLocaleString()}đ x
                    </label>
                    <p>${book.author}</p>
                </div>
            </div>
            <div class="right-actions">
                <button class="qty-btn" data-id="${id}" data-action="dec">-</button>
                <input type="number" min="1" value="${quantity}" data-id="${id}" class="cart-quantity">
                <button class="qty-btn" data-id="${id}" data-action="inc">+</button>
                <button class="remove-btn" data-id="${id}">Xóa</button>
            </div>
        `;
        cartEl.appendChild(item);
    }

    totalEl.textContent = `Tổng: ${total.toLocaleString()}đ`;
    if (summaryEl) {
        // Chỉ hiển thị tóm tắt khi có sản phẩm được chọn
        const checkedItems = document.querySelectorAll(".cart-check:checked");
        if (checkedItems.length > 0) {
            summaryHtml = "<h4>Tóm tắt đơn hàng:</h4>";
            let selectedTotal = 0;

            checkedItems.forEach(checkbox => {
                const id = checkbox.dataset.id;
                const quantity = parseInt(document.querySelector(`.cart-quantity[data-id='${id}']`).value);
                const book = books.find(b => b.id === parseInt(id));
                if (book) {
                    const priceSum = book.price * quantity;
                    selectedTotal += priceSum;
                    summaryHtml += `<p>${book.title} x ${quantity} = <strong>${priceSum.toLocaleString()}đ</strong></p>`;
                }
            });

            summaryHtml += `<p class="summary-total">Tổng cộng: <strong>${selectedTotal.toLocaleString()}đ</strong></p>`;
        } else {
            summaryHtml = "<p>Vui lòng chọn sản phẩm để thanh toán</p>";
        }
        summaryEl.innerHTML = summaryHtml;
    }

    // Gắn sự kiện cho các nút tăng/giảm số lượng
    cartEl.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = button.dataset.id;
            const action = button.dataset.action;
            const input = cartEl.querySelector(`.cart-quantity[data-id='${id}']`);
            let qty = parseInt(input.value);

            qty = action === "inc" ? qty + 1 : Math.max(1, qty - 1);
            input.value = qty;

            await updateQuantity(id, qty);
            await renderCart();
        });
    });

    // Gắn sự kiện cho input số lượng
    cartEl.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', async (e) => {
            e.preventDefault();
            const id = input.dataset.id;
            const qty = parseInt(input.value);
            if (qty > 0) {
                await updateQuantity(id, qty);
                await renderCart();
            } else {
                input.value = 1;
            }
        });
    });

    // Gắn sự kiện cho nút xóa
    cartEl.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = button.dataset.id;
            if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
                await removeFromCart(id);
                await renderCart();
            }
        });
    });

    // Gắn sự kiện cho checkbox
    cartEl.querySelectorAll('.cart-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const checks = cartEl.querySelectorAll(".cart-check:checked");
            let total = 0;

            // Cập nhật tổng giá
            checks.forEach(cb => {
                const id = cb.dataset.id;
                const quantity = parseInt(document.querySelector(`.cart-quantity[data-id='${id}']`).value);
                const book = books.find(b => b.id === parseInt(id));
                if (book) {
                    total += book.price * quantity;
                }
            });
            totalEl.textContent = `Tổng: ${total.toLocaleString()}đ`;

            // Cập nhật tóm tắt đơn hàng
            if (summaryEl) {
                let summaryHtml = "";
                if (checks.length > 0) {
                    summaryHtml = "<h4>Tóm tắt đơn hàng:</h4>";
                    let selectedTotal = 0;

                    checks.forEach(cb => {
                        const id = cb.dataset.id;
                        const quantity = parseInt(document.querySelector(`.cart-quantity[data-id='${id}']`).value);
                        const book = books.find(b => b.id === parseInt(id));
                        if (book) {
                            const priceSum = book.price * quantity;
                            selectedTotal += priceSum;
                            summaryHtml += `<p>${book.title} x ${quantity} = <strong>${priceSum.toLocaleString()}đ</strong></p>`;
                        }
                    });

                    summaryHtml += `<p class="summary-total">Tổng cộng: <strong>${selectedTotal.toLocaleString()}đ</strong></p>`;
                } else {
                    summaryHtml = "<p>Vui lòng chọn sản phẩm để thanh toán</p>";
                }
                summaryEl.innerHTML = summaryHtml;
            }
        });
    });
}

// --- Cập nhật số lượng và xóa item ---
async function updateQuantity(id, newQty) {
    const userId = await ensureSignedIn();
    const ref = doc(db, "carts", userId, "items", String(id));

    if (newQty < 1) return;
    if (newQty === 0) {
        await deleteDoc(ref);
    } else {
        await updateDoc(ref, { quantity: newQty });
    }
}

async function removeFromCart(id) {
    const userId = await ensureSignedIn();
    await deleteDoc(doc(db, "carts", userId, "items", String(id)));
}

// --- Thanh toán (checkout) ---
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch books data first
    const booksSnapshot = await getDocs(collection(db, "books"));
    const books = booksSnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
    }));

    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const checked = [...document.querySelectorAll(".cart-check:checked")];
            if (!checked.length) {
                alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
                return;
            }
            const checkoutForm = document.getElementById("checkout-form-container");
            if (checkoutForm) {
                checkoutForm.classList.add("active");
            }
        });
    }

    // Xử lý form thanh toán
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let userId;
            try {
                userId = await ensureSignedIn();
            } catch (error) {
                alert("Bạn cần đăng nhập để thanh toán");
                return;
            }

            const checkedItems = [...document.querySelectorAll(".cart-check:checked")];
            if (!checkedItems.length) {
                alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
                return;
            }

            const formData = new FormData(checkoutForm);
            const orderData = {
                fullname: formData.get("fullname"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                items: checkedItems.map(item => {
                    const id = item.dataset.id;
                    const quantity = parseInt(document.querySelector(`.cart-quantity[data-id='${id}']`).value);
                    const book = books.find(b => b.id === parseInt(id));
                    return {
                        id: id,
                        title: book.title,
                        price: book.price,
                        quantity: quantity
                    };
                }),
                total: checkedItems.reduce((sum, item) => {
                    const id = item.dataset.id;
                    const quantity = parseInt(document.querySelector(`.cart-quantity[data-id='${id}']`).value);
                    const book = books.find(b => b.id === parseInt(id));
                    return sum + (book.price * quantity);
                }, 0),
                status: "pending",
                createdAt: serverTimestamp()
            };

            try {
                // Lưu đơn hàng
                const orderRef = doc(db, "orders", userId, "orderList", Date.now().toString());
                await setDoc(orderRef, orderData);

                // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
                for (const item of checkedItems) {
                    await removeFromCart(item.dataset.id);
                }

                alert("Đặt hàng thành công!");
<<<<<<< HEAD
                window.location.href = "index.html";
=======
                window.location.href = "/account.html";
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
            } catch (error) {
                console.error("Lỗi khi đặt hàng:", error);
                alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
            }
        });
    }
});

// Khi load xong
renderCart();
