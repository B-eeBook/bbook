// 📁 js/order.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  const orderList = document.getElementById("order-list");

  if (!user || !orders[user.username] || orders[user.username].length === 0) {
    orderList.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
    return;
  }

  orders[user.username].forEach((order, idx) => {
    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
        <p><strong>Đơn #${idx + 1}</strong> - ${new Date(order.time).toLocaleString()}</p>
        <p><strong>Người nhận:</strong> ${order.fullname}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>SĐT:</strong> ${order.phone}</p>
        <p><strong>Địa chỉ:</strong> ${order.address}</p>
        <ul>
          ${order.items.map(book => `<li>${book.title} - ${book.price.toLocaleString()}đ</li>`).join("")}
        </ul>
        <hr>
      `;
    orderList.appendChild(div);
  });
});