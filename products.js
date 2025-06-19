// Load products data - check if admin has updated data
function loadProductsData() {
  const adminData = localStorage.getItem("productsData")
  if (adminData) {
    return JSON.parse(adminData)
  }

  // Return default products if no admin data
  return {
    1: {
      title: "SOY BRIGHT! Gel Moisturizer",
      price: "Rp 239.000",
      priceValue: 239000,
      rating: "★★★★★",
      reviews: "(124)",
      image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk9-m7kfjqfp38ba7f.webp",
      description:
        "A revolutionary dual-action formula that delivers intense hydration while creating the perfect canvas for makeup application.",
      features: ["Brightening", "Smoothing", "Hydrating", "Oil-free"],
      size: "50ml",
    },
    2: {
      title: "HYDRICEING Essence Booster",
      price: "Rp 149.000",
      priceValue: 149000,
      rating: "★★★★☆",
      reviews: "(86)",
      image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk8-m7mjbla8vnu1b6.webp",
      description: "An innovative serum-infused toner that delivers multiple benefits in one elegant step.",
      features: ["Hydrating", "Brightening", "Calming", "Alcohol-free"],
      size: "100ml",
    },
    3: {
      title: "Soy Clear Dark Spot Serum",
      price: "Rp 288.000",
      priceValue: 288000,
      rating: "★★★★★",
      reviews: "(97)",
      image: "https://down-bs-id.img.susercontent.com/id-11134210-7rbk3-m7kfjqfp4mvq94.webp",
      description:
        "A powerful targeted treatment featuring 5% Micellar Cysteamine, 1% Kojic Acid, and Soybean Extract.",
      features: ["Brightening", "Anti-spot", "Concentrated", "Fast-absorbing"],
      size: "30ml",
    },
  }
}

// Update the products variable to use the loaded data
const products = loadProductsData()
