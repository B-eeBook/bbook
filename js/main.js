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
});
