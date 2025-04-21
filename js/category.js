//category.js
import { fetchBooks, renderBooks, renderCategorySidebar } from './book.js';

// Khởi tạo khi trang load
window.addEventListener('DOMContentLoaded', async () => {
    await fetchBooks();

    // Lấy category từ URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    // Hiển thị sách theo danh mục
    if (category) {
        renderBooks("book-list", book => book.category === category);
    } else {
        renderBooks("book-list"); // Hiển thị tất cả sách nếu không có danh mục
    }

    // Hiển thị sidebar danh mục
    renderCategorySidebar();
}); 