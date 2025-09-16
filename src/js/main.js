import { updateCartCount, addProductToCart, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// load header and footer
loadHeaderFooter();

// Initialize product data
const dataSource = new ProductData("tents");

// Initialize product list if on homepage
if (document.querySelector(".product-list")) {
  const listElement = document.querySelector(".product-list");
  const productList = new ProductList("tents", dataSource, listElement);
  productList.init();
}

// Initialize the basket counter when the page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Add event listeners to the Add to Cart button
  document.addEventListener("click", function (e) {
    if (e.target.id === "addToCart" || e.target.closest("#addToCart")) {
      e.preventDefault();

      const button =
        e.target.id === "addToCart" ? e.target : e.target.closest("#addToCart");
      const productIdFromButton = button.dataset.id;

      if (productIdFromButton) {
        const productName =
          document.querySelector("h2")?.textContent ||
          "Product " + productIdFromButton;
        const productImage =
          document.querySelector(".product-detail img")?.src ||
          "default-image.jpg";
        const productPriceText =
          document.querySelector(".product-card__price")?.textContent || "$0";
        const productPrice = parseFloat(productPriceText.replace("$", "")) || 0;
        const productColor =
          document.querySelector(".product__color")?.textContent || "Default";

        const productData = {
          Id: productIdFromButton,
          Name: productName,
          Image: productImage,
          FinalPrice: productPrice,
          Colors: [{ ColorName: productColor }],
        };

        addProductToCart(productData);
        updateCartCount();
        alert("Product added to cart!");
      }
    }
  });
});