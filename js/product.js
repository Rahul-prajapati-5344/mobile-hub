document.addEventListener("DOMContentLoaded", () => {
  const quantityInput = document.getElementById("quantity");
  const quantityButtons = document.querySelectorAll(".qty-btn");
  const addToCartButton = document.querySelector(".action-buttons .add-to-cart-btn");
  const wishlistButton = document.querySelector(".action-buttons .btn-secondary");
  const wishlistStorageKey = "mobileHubWishlist";
  const productCatalog = [
    {
      id: "iphone-17-pro-max",
      brand: "Apple",
      name: "iPhone 17 Pro Max",
      price: 149900,
      ram: "8GB",
      storage: "256GB",
      display: "6.7-inch Super Retina XDR",
      processor: "A19 Pro Chip",
      camera: "Triple 48MP system",
      battery: "5000mAh",
      description: "A premium flagship smartphone with a powerful display, advanced camera system, and smooth everyday performance."
    },
    {
      id: "samsung-galaxy-s26-ultra",
      brand: "Samsung",
      name: "Samsung Galaxy S26 Ultra",
      price: 129999,
      ram: "12GB",
      storage: "512GB",
      display: "6.9-inch Dynamic AMOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Quad 200MP setup",
      battery: "5000mAh",
      description: "A refined Android flagship with exceptional camera quality, immersive visuals, and premium build craftsmanship."
    },
    {
      id: "oneplus-15",
      brand: "OnePlus",
      name: "OnePlus 15",
      price: 72999,
      ram: "16GB",
      storage: "512GB",
      display: "6.8-inch Fluid AMOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Triple 50MP camera system",
      battery: "5400mAh",
      description: "A fast and fluid smartphone focused on high-end performance, smooth UI, and strong battery life."
    },
    {
      id: "google-pixel-10-pro-xl",
      brand: "Google",
      name: "Google Pixel 10 Pro XL",
      price: 124999,
      ram: "12GB",
      storage: "256GB",
      display: "6.8-inch OLED",
      processor: "Tensor G5",
      camera: "Triple 50MP AI camera system",
      battery: "5000mAh",
      description: "An intelligent camera-first phone with clean Android design and helpful AI features."
    },
    {
      id: "xiaomi-15-ultra",
      brand: "Xiaomi",
      name: "Xiaomi 15 Ultra",
      price: 109999,
      ram: "16GB",
      storage: "512GB",
      display: "6.8-inch LTPO AMOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Quad 50MP Leica camera system",
      battery: "5500mAh",
      description: "A high-performance device with strong camera capabilities and a vivid display for everyday power users."
    },
    {
      id: "vivo-x200-pro",
      brand: "Vivo",
      name: "Vivo X200 Pro",
      price: 94999,
      ram: "12GB",
      storage: "256GB",
      display: "6.78-inch AMOLED",
      processor: "MediaTek Dimensity 9400",
      camera: "Triple 50MP camera system",
      battery: "6000mAh",
      description: "A stylish premium phone with impressive photography, efficient performance, and a standout design."
    },
    {
      id: "vivo-t4x-5g",
      brand: "Vivo",
      name: "Vivo T4x 5G",
      price: 13999,
      ram: "12GB",
      storage: "256GB",
      display: "6.72-inch IPS LCD",
      processor: "Snapdragon 7s Gen 2",
      camera: "Dual 50MP camera setup",
      battery: "6000mAh",
      description: "A practical 5G smartphone with solid battery life, smooth multitasking, and everyday reliability."
    },
    {
      id: "oppo-find-x9-pro",
      brand: "Oppo",
      name: "OPPO Find X9 Pro",
      price: 109999,
      ram: "8GB",
      storage: "256GB",
      display: "6.78-inch AMOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Triple 50MP camera system",
      battery: "5000mAh",
      description: "A polished flagship with a bright display, fast charging technology, and excellent multimedia performance."
    },
    {
      id: "realme-gt-8-pro",
      brand: "Realme",
      name: "realme GT 8 Pro",
      price: 72999,
      ram: "12GB",
      storage: "512GB",
      display: "6.78-inch AMOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Triple 50MP camera system",
      battery: "5500mAh",
      description: "A performance-focused device designed for gaming, multitasking, and a premium display experience."
    },
    {
      id: "motorola-razr-60-ultra",
      brand: "Motorola",
      name: "Motorola Razr 60 Ultra",
      price: 99999,
      ram: "12GB",
      storage: "256GB",
      display: "6.9-inch pOLED",
      processor: "Snapdragon 8 Gen 4",
      camera: "Dual 50MP camera setup",
      battery: "4000mAh",
      description: "A premium foldable phone with a compact design, immersive display, and stylish modern feel."
    },
    {
      id: "nothing-phone-3",
      brand: "Nothing",
      name: "Nothing Phone (3)",
      price: 79999,
      ram: "8GB",
      storage: "256GB",
      display: "6.7-inch OLED",
      processor: "Snapdragon 8 Gen 2",
      camera: "Dual 50MP camera setup",
      battery: "5000mAh",
      description: "A bold design-led smartphone with a clean software experience and strong everyday performance."
    },
    {
      id: "iqoo-15",
      brand: "iQOO",
      name: "iQOO 15",
      price: 72999,
      ram: "6GB",
      storage: "128GB",
      display: "6.78-inch AMOLED",
      processor: "Snapdragon 8 Gen 3",
      camera: "Triple 50MP camera setup",
      battery: "6000mAh",
      description: "A value-forward performance phone with fast charging, strong multitasking, and a bright display."
    }
  ];

  function getWishlist() {
    const wishlist = localStorage.getItem(wishlistStorageKey);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  function saveWishlist(wishlist) {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
  }

  function getProductById(productId) {
    return productCatalog.find((product) => product.id === productId) || productCatalog[0];
  }

  function formatPrice(value) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function renderProduct(product) {
    const brandElement = document.querySelector(".product-info .product-brand");
    const titleElement = document.querySelector(".product-info h1");
    const priceElement = document.querySelector(".product-info .price");
    const descriptionElement = document.querySelector(".product-info .description");
    const availabilityElement = document.querySelector(".product-info .availability");
    const specsList = document.querySelector(".spec-section ul");

    if (brandElement) {
      brandElement.textContent = product.brand;
    }

    if (titleElement) {
      titleElement.textContent = product.name;
    }

    if (priceElement) {
      priceElement.textContent = formatPrice(product.price);
    }

    if (descriptionElement) {
      descriptionElement.textContent = product.description;
    }

    if (availabilityElement) {
      availabilityElement.textContent = "In Stock";
    }

    if (specsList) {
      specsList.innerHTML = `
        <li><strong>RAM:</strong> ${product.ram}</li>
        <li><strong>Storage:</strong> ${product.storage}</li>
        <li><strong>Display:</strong> ${product.display}</li>
        <li><strong>Processor:</strong> ${product.processor}</li>
        <li><strong>Camera:</strong> ${product.camera}</li>
        <li><strong>Battery:</strong> ${product.battery}</li>
      `;
    }

    if (addToCartButton) {
      addToCartButton.setAttribute("data-id", product.id);
      addToCartButton.setAttribute("data-name", product.name);
      addToCartButton.setAttribute("data-brand", product.brand);
      addToCartButton.setAttribute("data-price", String(product.price));
      addToCartButton.setAttribute("data-product-id", product.id);
      addToCartButton.dataset.id = product.id;
      addToCartButton.dataset.name = product.name;
      addToCartButton.dataset.brand = product.brand;
      addToCartButton.dataset.price = String(product.price);
      addToCartButton.dataset.productId = product.id;
      addToCartButton.textContent = "Add to Cart";
    }

    if (wishlistButton) {
      wishlistButton.setAttribute("data-id", product.id);
      wishlistButton.setAttribute("data-name", product.name);
      wishlistButton.setAttribute("data-brand", product.brand);
      wishlistButton.setAttribute("data-price", String(product.price));
      wishlistButton.dataset.id = product.id;
      wishlistButton.dataset.name = product.name;
      wishlistButton.dataset.brand = product.brand;
      wishlistButton.dataset.price = String(product.price);
    }

    updateWishlistState(product.id);

    if (window.MobileHubCart && typeof window.MobileHubCart.syncCartControls === "function") {
      window.MobileHubCart.syncCartControls(".action-buttons .add-to-cart-btn, .action-buttons .compact-qty-control");
    }
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function updateWishlistState(productId) {
    if (!wishlistButton) {
      return;
    }

    const wishlist = getWishlist();
    const isActive = wishlist.some((item) => item.id === productId);

    wishlistButton.classList.toggle("active", isActive);
    wishlistButton.textContent = isActive ? "♥ Added to Wishlist" : "Add to Wishlist";
  }

  quantityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      let value = Number(quantityInput.value);

      if (action === "plus") {
        value += 1;
      } else if (action === "minus" && value > 1) {
        value -= 1;
      }

      quantityInput.value = value;
    });
  });

  if (wishlistButton) {
    wishlistButton.addEventListener("click", () => {
      const product = getProductById(wishlistButton.getAttribute("data-id") || "iphone-17-pro-max");

      const wishlist = getWishlist();
      const existingItem = wishlist.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
        saveWishlist(updatedWishlist);
      } else {
        wishlist.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price
        });
        saveWishlist(wishlist);
      }

      updateWishlistState(product.id);
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    });
  }

  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const quantity = Number(quantityInput.value) || 1;
      window.MobileHubCart.addProductToCart(addToCartButton, quantity);
    });
  }

  const params = new URLSearchParams(window.location.search);
  const selectedProduct = getProductById(params.get("product") || "iphone-17-pro-max");
  renderProduct(selectedProduct);

  window.addEventListener("cart-updated", () => {
    if (window.MobileHubCart && typeof window.MobileHubCart.syncCartControls === "function") {
      window.MobileHubCart.syncCartControls(".action-buttons .add-to-cart-btn, .action-buttons .compact-qty-control");
    }
    updateWishlistState(selectedProduct.id);
  });
});
