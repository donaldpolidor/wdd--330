import { updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// load header and footer
loadHeaderFooter();

// Initialize product data
const dataSource = new ProductData();

// Initialize the product list if we are on the home page
if (document.querySelector(".product-list")) {
  const listElement = document.querySelector(".product-list");
  const productList = new ProductList("tents", dataSource, listElement);
  productList.init();
}

// Initialize the basket counter when the page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

// Listen for shopping cart update events
document.addEventListener('cartUpdated', function() {
  updateCartCount();
  console.log("Basket updated - counter refreshed");
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

// Verifying module loading
console.log("Main.js successfully loaded");