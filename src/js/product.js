import { addProductToCart, updateCartCount } from "./utils.mjs";

// Product class to handle product page functionality
class ProductDetails {
  constructor(id, dataSource) {
    this.productId = id;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Get product data
    this.product = await this.dataSource.findProductById(this.productId);

    // Render product details
    this.renderProductDetails();

    // Add event listener to Add to Cart button
    this.addToCartHandler();
  }

  renderProductDetails() {
    // Render product details to the page
    document.querySelector(".product-detail").innerHTML = `
      <h2>${this.product.Name}</h2>
      <img src="${this.product.Image}" alt="${this.product.Name}">
      <p>${this.product.Description}</p>
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <button id="addToCart" class="add-to-cart" data-id="${this.product.Id}">Add to Cart</button>
    `;
  }

  addToCartHandler() {
    // Add click event to Add to Cart button
    document.querySelector("#addToCart").addEventListener("click", () => {
      addProductToCart(this.product);
      updateCartCount();
      alert("Product added to cart!");
    });
  }
}

// Initialize product page if we're on a product detail page
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("product");

if (productId) {
  // Import ProductData and create an instance
  import("./ProductData.mjs")
    .then((module) => {
      const ProductData = module.default;
      const dataSource = new ProductData();
      const productPage = new ProductDetails(productId, dataSource);
      productPage.init();
    })
    .catch((error) => {
      // Error handling
    });
}
