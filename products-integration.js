// Integration script untuk menghubungkan admin dengan halaman products
class ProductIntegration {
  static getActiveProducts() {
    const products = JSON.parse(localStorage.getItem("products") || "[]")
    return products.filter((product) => product.status === "active" && product.stock > 0)
  }

  static getProductById(id) {
    const products = JSON.parse(localStorage.getItem("products") || "[]")
    return products.find((product) => product.id === id)
  }

  static updateProductStock(id, newStock) {
    const products = JSON.parse(localStorage.getItem("products") || "[]")
    const productIndex = products.findIndex((product) => product.id === id)

    if (productIndex !== -1) {
      products[productIndex].stock = newStock
      localStorage.setItem("products", JSON.stringify(products))
      return true
    }
    return false
  }

  static generateProductsHTML() {
    const products = this.getActiveProducts()

    return products
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='/placeholder.svg?height=250&width=250'">
                    ${product.tag ? `<div class="product-tag ${product.tag}">${this.getTagLabel(product.tag)}</div>` : ""}
                    <div class="product-actions">
                        <button class="action-btn quick-view" data-product="${product.id}">Quick View</button>
                        <button class="action-btn add-to-cart" data-product="${product.id}">Add to Cart</button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${this.generateStars(product.rating || 0)}</span>
                        <span class="review-count">(${product.reviews || 0})</span>
                    </div>
                    <p class="product-price">Rp ${product.price.toLocaleString("id-ID")}</p>
                </div>
            </div>
        `,
      )
      .join("")
  }

  static getTagLabel(tag) {
    const tagLabels = {
      bestseller: "Bestseller",
      new: "New",
      popular: "Popular",
    }
    return tagLabels[tag] || tag
  }

  static generateStars(rating) {
    const fullStars = Math.floor(rating)
    const emptyStars = 5 - fullStars
    return "★".repeat(fullStars) + "☆".repeat(emptyStars)
  }

  static getProductsForQuickView() {
    const products = this.getActiveProducts()
    const productsObj = {}

    products.forEach((product, index) => {
      productsObj[index + 1] = {
        title: product.name,
        price: `Rp ${product.price.toLocaleString("id-ID")}`,
        priceValue: product.price,
        rating: this.generateStars(product.rating || 0),
        reviews: `(${product.reviews || 0})`,
        image: product.image,
        description: product.description || "Deskripsi produk tidak tersedia.",
        features: product.ingredients
          ? product.ingredients.split(",").map((i) => i.trim())
          : ["Produk berkualitas tinggi"],
        size: "50ml",
      }
    })

    return productsObj
  }
}

// Export untuk digunakan di halaman products
if (typeof window !== "undefined") {
  window.ProductIntegration = ProductIntegration
}
