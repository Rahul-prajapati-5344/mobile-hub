document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const cartStorageKey = "mobileHubCart";
  const wishlistStorageKey = "mobileHubWishlist";

  function getCart() {
    const cart = localStorage.getItem(cartStorageKey);
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function getWishlist() {
    const wishlist = localStorage.getItem(wishlistStorageKey);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  function saveWishlist(wishlist) {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function getProductId(element) {
    if (!element) {
      return "";
    }

    if (element.getAttribute("data-id")) {
      return element.getAttribute("data-id");
    }

    const productName = element.getAttribute("data-name");
    return productName ? slugify(productName) : "";
  }

  function updateCartBadge() {
    const cart = getCart();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll(".cart-badge, #cartBadge");

    badges.forEach((badge) => {
      badge.textContent = totalQuantity;
    });
  }

  function updateWishlistBadge() {
    const count = getWishlist().length;
    const badges = document.querySelectorAll(".wishlist-badge, #wishlistBadge");

    badges.forEach((badge) => {
      badge.textContent = count;
    });

    const wishlistNavLink = document.querySelector('.nav-links a[href="wishlist.html"]');
    if (wishlistNavLink && badges.length === 0) {
      const badge = document.createElement("span");
      badge.className = "wishlist-badge";
      badge.textContent = count;
      wishlistNavLink.appendChild(badge);
    }
  }

  function updateBadges() {
    updateCartBadge();
    updateWishlistBadge();
  }

  function createAddButton(sourceElement, productId) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = sourceElement.classList.contains("compact-qty-control") ? "btn add-to-cart-btn" : sourceElement.className || "btn add-to-cart-btn";
    button.textContent = "Add to Cart";

    if (sourceElement.hasAttribute("data-id")) {
      button.setAttribute("data-id", sourceElement.getAttribute("data-id"));
    }
    if (sourceElement.hasAttribute("data-name")) {
      button.setAttribute("data-name", sourceElement.getAttribute("data-name"));
    }
    if (sourceElement.hasAttribute("data-brand")) {
      button.setAttribute("data-brand", sourceElement.getAttribute("data-brand"));
    }
    if (sourceElement.hasAttribute("data-price")) {
      button.setAttribute("data-price", sourceElement.getAttribute("data-price"));
    }

    button.setAttribute("data-product-id", productId);
    button.dataset.productId = productId;
    return button;
  }

  function createQuantityControl(sourceElement, productId, quantity) {
    const control = document.createElement("div");
    control.className = "compact-qty-control";
    control.innerHTML = `
      <button class="qty-btn qty-btn-minus" type="button" aria-label="Decrease quantity">−</button>
      <span class="qty-value">${quantity}</span>
      <button class="qty-btn qty-btn-plus" type="button" aria-label="Increase quantity">+</button>
    `;

    if (sourceElement.hasAttribute("data-id")) {
      control.setAttribute("data-id", sourceElement.getAttribute("data-id"));
    }
    if (sourceElement.hasAttribute("data-name")) {
      control.setAttribute("data-name", sourceElement.getAttribute("data-name"));
    }
    if (sourceElement.hasAttribute("data-brand")) {
      control.setAttribute("data-brand", sourceElement.getAttribute("data-brand"));
    }
    if (sourceElement.hasAttribute("data-price")) {
      control.setAttribute("data-price", sourceElement.getAttribute("data-price"));
    }

    control.setAttribute("data-product-id", productId);
    control.dataset.productId = productId;
    return control;
  }

  function addCartItem(item, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find((product) => product.id === item.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    saveCart(cart);
    return cart;
  }

  function addProductToCart(element, quantity = 1) {
    const product = {
      id: getProductId(element),
      name: element.getAttribute("data-name") || "",
      brand: element.getAttribute("data-brand") || "",
      price: Number(element.getAttribute("data-price")) || 0
    };

    if (!product.id) {
      return;
    }

    addCartItem(product, quantity);
    renderCartControl(element);
  }

  function changeQuantity(element, change) {
    const productId = element.getAttribute("data-product-id") || getProductId(element);
    const cart = getCart();
    const item = cart.find((product) => product.id === productId);

    if (!item) {
      return;
    }

    item.quantity = Math.max(0, item.quantity + change);

    if (item.quantity === 0) {
      const updatedCart = cart.filter((product) => product.id !== productId);
      saveCart(updatedCart);
      renderCartControl(element);
      return;
    }

    saveCart(cart);
    renderCartControl(element);
  }

  function bindAddButton(button) {
    if (button.dataset.bound === "true") {
      return;
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      addProductToCart(button, 1);
    });

    button.dataset.bound = "true";
  }

  function bindQuantityControl(control) {
    if (control.dataset.bound === "true") {
      return;
    }

    control.addEventListener("click", (event) => {
      const qtyButton = event.target.closest(".qty-btn");
      if (!qtyButton) {
        return;
      }

      const change = qtyButton.classList.contains("qty-btn-plus") ? 1 : -1;
      changeQuantity(control, change);
    });

    control.dataset.bound = "true";
  }

  function renderCartControl(element) {
    const productId = getProductId(element);
    if (!productId) {
      return;
    }

    const cart = getCart();
    const item = cart.find((product) => product.id === productId);

    if (item) {
      if (element.classList.contains("compact-qty-control")) {
        const qtyValue = element.querySelector(".qty-value");
        if (qtyValue) {
          qtyValue.textContent = item.quantity;
        }
        bindQuantityControl(element);
        return;
      }

      const control = createQuantityControl(element, productId, item.quantity);
      bindQuantityControl(control);
      element.replaceWith(control);
      return;
    }

    if (element.classList.contains("compact-qty-control")) {
      const addButton = createAddButton(element, productId);
      bindAddButton(addButton);
      element.replaceWith(addButton);
      return;
    }

    element.textContent = "Add to Cart";
    bindAddButton(element);
  }

  function syncCartControls(selector) {
    const controls = document.querySelectorAll(selector);
    controls.forEach((element) => {
      renderCartControl(element);
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  updateBadges();
  syncCartControls(".add-to-cart-btn, .add-cart-btn");
  window.addEventListener("cart-updated", () => {
    updateBadges();
    syncCartControls(".add-to-cart-btn, .add-cart-btn");
  });
  window.addEventListener("wishlist-updated", updateBadges);
  window.addEventListener("storage", updateBadges);

  window.MobileHubCart = {
    getCart,
    saveCart,
    getWishlist,
    saveWishlist,
    slugify,
    addCartItem,
    addProductToCart,
    changeQuantity,
    renderCartControl,
    syncCartControls,
    updateCartBadge,
    updateWishlistBadge,
    getProductId
  };
});
