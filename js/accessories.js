document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  let activeCategory = "all";

  function updateProducts() {
    productCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const matchesCategory = activeCategory === "all" || category === activeCategory;

      if (matchesCategory) {
        card.classList.remove("hidden-card");
      } else {
        card.classList.add("hidden-card");
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.getAttribute("data-category");
      updateProducts();
    });
  });

  updateProducts();
});
