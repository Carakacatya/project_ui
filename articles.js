document.addEventListener('DOMContentLoaded', function () {
    const articles = [
    {
        title: "Morning Skincare Rituals for Radiant Skin",
        category: "Skincare",
        date: "2025-05-10",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/6a/b3/8d/6ab38d01a89bf76b5421a3256bf1062f.jpg",
        detailPage: "article-detail.html"
    },
    {
        title: "Your Complete Guide to Sunscreens",
        category: "Protection",
        date: "2025-05-05",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/c1/6f/9d/c16f9d303029e8dd9d5d6728f600d7ca.jpg",
        detailPage: "article-detail-1.html"
    },
    {
        title: "Why Niacinamide Wins in Skincare",
        category: "Ingredients",
        date: "2025-04-28",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/5c/03/e6/5c03e62e9ff75c0ba7c52f59bab9542a.jpg",
        detailPage: "article-detail-2.html"
    },
    {
        title: "The Perfect Evening Skincare Routine",
        category: "Routines",
        date: "2025-04-20",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/65/a1/56/65a156eb330b016c1648fe63e66e9658.jpg",
        detailPage: "article-detail-3.html"
    },
    {
        title: "Hyaluronic Acid: Your Hydration Hero",
        category: "Ingredients",
        date: "2025-04-15",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/9a/b9/92/9ab9922f915387c4133893cf48f3188c.jpg",
        detailPage: "article-detail-4.html"
    },
    {
        title: "Caring for Sensitive Skin",
        category: "Skincare",
        date: "2025-04-08",
        status: "Dipublikasi",
        image: "https://i.pinimg.com/736x/b7/af/ef/b7afef8ca468b6d5baa159356c8f1c84.jpg",
        detailPage: "article-detail-5.html"
    }
];


    const tableBody = document.getElementById('articlesTable');
    const form = document.getElementById('articleForm');
    const modal = document.getElementById('articleModal');
    const imageInput = document.getElementById('articleImage');
    const imageUrlInput = document.getElementById('articleImageUrl');
    const imagePreview = document.getElementById('imagePreview');

    let editingIndex = null;

    function renderTable() {
        tableBody.innerHTML = '';
        articles.forEach((a, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${a.title}</td>
                <td>${a.category}</td>
                <td>${a.date}</td>
                <td>${a.status}</td>
                <td><img src="${a.image}" alt="${a.title}" width="50"></td>
                <td class="action-cell">
                    <button class="btn-icon view-btn" onclick="viewArticle('${a.detailPage}')" title="Lihat Artikel"><span>👁️</span></button>
                    <button class="btn-icon edit-btn" onclick="editArticle(${index})" title="Edit Artikel"><span>✏️</span></button>
                    <button class="btn-icon delete-btn" onclick="deleteArticle(${index})" title="Hapus Artikel"><span>🗑️</span></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        updateStats();
    }

    function updateStats() {
        const total = articles.length;
        const published = articles.filter(a => a.status === "Dipublikasi").length;
        const draft = articles.filter(a => a.status === "Draft").length;
        const thisMonth = articles.filter(a => {
            const date = new Date(a.date);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        document.querySelectorAll('#totalArticles').forEach(e => e.textContent = total);
        document.querySelectorAll('#publishedArticles').forEach(e => e.textContent = published);
        document.querySelectorAll('#draftArticles').forEach(e => e.textContent = draft);
        document.querySelectorAll('#thisMonthArticles').forEach(e => e.textContent = thisMonth);
    }

    window.viewArticle = function (page) {
        window.open(page, '_blank');
    };

    window.editArticle = function (index) {
        const a = articles[index];
        editingIndex = index;
        document.getElementById('modalTitle').textContent = 'Edit Artikel';
        form.articleTitle.value = a.title;
        form.articleCategory.value = a.category;
        form.articleDate.value = a.date;
        form.articleStatus.value = a.status;
        form.articleExcerpt.value = a.excerpt || '';
        form.articleContent.value = a.content || '';
        form.articleTags.value = a.tags || '';
        imageUrlInput.value = a.image;
        imagePreview.innerHTML = `<img src="${a.image}" width="100">`;
        modal.style.display = 'block';
    };

    window.deleteArticle = function (index) {
        if (confirm("Yakin ingin menghapus artikel ini?")) {
            articles.splice(index, 1);
            renderTable();
        }
    };

    document.getElementById('addArticleBtn').addEventListener('click', () => {
        form.reset();
        editingIndex = null;
        imagePreview.innerHTML = '<span>Tidak ada gambar</span>';
        document.getElementById('modalTitle').textContent = 'Tambah Artikel Baru';
        modal.style.display = 'block';
    });

    window.closeArticleModal = function () {
        modal.style.display = 'none';
        form.reset();
        imagePreview.innerHTML = '<span>Tidak ada gambar</span>';
        editingIndex = null;
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newArticle = {
            title: form.articleTitle.value,
            category: form.articleCategory.value,
            date: form.articleDate.value || new Date().toISOString().split('T')[0],
            status: form.articleStatus.value,
            excerpt: form.articleExcerpt.value,
            content: form.articleContent.value,
            tags: form.articleTags.value,
            image: imageUrlInput.value || 'default.jpg'
        };

        if (editingIndex !== null) {
            articles[editingIndex] = newArticle;
        } else {
            articles.push(newArticle);
        }

        closeArticleModal();
        renderTable();
    });

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file && file.size < 2 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" width="100">`;
                imageUrlInput.value = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Ukuran gambar maksimal 2MB. Format: JPG, PNG, WebP.");
            this.value = '';
        }
    });

    renderTable();
});
