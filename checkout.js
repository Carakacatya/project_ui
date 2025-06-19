// Checkout Data Management System
class CheckoutManager {
  constructor() {
    this.cart = []
    this.contactInfo = {}
    this.shippingInfo = {}
    this.paymentInfo = {}
    this.orderSummary = {}
    this.init()
  }

  init() {
    this.loadCart()
    this.loadUserProfile()
    this.renderOrderItems()
    this.updateOrderSummary()
    this.bindEvents()
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    }
  }

  // Load user profile data if available
  loadUserProfile() {
    // Priority order: userProfile -> contactInfo -> checkoutData
    let profileData = null

    // 1. Try userProfile first (most up-to-date)
    const userProfile = localStorage.getItem("userProfile")
    if (userProfile) {
      try {
        profileData = JSON.parse(userProfile)
        console.log("Loaded profile from userProfile:", profileData)
      } catch (e) {
        console.error("Error parsing userProfile:", e)
      }
    }

    // 2. Fallback to contactInfo
    if (!profileData) {
      const savedContactInfo = localStorage.getItem("contactInfo")
      if (savedContactInfo) {
        try {
          profileData = JSON.parse(savedContactInfo)
          console.log("Loaded profile from contactInfo:", profileData)
        } catch (e) {
          console.error("Error parsing contactInfo:", e)
        }
      }
    }

    // 3. Fallback to existing checkoutData
    if (!profileData) {
      const checkoutData = localStorage.getItem("checkoutData")
      if (checkoutData) {
        try {
          const parsed = JSON.parse(checkoutData)
          if (parsed.contactInfo) {
            profileData = parsed.contactInfo
            console.log("Loaded profile from checkoutData:", profileData)
          }
        } catch (e) {
          console.error("Error parsing checkoutData:", e)
        }
      }
    }

    // Apply profile data to form if available
    if (profileData) {
      this.prefillForm(profileData)
    }
  }

  // Prefill form with saved data
  prefillForm(data) {
    const fields = [
      { id: "email", key: "email" },
      { id: "phone", key: "phone" },
      { id: "first-name", key: "firstName" },
      { id: "last-name", key: "lastName" },
      { id: "address", key: "address" },
      { id: "apartment", key: "apartment" },
      { id: "city", key: "city" },
      { id: "postal-code", key: "postalCode" },
      { id: "country", key: "country" },
      { id: "province", key: "province" },
    ]

    fields.forEach((field) => {
      const element = document.getElementById(field.id)
      if (element && data[field.key]) {
        element.value = data[field.key]
        console.log(`Prefilled ${field.id} with:`, data[field.key])
      }
    })

    // Handle save info checkbox
    if (data.saveInfo !== undefined) {
      const saveInfoCheckbox = document.getElementById("save-info")
      if (saveInfoCheckbox) {
        saveInfoCheckbox.checked = data.saveInfo
      }
    }
  }

  // Render order items
  renderOrderItems() {
    const orderItemsContainer = document.getElementById("order-items")
    orderItemsContainer.innerHTML = ""

    this.cart.forEach((item) => {
      const itemPrice = this.parsePrice(item.price || item.priceValue)
      const itemTotal = itemPrice * item.quantity

      const orderItemElement = document.createElement("div")
      orderItemElement.className = "order-item"
      orderItemElement.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.title}">
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <div class="order-item-details">
                    <h3>${item.title}</h3>
                    <p>Size: ${item.size || "50ml"}</p>
                </div>
                <div class="order-item-price">${this.formatCurrency(itemTotal)}</div>
            `

      orderItemsContainer.appendChild(orderItemElement)
    })
  }

  // Update order summary
  updateOrderSummary() {
    let subtotal = 0

    this.cart.forEach((item) => {
      const itemPrice = this.parsePrice(item.price || item.priceValue)
      subtotal += itemPrice * item.quantity
    })

    const tax = Math.round(subtotal * 0.1)
    const shipping = 15000 // Default shipping cost

    // Check for discount
    let discount = 0
    const discountRow = document.getElementById("discount-row")
    if (discountRow.style.display !== "none") {
      const discountText = document.getElementById("discount").textContent
      discount = this.parsePrice(discountText)
    }

    const total = subtotal + tax + shipping - discount

    document.getElementById("subtotal").textContent = this.formatCurrency(subtotal)
    document.getElementById("tax").textContent = this.formatCurrency(tax)
    document.getElementById("total").textContent = this.formatCurrency(total)

    // Save order summary
    this.orderSummary = {
      subtotal,
      tax,
      shipping,
      discount,
      total,
    }
  }

  // Parse price from string
  parsePrice(priceString) {
    if (typeof priceString === "number") return priceString
    return Number.parseInt(priceString.toString().replace(/\D/g, "")) || 0
  }

  // Format currency
  formatCurrency(amount) {
    return `Rp ${Number.parseInt(amount).toLocaleString("id-ID")}`
  }

  // Validate form
  validateForm() {
    const requiredFields = [
      "email",
      "phone",
      "first-name",
      "last-name",
      "address",
      "city",
      "postal-code",
      "country",
      "province",
    ]

    let isValid = true
    const errors = []

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (!field.value.trim()) {
        field.classList.add("error")
        isValid = false
        errors.push(`${field.previousElementSibling.textContent} is required`)
      } else {
        field.classList.remove("error")
      }
    })

    // Email validation
    const email = document.getElementById("email").value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      document.getElementById("email").classList.add("error")
      isValid = false
      errors.push("Please enter a valid email address")
    }

    if (!isValid) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
    }

    return isValid
  }

  // Save contact information
  saveContactInfo() {
    this.contactInfo = {
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      firstName: document.getElementById("first-name").value.trim(),
      lastName: document.getElementById("last-name").value.trim(),
      address: document.getElementById("address").value.trim(),
      apartment: document.getElementById("apartment").value.trim(),
      city: document.getElementById("city").value.trim(),
      postalCode: document.getElementById("postal-code").value.trim(),
      country: document.getElementById("country").value,
      province: document.getElementById("province").value,
      saveInfo: document.getElementById("save-info").checked,
    }

    // Save to localStorage
    localStorage.setItem("contactInfo", JSON.stringify(this.contactInfo))

    // If user wants to save info, update profile
    if (this.contactInfo.saveInfo) {
      localStorage.setItem("userProfile", JSON.stringify(this.contactInfo))
      console.log("Contact info saved to userProfile:", this.contactInfo)
    }

    // Save checkout data for next steps
    const checkoutData = {
      cart: this.cart,
      contactInfo: this.contactInfo,
      orderSummary: this.orderSummary,
    }
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData))

    console.log("Checkout data saved:", checkoutData)
  }

  // Apply promo code
  applyPromoCode() {
    const promoCode = document.getElementById("promo-input").value.trim().toUpperCase()
    const discountRow = document.getElementById("discount-row")
    const discountElement = document.getElementById("discount")

    if (promoCode === "WELCOME10") {
      const subtotal = this.parsePrice(document.getElementById("subtotal").textContent)
      const discount = Math.round(subtotal * 0.1)

      discountElement.textContent = `- ${this.formatCurrency(discount)}`
      discountRow.style.display = "flex"

      this.updateOrderSummary()
      alert("Promo code applied successfully! 10% discount added.")
    } else if (promoCode === "SAVE15") {
      const subtotal = this.parsePrice(document.getElementById("subtotal").textContent)
      const discount = Math.round(subtotal * 0.15)

      discountElement.textContent = `- ${this.formatCurrency(discount)}`
      discountRow.style.display = "flex"

      this.updateOrderSummary()
      alert("Promo code applied successfully! 15% discount added.")
    } else if (promoCode === "") {
      alert("Please enter a promo code.")
    } else {
      alert("Invalid promo code. Please try again.")
    }
  }

  // Bind events
  bindEvents() {
    // Continue to shipping button
    document.getElementById("continue-to-shipping").addEventListener("click", () => {
      if (this.validateForm()) {
        this.saveContactInfo()
        window.location.href = "shipping.html"
      }
    })

    // Apply promo code
    document.getElementById("apply-promo").addEventListener("click", () => {
      this.applyPromoCode()
    })

    // Enter key for promo code
    document.getElementById("promo-input").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.applyPromoCode()
      }
    })
  }
}

// Initialize checkout manager when page loads
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutManager()
})
