import { getParam, setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null;
    this.addButtonClicked = false;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      
      if (!this.product) {
        this.showError("Product not found");
        return;
      }
      
      this.renderProductDetails();
      this.addToCartListener();
    } catch (error) {
      console.error("Error while loading:", error);
      this.showError("Error loading product");
    }
  }

  renderProductDetails() {
    const product = this.product;
    
    const imagePath = product.Images?.PrimaryLarge || 
                     product.Images?.PrimaryMedium || 
                     product.Images?.Primary ||
                     "/images/placeholder.jpg";
    
    document.getElementById("product-brand").textContent = product.Brand?.Name || "";
    document.getElementById("product-name").textContent = product.Name;
    document.getElementById("product-price").textContent = `$${product.FinalPrice}`;
    document.getElementById("product-color").textContent = product.Colors?.[0]?.ColorName || "";
    document.getElementById("product-description").textContent = product.Description;

    document.getElementById("product-image").src = imagePath;
    document.getElementById("product-image").alt = product.Name;
    
    document.title = `Sleep Outside | ${product.Name}`;
  }

  addToCartListener() {
    const addButton = document.getElementById("addToCart");
    if (addButton) {
      // DELETE ALL OLD HEADPHONES
      const newButton = addButton.cloneNode(true);
      addButton.parentNode.replaceChild(newButton, addButton);
      
      // ADD A SINGLE CLEAN EARPHONE
      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        // PREVENT DOUBLE CLICKS
        if (this.addButtonClicked) return;
        this.addButtonClicked = true;
        
        // DISABLE THE BUTTON FOR 2 SECONDS
        newButton.disabled = true;
        newButton.textContent = "Adding...";
        
        this.addToCart();
        
        // REACTIVATE AFTER 2 SECONDS
        setTimeout(() => {
          this.addButtonClicked = false;
          newButton.disabled = false;
          newButton.textContent = "Add to Cart";
        }, 2000);
      });
    }
  }

  addToCart() {
    let cart = getLocalStorage("so-cart") || [];
    
    const imagePath = this.product.Images?.PrimaryMedium || 
                     this.product.Images?.Primary ||
                     "/images/placeholder.jpg";

    const productToAdd = {
      Id: this.product.Id,
      Name: this.product.Name,
      Image: imagePath,
      FinalPrice: this.product.FinalPrice,
      Colors: this.product.Colors || [{ ColorName: "N/A" }],
      quantity: 1
    };
    
    const existingItemIndex = cart.findIndex(item => item.Id === productToAdd.Id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(productToAdd);
    }
    
    setLocalStorage("so-cart", cart);
    
    // SINGLE ALERT - no duplicate messages
    alert(`${this.product.Name} has been added to your cart!`);
    
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
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