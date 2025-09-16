import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  let imagePath = item.Image || item.Images?.Primary;
  
  // Path normalization
  if (imagePath) {
    if (imagePath.startsWith("/")) {
      imagePath = imagePath.substring(1);
    }
    if (!imagePath.startsWith("images/")) {
      imagePath = "images/" + imagePath;
    }
    imagePath = "/" + imagePath;
  }
  
  return `<li class="cart-card divider">
    <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${imagePath}" alt="${item.Name}" onerror="console.error('Image failed to load:', this.src)">
    </a>
    <a href="../product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor() {
    this.cartListElement = document.querySelector(".product-list");
  }

  init() {
    this.renderCartContents();
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    
    if (!this.cartListElement) {
      return;
    }

    if (cartItems.length === 0) {
      this.cartListElement.innerHTML = "<li class=\"empty-cart\">Your cart is empty</li>";
      return;
    }

    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    this.cartListElement.innerHTML = htmlItems.join("");
  }
}