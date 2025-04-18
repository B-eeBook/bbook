// File: js/book.js
import { db } from "./firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { addToCart } from "./cart.js";

export let books = [];

let currentPage = 1;
let currentBooksPerPage = 15;
let currentFilterFn = () => true;
let paginationTarget = "book-list";

// Fetch books from Firestore
export async function fetchBooks() {
  try {
    const snapshot = await getDocs(collection(db, "books"));
    books = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return { id: parseInt(docSnap.id), ...data };
    });
    return books;
  } catch (error) {
    console.error("Không thể tải dữ liệu sách từ Firestore:", error);
    return [];
  }
}

export function renderBooks(listId, filterFn = () => true, page = 1, perPage = 15) {
  const container = document.getElementById(listId);
  if (!container || books.length === 0) return;

  currentPage = page;
  currentBooksPerPage = perPage;
  currentFilterFn = filterFn;
  paginationTarget = listId;

  const filteredBooks = books.filter(filterFn);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const booksToShow = filteredBooks.slice(start, end);

  container.innerHTML = booksToShow.map(book => `
    <div class="book-item">
      <a href="book.html?id=${book.id}">
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">${book.author}</p>
          <p class="book-price">${book.price.toLocaleString()}đ</p>
        </div>
      </a>
      <button class="add-to-cart-btn" data-id="${book.id}">Thêm vào giỏ</button>
    </div>
  `).join("");

  // Gắn sự kiện click cho các nút thêm vào giỏ
  container.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const bookId = button.dataset.id;
      try {
        await addToCart(bookId);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      } catch (error) {
        alert(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
      }
    });
  });

  renderPagination(filteredBooks.length, perPage);
}

function renderPagination(totalItems, perPage) {
  const select = document.createElement("select");
  select.id = "books-per-page";
  select.className = "books-per-page-select";
  [10, 15, 20].forEach(n => {
    const option = document.createElement("option");
    option.value = n;
    option.textContent = `${n} / trang`;
    if (n === perPage) option.selected = true;
    select.appendChild(option);
  });
  select.onchange = (e) => {
    currentBooksPerPage = parseInt(e.target.value);
    renderBooks(paginationTarget, currentFilterFn, 1, currentBooksPerPage);
  };

  let pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / perPage);

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.style.textAlign = "center";
    pagination.style.marginTop = "20px";
    document.getElementById(paginationTarget)?.after(pagination);
  }

  pagination.innerHTML = "";
  pagination.appendChild(select);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.style.margin = "0 5px";
    btn.onclick = () => renderBooks(paginationTarget, currentFilterFn, i, perPage);
    pagination.appendChild(btn);
  }
}

export function renderDetail() {
  const detail = document.getElementById("book-detail");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const book = books.find(b => b.id === id);
  if (!book) {
    detail.innerHTML = "<p>Không tìm thấy sách.</p>";
    return;
  }

  detail.innerHTML = `
    <div class="book-detail-container">
      <div class="book-detail-left">
        <img src="${book.image}" alt="${book.title}">
      </div>
      <div id="book-detail-info">
        <h2>${book.title}</h2>
        <p><strong>Tác giả:</strong> ${book.author}</p>
        <p class="book-price">${book.price.toLocaleString()}đ</p>
        <p>${book.description || 'Chưa có mô tả'}</p>
        <button class="add-to-cart-btn" data-id="${book.id}">Thêm vào giỏ</button>
      </div>
    </div>
  `;

  // Gắn sự kiện click cho nút thêm vào giỏ
  const addToCartBtn = detail.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const bookId = addToCartBtn.dataset.id;
      try {
        await addToCart(bookId);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      } catch (error) {
        alert(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
      }
    });
  }

  renderRelatedBooks(book);
}

function renderRelatedBooks(currentBook) {
  const section = document.createElement("section");
  section.id = "related-books-section";
  section.innerHTML = `<h3 class="related-title">Sách liên quan</h3><div id="related-books"></div>`;
  document.querySelector("main").appendChild(section);

  const container = document.getElementById("related-books");
  const related = books.filter(b => b.category === currentBook.category && b.id !== currentBook.id);

  related.forEach(book => {
    const div = document.createElement("div");
    div.innerHTML = `
      <a href="book.html?id=${book.id}">
        <img src="${book.image}" alt="${book.title}">
        <h4>${book.title}</h4>
        <p class="book-price">${book.price.toLocaleString()}đ</p>
      </a>`;
    container.appendChild(div);
  });
}

export function renderCategorySidebar() {
  const container = document.querySelector(".sidebar ul");
  if (!container || books.length === 0) return;

  const categories = [...new Set(books.map(b => b.category))];
  const params = new URLSearchParams(window.location.search);
  const currentCat = params.get("cat");

  container.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    const isActive = cat === currentCat ? "active-category" : "";
    li.innerHTML = `<a href="category.html?cat=${encodeURIComponent(cat)}" class="${isActive}">${cat}</a>`;
    container.appendChild(li);
  });
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', async () => {
  await fetchBooks();
  renderDetail();
});
