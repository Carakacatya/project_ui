// Script untuk mengintegrasikan sistem user dengan admin
// File ini akan mengupdate sistem login/register yang sudah ada

// Update sistem login untuk menyimpan data user ke registeredUsers
function updateLoginSystem() {
  console.log("🔄 Mengupdate sistem login...")

  // Fungsi untuk menyimpan user yang register
  function saveRegisteredUser(userData) {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    const newUser = {
      id: "USER" + Date.now(),
      name: userData.name || userData.username,
      email: userData.email,
      username: userData.username,
      role: "customer",
      status: "active",
      registeredAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      lastLogin: new Date().toISOString(),
    }

    // Cek apakah user sudah ada
    const existingUser = registeredUsers.find((user) => user.email === newUser.email)
    if (!existingUser) {
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
    }

    return newUser
  }

  // Fungsi untuk menyimpan aktivitas login
  function saveLoginActivity(userData) {
    const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
    activities.push({
      type: "login",
      user: userData.name || userData.username,
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

  // Override fungsi register yang ada
  window.originalRegisterUser = window.registerUser || (() => {})
  window.registerUser = (userData) => {
    const result = window.originalRegisterUser(userData)
    saveRegisteredUser(userData)
    return result
  }

  // Override fungsi login yang ada
  window.originalLoginUser = window.loginUser || (() => {})
  window.loginUser = (userData) => {
    const result = window.originalLoginUser(userData)
    saveLoginActivity(userData)
    return result
  }

  console.log("✅ Sistem login berhasil diupdate!")
}

// Update sistem order untuk menyimpan transaksi
function updateOrderSystem() {
  console.log("🔄 Mengupdate sistem order...")

  // Fungsi untuk menyimpan order ke admin
  function saveOrderToAdmin(orderData) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")

    const newOrder = {
      id: orderData.id || "ORD-" + Date.now(),
      customerName: orderData.customerName || "Pelanggan",
      customerEmail: orderData.customerEmail || "",
      date: new Date().toISOString(),
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      status: "pending",
      paymentMethod: orderData.paymentMethod || "credit-card",
      shippingMethod: orderData.shippingMethod || "standard",
      shippingAddress: orderData.shippingAddress || "",
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
      description: `melakukan pemesanan senilai Rp ${newOrder.total.toLocaleString("id-ID")}`,
    })
    localStorage.setItem("userActivities", JSON.stringify(activities))

    console.log("✅ Order baru disimpan:", newOrder.id)
    return newOrder
  }

  // Override fungsi checkout yang ada
  window.originalCreateOrder = window.createOrder || (() => {})
  window.createOrder = (orderData) => {
    const result = window.originalCreateOrder(orderData)
    saveOrderToAdmin(orderData)
    return result
  }

  console.log("✅ Sistem order berhasil diupdate!")
}

// Inisialisasi sistem terintegrasi
function initializeIntegratedSystem() {
  console.log("🚀 Menginisialisasi sistem terintegrasi...")

  // Update sistem yang ada
  updateLoginSystem()
  updateOrderSystem()

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

  console.log("✅ Sistem terintegrasi berhasil diinisialisasi!")
  console.log("📊 Data tersimpan di localStorage:")
  console.log("- registeredUsers:", JSON.parse(localStorage.getItem("registeredUsers") || "[]").length, "users")
  console.log("- orders:", JSON.parse(localStorage.getItem("orders") || "[]").length, "orders")
  console.log("- userActivities:", JSON.parse(localStorage.getItem("userActivities") || "[]").length, "activities")
}

// Jalankan inisialisasi
initializeIntegratedSystem()

// Export functions untuk digunakan di file lain
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateLoginSystem,
    updateOrderSystem,
    initializeIntegratedSystem,
  }
}
