import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// load header and footer
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list");

  if (!cartList) {
    return;
  }

  if (cartItems.length === 0) {
    cartList.innerHTML = "<li class=\"empty-cart\">Your cart is empty</li>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  let imagePath = item.Image || item.Images?.Primary;
  
  // Path normalization
  if (imagePath) {
    if (imagePath.includes("../")) {
      imagePath = imagePath.replace("../", "");
    }
    if (!imagePath.startsWith("images/")) {
      imagePath = "images/" + imagePath;
    }
    imagePath = "/" + imagePath;
  }
  
  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${imagePath}" alt="${item.Name}">
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

// Initialize cart when the module loads
renderCartContents();