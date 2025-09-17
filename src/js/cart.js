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
  // CORRECTING IMAGES IN THE SHOPPING CART
  let imagePath = item.Image;
  
  if (!imagePath || imagePath === "undefined" || imagePath === "null") {
    imagePath = "/images/placeholder.jpg";
  }
  
  if (imagePath && !imagePath.startsWith("/") && !imagePath.startsWith("http")) {
    imagePath = "/" + imagePath;
  }
  
  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${imagePath}" alt="${item.Name}" onerror="this.src='/images/placeholder.jpg'">
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