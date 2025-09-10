import { getParam, setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

export default class ProductDetails {
  constructor(productIdValue, dataSource) {
    this.productId = productIdValue; 
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // console.log("Loading product with ID:", this.productId);
      
      this.product = await this.dataSource.findProductById(this.productId);
      // console.log("Product loaded:", this.product);
      
      if (!this.product) {
        // console.error("Product not found with ID:", this.productId);
        this.showError("Product not found");
        return;
      }
      
      this.renderProductDetails();
      
      // Check that the button exists
      const addButton = document.getElementById("addToCart");
      if (addButton) {
        addButton.addEventListener("click", this.addToCart.bind(this));
        // console.log("Event listener attached to the button");
      } else {
        // console.error("\"Add to Cart\" button not found!");
      }
    } catch (error) {
      // console.error("Error loading product:", error);
      this.showError("Product loading error");
    }
  }

  addToCart() {
    // console.log("Click on \"Add to Cart\"");
    // console.log("Product to add:", this.product);
    
    try {
      // Retrieve the current basket or initialize an empty array
      let cart = getLocalStorage("so-cart") || [];
      // console.log("Current cart:", cart);
      // console.log("Cart type:", typeof cart);
      // console.log("Is array:", Array.isArray(cart));
      
      // Ensure cart is always an array
      if (!Array.isArray(cart)) {
        // console.warn("Cart is not an array, converting to array");
        if (cart && typeof cart === "object" && cart !== null) {
          cart = [cart]; 
        } else {
          cart = []; 
        }
      }
      
      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.Id === this.product.Id);
      
      if (existingItemIndex >= 0) {
        // Product already in cart, increase quantity
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        // console.log("Increased quantity");
      } else {
        // New product, add with quantity 1
        const productToAdd = {...this.product, quantity: 1};
        cart.push(productToAdd);
        // console.log("New product added");
      }
      
      // Save updated shopping cart
      const success = setLocalStorage("so-cart", cart);
      
      if (success) {
        // console.log("Basket successfully saved");
        alert(`${this.product.Name} has been added to your cart!`);
      } else {
        // console.error("Error saving shopping cart");
        alert("Error adding to cart!");
      }
    } catch (error) {
      // console.error("Error in addToCart:", error);
      // console.error("Error details:", error.message);
      alert("Technical error when adding to cart. Check console for details.");
    }
  }

 renderProductDetails() {
  const product = this.product;
  
  try {
    document.getElementById("product-brand").textContent = product.Brand?.Name || "";
    document.getElementById("product-name").textContent = product.Name;
    document.getElementById("product-price").textContent = `$${product.FinalPrice}`;
    document.getElementById("product-color").textContent = product.Colors?.[0]?.ColorName || "";
    document.getElementById("product-description").textContent = product.Description;

    let imagePath = product.Image || product.Images?.Primary;
    
    if (imagePath && imagePath.startsWith("../")) {
      imagePath = imagePath.substring(3);
    }
    
    if (imagePath && !imagePath.startsWith("/")) {
      imagePath = "/" + imagePath;
    }

    document.getElementById("product-image").src = imagePath;
    document.getElementById("product-image").alt = product.Name;
    
    document.title = `Sleep Outside | ${product.Name}`;
    
  } catch (error) {
    console.error("Error rendering details:", error);
  }
}

  showError(message) {
    const productDetailSection = document.querySelector(".product-detail");
    if (productDetailSection) {
      productDetailSection.innerHTML = `
        <div class="error">
          <h2>Error</h2>
          <p>${message}</p>
          <a href="../index.html">Back to home page</a>
        </div>
      `;
    }
  }
}

// Initialize the product details page
// console.log("Initializing the product page");
const productId = getParam("product");
// console.log("Product ID from URL:", productId);

if (productId) {
  const dataSource = new ProductData("tents");
  const product = new ProductDetails(productId, dataSource);
  product.init();
} else {
  // console.error("No product ID found in the URL");
  const product = new ProductDetails();
  product.showError("Product not specified in the URL");
}