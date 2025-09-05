import { addProductToCart, updateCartCount } from "./utils.mjs";

// Initialize the basket counter when the page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Add event listeners to the Add to Cart button
  document.addEventListener("click", function (e) {
    // Search by ID only
    if (e.target.id === "addToCart" || e.target.closest("#addToCart")) {
      e.preventDefault();

      const button =
        e.target.id === "addToCart" ? e.target : e.target.closest("#addToCart");
      const productIdFromButton = button.dataset.id; // Changed the name of the variable

      if (productIdFromButton) {
        // use the new name
        // retrieve product data from the HTML page
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
          Id: productIdFromButton, // use the new name
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
