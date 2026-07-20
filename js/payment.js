document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "mobileHubCart";
  const checkoutForm = document.getElementById("checkoutForm");
  const emptyState = document.getElementById("emptyState");
  const checkoutFormCard = document.getElementById("checkoutFormCard");
  const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
  const cardFields = document.getElementById("cardFields");
  const upiFields = document.getElementById("upiFields");
  const qrFields = document.getElementById("qrFields");
  const qrAmount = document.getElementById("qrAmount");
  const qrImage = document.querySelector("#qrFields img");
  const completeQrButton = document.getElementById("completeQrButton");
  const successModal = document.getElementById("successModal");
  const successText = document.getElementById("successText");
  const orderItems = document.getElementById("orderItems");
  const summaryItems = document.getElementById("summaryItems");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryTotal = document.getElementById("summaryTotal");

  successModal.classList.add("hidden");

  function setupQrPlaceholder() {
    if (!qrImage) {
      return;
    }

    const testImage = new Image();
    testImage.onload = () => {
      qrImage.src = "images/payment/payment-qr.png";
    };
    testImage.onerror = () => {
      qrImage.remove();
      const placeholder = document.createElement("div");
      placeholder.className = "qr-placeholder";
      placeholder.textContent = "QR Code Placeholder";
      qrFields.querySelector(".qr-card").insertBefore(placeholder, qrFields.querySelector(".qr-card").firstChild);
    };
    testImage.src = "images/payment/payment-qr.png";
  }

  function getCart() {
    const storedCart = localStorage.getItem(storageKey);
    return storedCart ? JSON.parse(storedCart) : [];
  }

  function formatPrice(value) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function renderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
      emptyState.classList.remove("hidden");
      checkoutFormCard.classList.add("hidden");
      orderItems.innerHTML = "";
      summaryItems.textContent = "0";
      summarySubtotal.textContent = formatPrice(0);
      summaryTotal.textContent = formatPrice(0);
      qrAmount.textContent = formatPrice(0);
      return;
    }

    emptyState.classList.add("hidden");
    checkoutFormCard.classList.remove("hidden");

    let subtotal = 0;
    let itemCount = 0;

    orderItems.innerHTML = "";

    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      itemCount += item.quantity;

      const row = document.createElement("div");
      row.className = "order-item";
      row.innerHTML = `
        <strong>${item.name}</strong>
        <span>${item.quantity} × ${formatPrice(item.price)}</span>
      `;
      orderItems.appendChild(row);
    });

    summaryItems.textContent = itemCount;
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryTotal.textContent = formatPrice(subtotal);
    qrAmount.textContent = formatPrice(subtotal);
  }

  function showPaymentFields(method) {
    cardFields.classList.add("hidden");
    upiFields.classList.add("hidden");
    qrFields.classList.add("hidden");

    if (method === "card") {
      cardFields.classList.remove("hidden");
    } else if (method === "upi") {
      upiFields.classList.remove("hidden");
    } else if (method === "qr") {
      qrFields.classList.remove("hidden");
    }
  }

  function validateForm(method) {
    const requiredFields = [
      ["fullName", "Full Name"],
      ["mobile", "Mobile Number"],
      ["email", "Email"],
      ["address", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["pinCode", "PIN Code"]
    ];

    for (const [id, label] of requiredFields) {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        alert(`${label} is required.`);
        field.focus();
        return false;
      }
    }

    const mobile = document.getElementById("mobile").value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      document.getElementById("mobile").focus();
      return false;
    }

    const pinCode = document.getElementById("pinCode").value.trim();
    if (!/^\d{6}$/.test(pinCode)) {
      alert("Please enter a valid 6-digit PIN code.");
      document.getElementById("pinCode").focus();
      return false;
    }

    if (method === "card") {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardName = document.getElementById("cardName").value.trim();
      const expiryDate = document.getElementById("expiryDate").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Please enter a valid 16-digit card number.");
        document.getElementById("cardNumber").focus();
        return false;
      }

      if (!cardName) {
        alert("Cardholder name is required.");
        document.getElementById("cardName").focus();
        return false;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        alert("Please enter a valid expiry date in MM/YY format.");
        document.getElementById("expiryDate").focus();
        return false;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        alert("Please enter a valid CVV.");
        document.getElementById("cvv").focus();
        return false;
      }
    }

    if (method === "upi") {
      const upiId = document.getElementById("upiId").value.trim();
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId)) {
        alert("Please enter a valid UPI ID.");
        document.getElementById("upiId").focus();
        return false;
      }
    }

    return true;
  }

  function placeOrder() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!validateForm(selectedMethod)) {
      return;
    }

    const orderId = `MH${Date.now().toString().slice(-6)}`;
    successText.innerHTML = `Order Placed Successfully!<br><strong>Order ID: ${orderId}</strong>`;
    successModal.classList.remove("hidden");

    localStorage.removeItem(storageKey);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  paymentMethodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      showPaymentFields(input.value);
    });
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    placeOrder();
  });

  completeQrButton.addEventListener("click", () => {
    placeOrder();
  });

  setupQrPlaceholder();
  renderSummary();
  showPaymentFields("card");
});
