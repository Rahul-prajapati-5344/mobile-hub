document.addEventListener("DOMContentLoaded", () => {
  const wishlistItemsContainer = document.getElementById("wishlistItems");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const wishlistStorageKey = "mobileHubWishlist";
  const cartStorageKey = "mobileHubCart";

  function getWishlist() {
    const stored = localStorage.getItem(wishlistStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  function saveWishlist(list) {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(list));
  }

  function getCart() {
    const stored = localStorage.getItem(cartStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }

  function formatPrice(value) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function updateWishlistBadge() {
    const count = getWishlist().length;
    const navLink = document.querySelector('.nav-links a[href="wishlist.html"]');

    if (!navLink) {
      return;
    }

    let badge = navLink.querySelector(".wishlist-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "wishlist-badge";
      navLink.appendChild(badge);
    }

    badge.textContent = count;
  }

  function renderWishlist() {
    const wishlist = getWishlist();
    updateWishlistBadge();

    if (!wishlistItemsContainer) {
      return;
    }

    if (wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = "";
      if (emptyWishlist) {
        emptyWishlist.classList.remove("hidden");
      }
      return;
    }

    if (emptyWishlist) {
      emptyWishlist.classList.add("hidden");
    }

    wishlistItemsContainer.innerHTML = "";

    wishlist.forEach((item) => {
      const card = document.createElement("article");
      card.className = "wishlist-card";
      card.innerHTML = `
        <div class="wishlist-image">Image Placeholder</div>
        <div class="wishlist-details">
          <p class="wishlist-brand">${item.brand}</p>
          <h3>${item.name}</h3>
          <p class="wishlist-price">${formatPrice(item.price)}</p>
          <div class="wishlist-actions">
            <button class="remove-btn" type="button" data-id="${item.id}">Remove</button>
            <button class="add-cart-btn" type="button" data-id="${item.id}" data-name="${item.name}" data-brand="${item.brand}" data-price="${item.price}">Add to Cart</button>
          </div>
          <p class="wishlist-actions">
            <a href="product.html" class="text-link">View Details</a>
          </p>
        </div>
      `;
      wishlistItemsContainer.appendChild(card);
    });

    window.MobileHubCart.syncCartControls(".add-cart-btn, .compact-qty-control");
  }

  function addToCart(item) {
    window.MobileHubCart.addCartItem(item, 1);
  }

  function removeFromWishlist(id) {
    const updatedWishlist = getWishlist().filter((item) => item.id !== id);
    saveWishlist(updatedWishlist);
    renderWishlist();
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  }

  function toggleWishlist(product) {
    const wishlist = getWishlist();
    const existingItem = wishlist.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      saveWishlist(updatedWishlist);
    } else {
      wishlist.push(product);
      saveWishlist(wishlist);
    }

    renderWishlist();
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    return !existingItem;
  }

  window.toggleWishlistItem = toggleWishlist;
  window.getWishlistItems = getWishlist;

  if (wishlistItemsContainer) {
    wishlistItemsContainer.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }

      const id = button.getAttribute("data-id");
      if (!id) {
        return;
      }

      if (button.classList.contains("remove-btn")) {
        removeFromWishlist(id);
      } else if (button.classList.contains("add-cart-btn")) {
        const item = getWishlist().find((product) => product.id === id);
        if (item) {
          addToCart(item);
        }
      }
    });
  }

  window.addEventListener("wishlist-updated", () => {
    renderWishlist();
  });

  window.addEventListener("cart-updated", () => {
    renderWishlist();
  });

  renderWishlist();
});

