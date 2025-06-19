// Script untuk mengintegrasikan sistem user dengan admin
// File ini akan mengupdate sistem login/register dan checkout yang sudah ada

// Update sistem login untuk menyimpan data user ke registeredUsers
function updateUserSystem() {
  console.log("🔄 Mengupdate sistem user untuk integrasi admin...")

  // Fungsi untuk menyimpan user yang register
  function saveRegisteredUser(userData) {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    const newUser = {
      id: "USER" + Date.now(),
      name: userData.name || userData.username || userData.email.split("@")[0],
      email: userData.email,
      username: userData.username || userData.email.split("@")[0],
      role: "customer",
      status: "active",
      registeredAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      lastLogin: new Date().toISOString(),
    }

    // Cek apakah user sudah ada
    const existingUserIndex = registeredUsers.findIndex((user) => user.email === newUser.email)
    if (existingUserIndex === -1) {
      registeredUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

      // Simpan aktivitas pendaftaran
      const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
      activities.push({
        type: "register",
        user: newUser.name,
        email: newUser.email,
        time: new Date().toISOString(),
        description: "mendaftar sebagai pengguna baru",
      })
      localStorage.setItem("userActivities", JSON.stringify(activities))

      console.log("✅ User baru disimpan:", newUser.name)
    } else {
      // Update existing user
      registeredUsers[existingUserIndex] = { ...registeredUsers[existingUserIndex], ...newUser }
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    }

    return newUser
  }

  // Fungsi untuk menyimpan aktivitas login
  function saveLoginActivity(userData) {
    const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
    activities.push({
      type: "login",
      user: userData.name || userData.username || userData.email.split("@")[0],
      email: userData.email,
      time: new Date().toISOString(),
      description: "melakukan login ke website",
    })
    localStorage.setItem("userActivities", JSON.stringify(activities))

    // Update last login
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((user) => user.email === userData.email)
    if (userIndex !== -1) {
      registeredUsers[userIndex].lastLogin = new Date().toISOString()
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    }
  }

  // Fungsi untuk menyimpan order ke admin
  function saveOrderToAdmin(orderData) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")

    const newOrder = {
      id: orderData.id || "ORD-" + Date.now(),
      customerName: orderData.customerName || orderData.name || "Pelanggan",
      customerEmail: orderData.customerEmail || orderData.email || "",
      date: new Date().toISOString(),
      items: orderData.items || orderData.cartItems || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 15000,
      tax: orderData.tax || 0,
      total: orderData.total || orderData.grandTotal || 0,
      status: "pending",
      paymentMethod: orderData.paymentMethod || "credit-card",
      shippingMethod: orderData.shippingMethod || "standard",
      shippingAddress: orderData.shippingAddress || orderData.address || "",
    }

    orders.push(newOrder)
    localStorage.setItem("orders", JSON.stringify(orders))

    // Simpan aktivitas pembelian
    const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
    activities.push({
      type: "purchase",
      user: newOrder.customerName,
      email: newOrder.customerEmail,
      time: new Date().toISOString(),
      description: `melakukan pemesanan senilai ${formatCurrency(newOrder.total)}`,
    })
    localStorage.setItem("userActivities", JSON.stringify(activities))

    console.log("✅ Order baru disimpan:", newOrder.id)
    return newOrder
  }

  // Helper function untuk format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Override atau hook ke form register yang ada
  document.addEventListener("submit", (e) => {
    const form = e.target

    // Deteksi form register
    if (
      form.id === "registerForm" ||
      form.classList.contains("register-form") ||
      (form.querySelector('input[name="email"]') &&
        form.querySelector('input[name="password"]') &&
        form.querySelector('input[name="name"]'))
    ) {
      const formData = new FormData(form)
      const userData = {
        name: formData.get("name") || formData.get("username"),
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
      }

      if (userData.email && userData.password) {
        saveRegisteredUser(userData)
      }
    }

    // Deteksi form login
    if (
      form.id === "loginForm" ||
      form.classList.contains("login-form") ||
      (form.querySelector('input[name="email"]') &&
        form.querySelector('input[name="password"]') &&
        !form.querySelector('input[name="name"]'))
    ) {
      const formData = new FormData(form)
      const userData = {
        email: formData.get("email"),
        password: formData.get("password"),
      }

      if (userData.email && userData.password) {
        // Cari user yang sudah terdaftar
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const existingUser = registeredUsers.find((user) => user.email === userData.email)

        if (existingUser) {
          saveLoginActivity(existingUser)
        } else {
          // Jika user belum terdaftar, daftarkan otomatis
          saveRegisteredUser(userData)
        }
      }
    }

    // Deteksi form checkout
    if (
      form.id === "checkoutForm" ||
      form.classList.contains("checkout-form") ||
      form.querySelector('input[name="customerName"]') ||
      form.querySelector('input[name="address"]')
    ) {
      const formData = new FormData(form)
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")

      if (cart.length > 0) {
        const orderData = {
          customerName: formData.get("customerName") || formData.get("name"),
          customerEmail: formData.get("customerEmail") || formData.get("email"),
          shippingAddress: formData.get("address") || formData.get("shippingAddress"),
          paymentMethod: formData.get("paymentMethod") || "credit-card",
          shippingMethod: formData.get("shippingMethod") || "standard",
          items: cart,
          subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          shipping: 15000,
          tax: 0,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15000,
        }

        saveOrderToAdmin(orderData)
      }
    }
  })

  // Hook ke localStorage changes untuk mendeteksi perubahan cart
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments)

    // Jika ada perubahan pada cart dan checkout selesai
    if (key === "orderCompleted" && value === "true") {
      const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "{}")
      if (lastOrder.id) {
        saveOrderToAdmin(lastOrder)
      }
    }
  }

  console.log("✅ Sistem user berhasil diintegrasikan dengan admin!")
}

// Inisialisasi sistem terintegrasi
function initializeIntegratedSystem() {
  console.log("🚀 Menginisialisasi sistem terintegrasi...")

  // Update sistem yang ada
  updateUserSystem()

  // Buat data contoh jika belum ada
  if (!localStorage.getItem("registeredUsers")) {
    const sampleUsers = [
      {
        id: "USER001",
        name: "Jessica Wijaya",
        email: "jessica.w@example.com",
        username: "jessica_w",
        role: "customer",
        status: "active",
        registeredAt: new Date("2025-05-12").toISOString(),
        avatar: "https://i.pravatar.cc/150?img=1",
        lastLogin: new Date().toISOString(),
      },
    ]
    localStorage.setItem("registeredUsers", JSON.stringify(sampleUsers))
  }

  if (!localStorage.getItem("userActivities")) {
    localStorage.setItem("userActivities", JSON.stringify([]))
  }

  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]))
  }

  console.log("✅ Sistem terintegrasi berhasil diinisialisasi!")
  console.log("📊 Data tersimpan di localStorage:")
  console.log("- registeredUsers:", JSON.parse(localStorage.getItem("registeredUsers") || "[]").length, "users")
  console.log("- orders:", JSON.parse(localStorage.getItem("orders") || "[]").length, "orders")
  console.log("- userActivities:", JSON.parse(localStorage.getItem("userActivities") || "[]").length, "activities")
}

// Jalankan inisialisasi saat DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIntegratedSystem)
} else {
  initializeIntegratedSystem()
}

// Export functions untuk digunakan di file lain
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateUserSystem,
    initializeIntegratedSystem,
  }
}
