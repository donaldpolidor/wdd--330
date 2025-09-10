import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  console.log("🛒 Start rendering the basket");
  
  const cartItems = getLocalStorage("so-cart") || [];
  console.log("📦 Items in cart:", cartItems);
  
  const cartList = document.querySelector(".product-list");
  
  if (!cartList) {
    console.error("❌ List of products not found in the cart");
    return;
  }
  
  if (cartItems.length === 0) {
    console.log("📭 Empty cart");
    cartList.innerHTML = "<li class=\"empty-cart\">Your cart is empty</li>";
    return;
  }
  
  console.log("🎨 Displaying items in the shopping cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  console.log("🖼️ Creation of the template for:", item.Name);
  
  // Check and correct the image path if necessary
  let imagePath = item.Image || item.Images?.Primary;
  console.log("🖼️ Original image path:", imagePath);
  
  if (imagePath && imagePath.includes("../")) {
    imagePath = imagePath.replace("../", "");
    console.log("🖼️ Corrected image path:", imagePath);
  }
  
  if (imagePath && !imagePath.startsWith("images/")) {
    imagePath = "images/" + imagePath;
    console.log("🖼️ Final image path:", imagePath);
  }
  
  return `<li class="cart-card divider">
    <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="../${imagePath}" alt="${item.Name}" onerror="this.src='../images/placeholder.jpg'" />
    </a>
    <a href="../product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

// Initialize cart when the module loads
console.log("🛒 Initializing the shopping cart");
renderCartContents();