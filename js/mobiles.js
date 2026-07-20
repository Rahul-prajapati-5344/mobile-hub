document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const wishlistButtons = document.querySelectorAll(".product-card .icon-btn");
  const wishlistStorageKey = "mobileHubWishlist";

  let activeBrand = "all";
  let searchTerm = "";

  const params = new URLSearchParams(window.location.search);
  const brandFromUrl = params.get("brand");

  if (brandFromUrl) {
    activeBrand = brandFromUrl;
    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.getAttribute("data-brand") === brandFromUrl);
    });
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

  function updateWishlistStates() {
    const wishlist = getWishlist();

    wishlistButtons.forEach((button) => {
      const productName = button.closest(".product-card").getAttribute("data-name");
      const productId = slugify(productName);
      const isActive = wishlist.some((item) => item.id === productId);

      button.classList.toggle("active", isActive);
      button.textContent = isActive ? "♥" : "♡";
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateProducts() {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const brand = card.getAttribute("data-brand").toLowerCase();
      const name = card.getAttribute("data-name").toLowerCase();
      const matchesBrand = activeBrand === "all" || brand === activeBrand.toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());

      if (matchesBrand && matchesSearch) {
        card.classList.remove("hidden-card");
        visibleCount++;
      } else {
        card.classList.add("hidden-card");
      }
    });

    const noResultsMessage = document.querySelector(".no-results");
    if (visibleCount === 0) {
      if (!noResultsMessage) {
        const message = document.createElement("p");
        message.className = "no-results";
        message.textContent = "No mobile matches your search.";
        document.querySelector(".products-section .container").appendChild(message);
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }

  function syncCartButtons() {
    if (window.MobileHubCart && typeof window.MobileHubCart.syncCartControls === "function") {
      window.MobileHubCart.syncCartControls(".product-card .add-to-cart-btn, .product-card .add-cart-btn, .product-card .compact-qty-control");
    }
  }

  function toggleWishlist(button) {
    const card = button.closest(".product-card");
    const product = {
      id: slugify(card.getAttribute("data-name")),
      name: card.getAttribute("data-name"),
      brand: card.getAttribute("data-brand"),
      price: Number(card.querySelector(".price").textContent.replace(/[^\d]/g, ""))
    };

    const wishlist = getWishlist();
    const existingItem = wishlist.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      saveWishlist(updatedWishlist);
    } else {
      wishlist.push(product);
      saveWishlist(wishlist);
    }

    updateWishlistStates();
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  }

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    updateProducts();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeBrand = button.getAttribute("data-brand");
      updateProducts();
    });
  });

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => toggleWishlist(button));
  });

  updateWishlistStates();
  updateProducts();
  syncCartButtons();

  window.addEventListener("cart-updated", syncCartButtons);
});
