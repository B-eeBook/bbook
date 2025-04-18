// migrate.js
const admin = require('firebase-admin');
const fs = require('fs');

// 1️⃣ Khởi tạo Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 2️⃣ Đọc dữ liệu từ file JSON
const books = JSON.parse(fs.readFileSync('./data/book.json', 'utf-8'));

// 3️⃣ Migrate lên Firestore
async function migrateBooks() {
    const batch = db.batch();
    books.forEach(book => {
        // Dùng book.id làm document ID
        const ref = db.collection('books').doc(String(book.id));
        batch.set(ref, {
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            image: book.image,
            description: book.description
        });
    });

    await batch.commit();
    console.log(`✅ Đã migrate ${books.length} cuốn sách lên Firestore.`);
}

migrateBooks().catch(err => {
    console.error("❌ Lỗi khi migrate:", err);
    process.exit(1);
});
