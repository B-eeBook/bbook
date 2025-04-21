// File: js/main.js
import "./user.js";  // chỉ import để khởi động onAuthStateChanged
import { fetchBooks, renderBooks, renderCategorySidebar, renderDetail } from "./book.js";

// Các thao tác chung khi DOM load xong
document.addEventListener("DOMContentLoaded", async () => {
    // Tải sách từ Firestore
    await fetchBooks();

    // Trang chủ: hiển thị sách
    if (document.getElementById("book-list")) {
        renderBooks("book-list");
    }

    // Trang danh mục mẫu
    if (document.getElementById("category-list")) {
        renderBooks("category-list", b => b.category === "Kỹ năng sống");
    }

    // Sidebar danh mục
    renderCategorySidebar();

    // Chi tiết sách
    if (document.getElementById("book-detail")) {
        renderDetail();
    }

    // Giỏ hàng: chỉ import và gọi renderCart khi thực sự ở trang cart.html
    if (document.getElementById("cart-items")) {
        const { renderCart } = await import("./cart.js");
        await renderCart();
    }

    // Tiêu đề danh mục động trên category.html
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    const titleEl = document.getElementById("category-title");
    if (cat && titleEl) {
        titleEl.textContent = `Danh mục: ${cat}`;
        renderBooks("book-list", b => b.category === cat);
    }

    // Tìm kiếm
    const searchBox = document.getElementById("search-box");
    if (searchBox) {
        searchBox.addEventListener("input", () => {
            const keyword = searchBox.value.toLowerCase();
            const filterFn = b => (
                b.title.toLowerCase().includes(keyword) && (!cat || b.category === cat)
            );
            renderBooks("book-list", filterFn);
        });
    }

    // Slideshow tự chuyển ảnh
    const slides = document.querySelectorAll(".slides img");
    let currentSlide = 0;
    if (slides.length) {
        const showSlide = idx => slides.forEach((s, i) => s.classList.toggle("active", i === idx));
        showSlide(0);
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
<<<<<<< HEAD

    // Xử lý menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav-user');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Đóng sidebar nếu đang mở
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    // Xử lý sidebar mobile
    const categoryToggle = document.getElementById('categoryToggle');
    const sidebar = document.querySelector('.sidebar');

    if (categoryToggle && sidebar) {
        categoryToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            // Đóng nav menu nếu đang mở
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });

        // Đóng sidebar khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !categoryToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
=======
>>>>>>> 45987cd0525920eee0141509b7f5301b71ef9259
});
