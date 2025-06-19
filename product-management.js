class ProductManager {
  constructor() {
    // Load products from the existing products.html data structure
    this.products = this.loadExistingProducts()
    this.currentEditId = null
    this.init()
  }

  init() {
    this.bindEvents()
    this.renderProducts()
    this.updateStats()
  }

  loadExistingProducts() {
    // This matches the exact structure from products.html
    return {
      1: {
        id: 1,
        title: "SOY BRIGHT! Gel Moisturizer",
        price: "Rp 239.000",
        priceValue: 239000,
        rating: "★★★★★",
        reviews: "(124)",
        image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk9-m7kfjqfp38ba7f.webp",
        description:
          "A revolutionary dual-action formula that delivers intense hydration while creating the perfect canvas for makeup application. This lightweight gel moisturizer absorbs quickly, leaving skin smooth, supple, and radiant.",
        features: ["Brightening", "Smoothing", "Hydrating", "Oil-free"],
        size: "50ml",
        category: "moisturizer",
      },
      2: {
        id: 2,
        title: "HYDRICEING Essence Booster",
        price: "Rp 149.000",
        priceValue: 149000,
        rating: "★★★★☆",
        reviews: "(86)",
        image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk8-m7mjbla8vnu1b6.webp",
        description:
          "An innovative serum-infused toner that delivers multiple benefits in one elegant step. Formulated with rice extract and oat extract for gentle yet effective hydration.",
        features: ["Hydrating", "Brightening", "Calming", "Alcohol-free"],
        size: "100ml",
        category: "toner",
      },
      3: {
        id: 3,
        title: "Soy Clear Dark Spot Serum",
        price: "Rp 288.000",
        priceValue: 288000,
        rating: "★★★★★",
        reviews: "(97)",
        image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk3-m7kfjqfp4mvq94.webp",
        description:
          "A powerful targeted treatment featuring 5% Micellar Cysteamine, 1% Kojic Acid, and Soybean Extract. This concentrated serum helps reduce the appearance of dark spots and uneven skin tone.",
        features: ["Brightening", "Anti-spot", "Concentrated", "Fast-absorbing"],
        size: "30ml",
        category: "serum",
      },
      4: {
        id: 4,
        title: "Gentle Foam Cleanser",
        price: "Rp 129.000",
        priceValue: 129000,
        rating: "★★★★☆",
        reviews: "(156)",
        image: "/placeholder.svg?height=250&width=250",
        description:
          "A mild, pH-balanced cleanser that effectively removes impurities while maintaining skin's natural moisture barrier.",
        features: ["Gentle", "Hydrating", "pH-balanced", "Sulfate-free"],
        size: "150ml",
        category: "cleanser",
      },
      5: {
        id: 5,
        title: "Nourishing Night Mask",
        price: "Rp 199.000",
        priceValue: 199000,
        rating: "★★★★★",
        reviews: "(73)",
        image: "/placeholder.svg?height=250&width=250",
        description: "An intensive overnight treatment that deeply nourishes and repairs skin while you sleep.",
        features: ["Intensive care", "Overnight treatment", "Deep hydration", "Rejuvenating"],
        size: "75ml",
        category: "mask",
      },
      6: {
        id: 6,
        title: "Daily Sun Protection SPF 50",
        price: "Rp 169.000",
        priceValue: 169000,
        rating: "★★★★☆",
        reviews: "(89)",
        image: "/placeholder.svg?height=250&width=250",
        description:
          "Broad-spectrum sunscreen that provides superior protection against UVA and UVB rays without leaving a white cast.",
        features: ["SPF 50", "Broad-spectrum", "Water-resistant", "Non-greasy"],
        size: "60ml",
        category: "sunscreen",
      },
    }
  }

  bindEvents() {
    // Modal events
    document.getElementById("add-product-btn").addEventListener("click", () => this.openModal())
    document.getElementById("close-modal").addEventListener("click", () => this.closeModal())
    document.getElementById("cancel-btn").addEventListener("click", () => this.closeModal())
    document.getElementById("product-form").addEventListener("submit", (e) => this.handleSubmit(e))

    // Delete modal events
    document.getElementById("close-delete-modal").addEventListener("click", () => this.closeDeleteModal())
    document.getElementById("cancel-delete").addEventListener("click", () => this.closeDeleteModal())
    document.getElementById("confirm-delete").addEventListener("click", () => this.confirmDelete())

    // Search and filter
    document.getElementById("search-input").addEventListener("input", () => this.filterProducts())
    document.getElementById("category-filter").addEventListener("change", () => this.filterProducts())

    // Form preview updates
    const formInputs = ["product-name", "product-price", "product-description", "product-image"]
    formInputs.forEach((id) => {
      document.getElementById(id).addEventListener("input", () => this.updatePreview())
    })

    // Close modal when clicking outside
    document.getElementById("product-modal").addEventListener("click", (e) => {
      if (e.target.id === "product-modal") this.closeModal()
    })
    document.getElementById("delete-modal").addEventListener("click", (e) => {
      if (e.target.id === "delete-modal") this.closeDeleteModal()
    })
  }

  openModal(product = null) {
    this.currentEditId = product ? product.id : null
    const modal = document.getElementById("product-modal")
    const title = document.getElementById("modal-title")
    const saveBtn = document.getElementById("save-btn-text")

    if (product) {
      title.textContent = "Edit Produk"
      saveBtn.textContent = "Update Produk"
      this.populateForm(product)
    } else {
      title.textContent = "Tambah Produk Baru"
      saveBtn.textContent = "Simpan Produk"
      this.resetForm()
    }

    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    this.updatePreview()
  }

  closeModal() {
    const modal = document.getElementById("product-modal")
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    this.resetForm()
    this.currentEditId = null
  }

  populateForm(product) {
    document.getElementById("product-name").value = product.title
    document.getElementById("product-category").value = product.category || ""
    document.getElementById("product-price").value = product.priceValue
    document.getElementById("product-stock").value = "25" // Default stock
    document.getElementById("product-status").value = "active"
    document.getElementById("product-image").value = product.image || ""
    document.getElementById("product-description").value = product.description || ""
    document.getElementById("product-ingredients").value = product.features ? product.features.join(", ") : ""
  }

  resetForm() {
    document.getElementById("product-form").reset()
    this.updatePreview()
  }

  updatePreview() {
    const name = document.getElementById("product-name").value || "Nama Produk"
    const price = document.getElementById("product-price").value || "0"
    const description =
      document.getElementById("product-description").value || "Deskripsi produk akan muncul di sini..."
    const image = document.getElementById("product-image").value || "/placeholder.svg?height=200&width=200"

    document.getElementById("preview-title").textContent = name
    document.getElementById("preview-price").textContent = `Rp ${Number.parseInt(price).toLocaleString("id-ID")}`
    document.getElementById("preview-description").textContent = description
    document.getElementById("preview-img").src = image
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const productData = {
      title: formData.get("name"),
      category: formData.get("category"),
      priceValue: Number.parseInt(formData.get("price")),
      price: `Rp ${Number.parseInt(formData.get("price")).toLocaleString("id-ID")}`,
      image: formData.get("image"),
      description: formData.get("description"),
      features: formData.get("ingredients") ? formData.get("ingredients").split(", ") : [],
      size: "50ml",
      rating: "★★★★★",
      reviews: "(0)",
    }

    if (this.currentEditId) {
      this.updateProduct(this.currentEditId, productData)
    } else {
      this.addProduct(productData)
    }
  }

  addProduct(productData) {
    const newId = Math.max(...Object.keys(this.products).map(Number)) + 1

    this.products[newId] = {
      id: newId,
      ...productData,
    }

    this.saveProducts()
    this.renderProducts()
    this.updateStats()
    this.closeModal()
    this.showNotification("Produk berhasil ditambahkan!")
  }

  updateProduct(id, productData) {
    if (this.products[id]) {
      this.products[id] = {
        ...this.products[id],
        ...productData,
      }

      this.saveProducts()
      this.renderProducts()
      this.updateStats()
      this.closeModal()
      this.showNotification("Produk berhasil diupdate!")
    }
  }

  deleteProduct(id) {
    this.productToDelete = id
    document.getElementById("delete-modal").classList.add("show")
    document.body.style.overflow = "hidden"
  }

  confirmDelete() {
    if (this.productToDelete && this.products[this.productToDelete]) {
      delete this.products[this.productToDelete]
      this.saveProducts()
      this.renderProducts()
      this.updateStats()
      this.closeDeleteModal()
      this.showNotification("Produk berhasil dihapus!")
      this.productToDelete = null
    }
  }

  closeDeleteModal() {
    document.getElementById("delete-modal").classList.remove("show")
    document.body.style.overflow = "auto"
    this.productToDelete = null
  }

  saveProducts() {
    // Save to localStorage so products.html can access the updated data
    localStorage.setItem("productsData", JSON.stringify(this.products))
  }

  renderProducts() {
    const tbody = document.getElementById("products-table-body")
    const filteredProducts = this.getFilteredProducts()

    tbody.innerHTML = Object.values(filteredProducts)
      .map(
        (product) => `
            <tr>
                <td><strong>${product.id}</strong></td>
                <td>
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                </td>
                <td>
                    <div class="product-name">${product.title}</div>
                    <small class="product-category">${product.category || "Uncategorized"}</small>
                </td>
                <td class="product-price">${product.price}</td>
                <td>${product.rating}</td>
                <td>${product.reviews}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="productManager.viewProduct('${product.id}')" title="Lihat">
                            👁️
                        </button>
                        <button class="action-btn edit" onclick="productManager.editProduct('${product.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn delete" onclick="productManager.deleteProduct('${product.id}')" title="Hapus">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("")
  }

  getFilteredProducts() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase()
    const categoryFilter = document.getElementById("category-filter").value

    const filtered = {}

    Object.keys(this.products).forEach((key) => {
      const product = this.products[key]
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      const matchesCategory = !categoryFilter || product.category === categoryFilter

      if (matchesSearch && matchesCategory) {
        filtered[key] = product
      }
    })

    return filtered
  }

  filterProducts() {
    this.renderProducts()
  }

  viewProduct(id) {
    // Open product detail page
    window.open(`product-detail-${id}.html`, "_blank")
  }

  editProduct(id) {
    const product = this.products[id]
    if (product) {
      this.openModal(product)
    }
  }

  updateStats() {
    const totalProducts = Object.keys(this.products).length
    const activeProducts = totalProducts // All products are considered active
    const totalStock = totalProducts * 25 // Estimated stock

    document.getElementById("total-products").textContent = totalProducts
    document.getElementById("active-products").textContent = activeProducts
    document.getElementById("total-stock").textContent = totalStock
  }

  showNotification(message) {
    const notification = document.getElementById("notification")
    const messageEl = document.getElementById("notification-message")

    messageEl.textContent = message
    notification.classList.add("show")

    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
}

// Initialize the product manager when the page loads
let productManager
document.addEventListener("DOMContentLoaded", () => {
  productManager = new ProductManager()
})
