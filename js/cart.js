document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const summaryItems = document.getElementById("summaryItems");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryTotal = document.getElementById("summaryTotal");
  const cartBadge = document.getElementById("cartBadge");
  const clearCartButton = document.querySelector(".clear-btn");
  const storageKey = "mobileHubCart";

  function getCart() {
    const cart = localStorage.getItem(storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function updateBadge(cart) {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalQuantity;
    }
  }

  function formatPrice(value) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function renderCart() {
    const cart = getCart();
    updateBadge(cart);

    if (!cartItemsContainer) {
      return;
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add a phone or accessory to get started.</p>
          <a href="mobiles.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      if (summaryItems) summaryItems.textContent = "0";
      if (summarySubtotal) summarySubtotal.textContent = formatPrice(0);
      if (summaryTotal) summaryTotal.textContent = formatPrice(0);
      return;
    }

    cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    let itemCount = 0;

    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      itemCount += item.quantity;

      const card = document.createElement("div");
      card.className = "cart-card";
      card.innerHTML = `
        <div class="cart-image">Image Placeholder</div>
        <div class="cart-details">
          <h3>${item.name}</h3>
          <p class="cart-meta">${item.brand}</p>
          <p class="cart-price">${formatPrice(item.price)}</p>
          <div class="cart-actions">
            <div class="qty-control">
              <button class="qty-btn" type="button" data-action="minus" data-id="${item.id}">−</button>
              <input type="number" value="${item.quantity}" min="1" readonly />
              <button class="qty-btn" type="button" data-action="plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" type="button" data-id="${item.id}">Remove</button>
          </div>
        </div>
        <div class="cart-subtotal">${formatPrice(itemSubtotal)}</div>
      `;
      cartItemsContainer.appendChild(card);
    });

    if (summaryItems) summaryItems.textContent = itemCount;
    if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
    if (summaryTotal) summaryTotal.textContent = formatPrice(subtotal);
  }

  function changeQuantity(id, action) {
    const cart = getCart();
    const item = cart.find((product) => product.id === id);

    if (!item) {
      return;
    }

    if (action === "plus") {
      item.quantity += 1;
    } else if (action === "minus") {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    saveCart(cart);
    renderCart();
  }

  function removeItem(id) {
    const cart = getCart().filter((product) => product.id !== id);
    saveCart(cart);
    renderCart();
  }

  cartItemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const id = button.getAttribute("data-id");
    if (!id) {
      return;
    }

    if (button.classList.contains("remove-btn")) {
      removeItem(id);
    } else if (button.classList.contains("qty-btn")) {
      changeQuantity(id, button.getAttribute("data-action"));
    }
  });

  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
      saveCart([]);
      renderCart();
    });
  }

  renderCart();
});
