// Payment Data Management System
class PaymentManager {
  constructor() {
    this.checkoutData = {}
    this.paymentInfo = {
      method: "credit-card",
      details: {},
    }
    this.init()
  }

  init() {
    this.loadCheckoutData()
    this.displayOrderInfo()
    this.renderOrderItems()
    this.updateOrderSummary()
    this.bindEvents()
  }

  // Load checkout data from previous steps
  loadCheckoutData() {
    const savedData = localStorage.getItem("checkoutData")
    if (savedData) {
      this.checkoutData = JSON.parse(savedData)
    } else {
      // Redirect back to checkout if no data
      alert("Please complete the checkout process from the beginning.")
      window.location.href = "checkout.html"
      return
    }
  }

  // Display order information from previous steps
  displayOrderInfo() {
    const { contactInfo, shippingInfo } = this.checkoutData

    if (contactInfo) {
      document.getElementById("contact-email").textContent = contactInfo.email

      let address = contactInfo.address
      if (contactInfo.apartment) {
        address += `, ${contactInfo.apartment}`
      }
      address += `, ${contactInfo.city}, ${contactInfo.province}, ${contactInfo.postalCode}`

      document.getElementById("shipping-address").textContent = address
    }

    if (shippingInfo) {
      document.getElementById("shipping-method").textContent =
        `${shippingInfo.name} (${this.formatCurrency(shippingInfo.cost)})`
    }
  }

  // Render order items
  renderOrderItems() {
    const orderItemsContainer = document.getElementById("order-items")
    orderItemsContainer.innerHTML = ""

    if (!this.checkoutData.cart) return

    this.checkoutData.cart.forEach((item) => {
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
    if (!this.checkoutData.orderSummary) return

    const { subtotal, tax, shipping, discount = 0, total } = this.checkoutData.orderSummary

    document.getElementById("subtotal").textContent = this.formatCurrency(subtotal)
    document.getElementById("shipping").textContent = this.formatCurrency(shipping)
    document.getElementById("tax").textContent = this.formatCurrency(tax)
    document.getElementById("total").textContent = this.formatCurrency(total)

    // Show discount if applicable
    if (discount > 0) {
      document.getElementById("discount").textContent = `- ${this.formatCurrency(discount)}`
      document.getElementById("discount-row").style.display = "flex"
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

  // Handle payment method change
  handlePaymentMethodChange(method) {
    // Hide all payment details sections
    document.getElementById("credit-card-details").style.display = "none"
    document.getElementById("bank-transfer-details").style.display = "none"
    document.getElementById("e-wallet-details").style.display = "none"

    // Show the selected payment details section
    if (method === "credit-card") {
      document.getElementById("credit-card-details").style.display = "block"
    } else if (method === "bank-transfer") {
      document.getElementById("bank-transfer-details").style.display = "block"
    } else if (method === "e-wallet") {
      document.getElementById("e-wallet-details").style.display = "block"
    }

    this.paymentInfo.method = method
  }

  // Validate payment details
  validatePayment() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value

    if (selectedPayment === "credit-card") {
      const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "")
      const expiryDate = document.getElementById("expiry-date").value
      const cvv = document.getElementById("cvv").value
      const cardName = document.getElementById("card-name").value

      if (cardNumber.length < 16) {
        alert("Please enter a valid card number.")
        return false
      }

      if (expiryDate.length < 5) {
        alert("Please enter a valid expiry date (MM/YY).")
        return false
      }

      if (cvv.length < 3) {
        alert("Please enter a valid CVV.")
        return false
      }

      if (cardName.trim() === "") {
        alert("Please enter the cardholder name.")
        return false
      }

      this.paymentInfo.details = {
        cardNumber: cardNumber.slice(-4), // Store only last 4 digits
        expiryDate,
        cardName,
      }
    } else if (selectedPayment === "e-wallet") {
      const selectedWallet = document.querySelector('input[name="wallet"]:checked')
      if (selectedWallet) {
        this.paymentInfo.details = {
          wallet: selectedWallet.value,
        }
      }
    }

    return true
  }

  // Complete order
  async completeOrder() {
    if (!this.validatePayment()) {
      return
    }

    // Show processing modal
    document.getElementById("processing-modal").style.display = "flex"

    // Create complete order object
    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toISOString(),
      status: "confirmed",
      customer: this.checkoutData.contactInfo,
      shipping: {
        address: this.checkoutData.contactInfo,
        method: this.checkoutData.shippingInfo,
      },
      payment: this.paymentInfo,
      items: this.checkoutData.cart,
      summary: this.checkoutData.orderSummary,
    }

    try {
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))

      // Update user profile if save info was checked
      if (this.checkoutData.contactInfo.saveInfo) {
        localStorage.setItem("userProfile", JSON.stringify(this.checkoutData.contactInfo))
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and checkout data
      localStorage.removeItem("cart")
      localStorage.removeItem("checkoutData")

      // Save order ID for success page
      localStorage.setItem("lastOrderId", order.id)

      // Redirect to success page
      window.location.href = "order-success.html"
    } catch (error) {
      console.error("Order processing error:", error)
      alert("There was an error processing your order. Please try again.")
      document.getElementById("processing-modal").style.display = "none"
    }
  }

  // Format card number input
  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "")
    value = value.replace(/(.{4})/g, "$1 ").trim()
    input.value = value
  }

  // Format expiry date input
  formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, "")
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }
    input.value = value
  }

  // Bind events
  bindEvents() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]')
    paymentOptions.forEach((option) => {
      option.addEventListener("change", () => {
        this.handlePaymentMethodChange(option.value)
      })
    })

    // Card number formatting
    const cardNumberInput = document.getElementById("card-number")
    cardNumberInput.addEventListener("input", () => {
      this.formatCardNumber(cardNumberInput)
    })

    // Expiry date formatting
    const expiryDateInput = document.getElementById("expiry-date")
    expiryDateInput.addEventListener("input", () => {
      this.formatExpiryDate(expiryDateInput)
    })

    // Complete order button
    document.getElementById("complete-order-btn").addEventListener("click", () => {
      this.completeOrder()
    })
  }
}

// Initialize payment manager when page loads
document.addEventListener("DOMContentLoaded", () => {
  new PaymentManager()
})